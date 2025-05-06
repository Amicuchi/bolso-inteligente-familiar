
import React from 'react';
import { AutoRule } from '@/types/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

interface AutoRulesProps {
  rules: AutoRule[];
  onAddRule: () => void;
  onEditRule: (rule: AutoRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string, enabled: boolean) => void;
}

export const AutoRules: React.FC<AutoRulesProps> = ({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onToggleRule,
}) => {
  const renderCondition = (rule: AutoRule) => {
    const { field, operator, value } = rule.condition;
    
    const fieldLabels = {
      description: 'Descrição',
      amount: 'Valor',
      date: 'Data',
      category: 'Categoria',
    };
    
    const operatorLabels = {
      contains: 'contém',
      equals: 'é igual a',
      greater_than: 'é maior que',
      less_than: 'é menor que',
      between: 'está entre',
    };
    
    let valueText;
    if (operator === 'between' && Array.isArray(value)) {
      valueText = `${value[0]} e ${value[1]}`;
    } else {
      valueText = value;
    }
    
    return `${fieldLabels[field]} ${operatorLabels[operator]} ${valueText}`;
  };
  
  const renderAction = (rule: AutoRule) => {
    const { type, value } = rule.action;
    
    const actionLabels = {
      set_category: 'Definir categoria como',
      add_tag: 'Adicionar etiqueta',
      notify: 'Enviar notificação',
    };
    
    return `${actionLabels[type]} "${value}"`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Regras automáticas</CardTitle>
          <CardDescription>
            Configure regras para automatizar a categorização de transações e outras ações.
          </CardDescription>
        </div>
        <Button onClick={onAddRule} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova regra
        </Button>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma regra automática configurada.</p>
            <Button variant="outline" className="mt-4" onClick={onAddRule}>
              Criar primeira regra
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className="flex items-start justify-between border rounded-md p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.enabled ? 'default' : 'outline'}>
                      {rule.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  {rule.description && (
                    <p className="text-sm text-muted-foreground">
                      {rule.description}
                    </p>
                  )}
                  
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Condição:</span> {renderCondition(rule)}
                    </p>
                    <p>
                      <span className="font-medium">Ação:</span> {renderAction(rule)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => onToggleRule(rule.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditRule(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
