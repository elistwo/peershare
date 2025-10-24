
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Edit, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
  containerClassName?: string;
  active?: boolean;
}

export function EditableText({ text, onSave, className, containerClassName, active = true }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(text);
  }, [text]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value.trim() && value.trim() !== text) {
      onSave(value.trim());
    } else {
        setValue(text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(text);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", containerClassName)}>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={cn("h-auto py-0", className)}
        />
        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 shrink-0">
            <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex items-center gap-2 group", containerClassName, { 'cursor-pointer': active })}
      onClick={() => active && setIsEditing(true)}
      onKeyDown={(e) => active && (e.key === 'Enter' || e.key === ' ') && setIsEditing(true)}
      role={active ? "button" : undefined}
      tabIndex={active ? 0 : -1}
    >
        <div className={cn("truncate", className)}>
            {text}
        </div>
        {active && 
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
            >
                <Edit className="h-3 w-3" />
            </Button>
        }
    </div>
  );
}

    