
import React from 'react';
import { NotificationSetting } from '@/types/user';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NotificationSettingsProps {
  settings: NotificationSetting[];
  onUpdate: (settings: NotificationSetting[]) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const notificationsMap = {
    'budget_exceeded': {
      title: 'Orçamento excedido',
      description: 'Notificar quando um orçamento for excedido',
      hasThreshold: true,
      thresholdLabel: '% do orçamento',
      defaultThreshold: 100,
    },
    'goal_reached': {
      title: 'Meta alcançada',
      description: 'Notificar quando uma meta for alcançada',
      hasThreshold: true,
      thresholdLabel: '% da meta',
      defaultThreshold: 100,
    },
    'low_balance': {
      title: 'Saldo baixo',
      description: 'Notificar quando o saldo estiver abaixo de um valor',
      hasThreshold: true,
      thresholdLabel: 'Valor mínimo (R$)',
      defaultThreshold: 100,
    },
    'recurring_transaction': {
      title: 'Transação recorrente',
      description: 'Notificar sobre transações recorrentes próximas',
      hasThreshold: true,
      thresholdLabel: 'Dias antes',
      defaultThreshold: 2,
    },
    'large_expense': {
      title: 'Despesa significativa',
      description: 'Notificar sobre despesas maiores que um valor',
      hasThreshold: true,
      thresholdLabel: 'Valor mínimo (R$)',
      defaultThreshold: 500,
    },
  };

  const handleToggleNotification = (id: string, enabled: boolean) => {
    const newSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled } : setting
    );
    onUpdate(newSettings);
  };

  const handleChangeThreshold = (id: string, threshold: number) => {
    const newSettings = settings.map(setting => 
      setting.id === id ? { ...setting, threshold } : setting
    );
    onUpdate(newSettings);
  };

  const handleToggleChannel = (id: string, channel: 'email' | 'app', checked: boolean) => {
    const newSettings = settings.map(setting => {
      if (setting.id === id) {
        let channels = [...setting.channels];
        if (checked) {
          if (!channels.includes(channel)) {
            channels.push(channel);
          }
        } else {
          channels = channels.filter(c => c !== channel);
        }
        return { ...setting, channels };
      }
      return setting;
    });
    onUpdate(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure quais notificações você deseja receber e como recebê-las.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map(setting => {
          const notificationInfo = notificationsMap[setting.type];
          
          return (
            <div key={setting.id} className="flex flex-col space-y-3 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`notification-${setting.id}`} className="text-md font-medium">
                    {notificationInfo.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {notificationInfo.description}
                  </p>
                </div>
                <Switch
                  id={`notification-${setting.id}`}
                  checked={setting.enabled}
                  onCheckedChange={(checked) => handleToggleNotification(setting.id, checked)}
                />
              </div>
              
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", 
                !setting.enabled && "opacity-50 pointer-events-none")}>
                {notificationInfo.hasThreshold && (
                  <div className="space-y-2">
                    <Label htmlFor={`threshold-${setting.id}`}>
                      {notificationInfo.thresholdLabel}
                    </Label>
                    <Input 
                      id={`threshold-${setting.id}`}
                      type="number"
                      value={setting.threshold || notificationInfo.defaultThreshold}
                      onChange={(e) => handleChangeThreshold(setting.id, Number(e.target.value))}
                      disabled={!setting.enabled}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Canais de notificação</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`channel-app-${setting.id}`}
                        checked={setting.channels.includes('app')} 
                        onCheckedChange={(checked) => 
                          handleToggleChannel(setting.id, 'app', checked === true)
                        }
                        disabled={!setting.enabled}
                      />
                      <Label htmlFor={`channel-app-${setting.id}`}>
                        No aplicativo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`channel-email-${setting.id}`}
                        checked={setting.channels.includes('email')}
                        onCheckedChange={(checked) => 
                          handleToggleChannel(setting.id, 'email', checked === true)
                        }
                        disabled={!setting.enabled}
                      />
                      <Label htmlFor={`channel-email-${setting.id}`}>
                        Por e-mail
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
