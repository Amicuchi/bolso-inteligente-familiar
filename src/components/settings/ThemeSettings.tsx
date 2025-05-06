
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';

interface ThemeSettingsProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  theme,
  onThemeChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema da interface</CardTitle>
        <CardDescription>
          Escolha o tema que melhor se adapta às suas preferências.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={theme}
          onValueChange={(value) => onThemeChange(value as 'light' | 'dark' | 'system')}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="light"
              id="theme-light"
              className="sr-only"
            />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-2 h-6 w-6" />
              Claro
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="dark"
              id="theme-dark"
              className="sr-only"
            />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="mb-2 h-6 w-6" />
              Escuro
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="system"
              id="theme-system"
              className="sr-only"
            />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                [&:has([data-state=checked])]:border-primary"
            >
              <Monitor className="mb-2 h-6 w-6" />
              Sistema
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
