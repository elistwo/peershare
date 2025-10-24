
"use client";

import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings2, CornerLeftUp, CornerRightUp, CornerRightDown, CornerLeftDown } from 'lucide-react';
import { BorderRadius } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface BorderRadiusSliderProps {
  value: BorderRadius | undefined;
  onChange: (value: BorderRadius) => void;
}

export function BorderRadiusSlider({ value, onChange }: BorderRadiusSliderProps) {
  const [isCustomizing, setIsCustomizing] = useState(typeof value === 'object');

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      onChange(Math.max(0, Math.min(100, numValue)));
    }
  };

  const handleCornerChange = (corner: 'tl' | 'tr' | 'br' | 'bl', cornerValue: number) => {
    const currentUniform = typeof value === 'number' ? value : 24; // Default to a number
    const currentCorners = typeof value === 'object' && value !== null ? value : {
      tl: currentUniform, tr: currentUniform, br: currentUniform, bl: currentUniform
    };
    onChange({
      ...currentCorners,
      [corner]: cornerValue
    });
  }

  const uniformValue = typeof value === 'number' ? value : (typeof value === 'object' ? null : 12);
  const cornerValues = typeof value === 'object' && value !== null ? value : {
    tl: uniformValue ?? 12, tr: uniformValue ?? 12, br: uniformValue ?? 12, bl: uniformValue ?? 12
  };
  
  const handleToggleCustom = () => {
    const nextIsCustomizing = !isCustomizing;
    setIsCustomizing(nextIsCustomizing);

    if (nextIsCustomizing) {
        // transitioning to custom, use current uniform value
        const currentUniform = typeof value === 'number' ? value : 24;
        onChange({
            tl: currentUniform,
            tr: currentUniform,
            br: currentUniform,
            bl: currentUniform
        });
    } else {
        // transitioning to uniform, use top-left or average
        onChange(cornerValues.tl);
    }
  }


  return (
    <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <Label>Uniform Radius</Label>
            <Button variant="ghost" size="sm" onClick={handleToggleCustom}>
                <Settings2 className="h-4 w-4 mr-2" />
                {isCustomizing ? 'Use Uniform' : 'Customize'}
            </Button>
        </div>
        
        {!isCustomizing && uniformValue !== null && (
             <div className="flex items-center gap-2">
                <Slider
                    value={[uniformValue]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={1}
                />
                <Input
                    type="number"
                    value={uniformValue}
                    onChange={handleInputChange}
                    className="w-20"
                />
            </div>
        )}

        <Collapsible open={isCustomizing}>
            <CollapsibleContent>
                 <div className="space-y-4 mt-2">
                    <CornerControl icon={CornerLeftUp} label="Top-Left" value={cornerValues.tl} onChange={(v) => handleCornerChange('tl', v)} />
                    <CornerControl icon={CornerRightUp} label="Top-Right" value={cornerValues.tr} onChange={(v) => handleCornerChange('tr', v)} />
                    <CornerControl icon={CornerRightDown} label="Bottom-Right" value={cornerValues.br} onChange={(v) => handleCornerChange('br', v)} />
                    <CornerControl icon={CornerLeftDown} label="Bottom-Left" value={cornerValues.bl} onChange={(v) => handleCornerChange('bl', v)} />
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
  );
}


interface CornerControlProps {
    icon: React.ElementType;
    label: string;
    value: number;
    onChange: (value: number) => void;
}

function CornerControl({ icon: Icon, label, value, onChange }: CornerControlProps) {
    return (
        <div className='space-y-2'>
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3 w-3" />
                {label}
            </Label>
            <div className="flex items-center gap-2">
                <Slider
                    value={[value]}
                    onValueChange={(v) => onChange(v[0])}
                    max={100}
                    step={1}
                />
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const numValue = parseInt(e.target.value, 10);
                        if (!isNaN(numValue)) {
                            onChange(Math.max(0, Math.min(100, numValue)));
                        }
                    }}
                    className="w-16 h-8 text-sm"
                />
            </div>
        </div>
    );
}

    