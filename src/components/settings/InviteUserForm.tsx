
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserRole } from '@/types/user';

const inviteSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  role: z.enum(['admin', 'collaborator', 'visitor']),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteUserFormProps {
  onSubmit: (values: InviteFormValues) => void;
  onCancel: () => void;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'visitor',
      message: '',
    },
  });

  // Mapear roles para português
  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'collaborator', label: 'Colaborador' },
    { value: 'visitor', label: 'Visitante' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value as UserRole}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem personalizada (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione uma mensagem personalizada ao convite..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-3">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Enviar convite
          </Button>
        </div>
      </form>
    </Form>
  );
};
