
import React, { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function TagInput({ value = [], onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      if (!value.includes(inputValue)) {
        const newTags = [...value, inputValue]
        onChange(newTags)
        setInputValue("")
      }
    }
  }

  const removeTag = (tag: string) => {
    const newTags = value.filter((t) => t !== tag)
    onChange(newTags)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma tag e pressione Enter"
      />
    </div>
  )
}
