"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface CodeBlockProps {
  children: string
  className?: string
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : "text"

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!match) {
    return (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {children}
      </code>
    )
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border-b border-border">
        <span className="text-sm font-medium text-muted-foreground capitalize">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="bg-muted/30 p-4 rounded-b-lg overflow-x-auto border border-t-0 border-border">
        <code className="text-sm font-mono leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  )
}

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Code blocks
      if (line.startsWith("```")) {
        const language = line.slice(3).trim()
        const codeLines: string[] = []
        i++

        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }

        elements.push(
          <CodeBlock key={i} className={`language-${language}`}>
            {codeLines.join("\n")}
          </CodeBlock>,
        )
        i++
        continue
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold mt-6 mb-4 first:mt-0 text-foreground">
            {line.slice(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-semibold mt-5 mb-3 first:mt-0 text-foreground">
            {line.slice(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-medium mt-4 mb-2 first:mt-0 text-foreground">
            {line.slice(4)}
          </h3>,
        )
      }
      // Lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const listItems: string[] = []
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          listItems.push(lines[i].slice(2))
          i++
        }
        elements.push(
          <ul key={i} className="list-disc list-inside space-y-1 my-3 text-foreground">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>,
        )
        continue
      }
      // Numbered lists
      else if (/^\d+\. /.test(line)) {
        const listItems: string[] = []
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          listItems.push(lines[i].replace(/^\d+\. /, ""))
          i++
        }
        elements.push(
          <ol key={i} className="list-decimal list-inside space-y-1 my-3 text-foreground">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>,
        )
        continue
      }
      // Regular paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={i} className="mb-3 leading-relaxed text-foreground">
            {parseInlineMarkdown(line)}
          </p>,
        )
      }
      // Empty lines
      else {
        elements.push(<div key={i} className="h-2" />)
      }

      i++
    }

    return elements
  }

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">{parseMarkdown(content)}</div>
}
