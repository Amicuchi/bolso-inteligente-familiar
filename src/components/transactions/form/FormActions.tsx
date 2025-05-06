
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex justify-end space-x-2 pt-3">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? 'Salvar' : 'Adicionar'}
      </Button>
    </div>
  );
};
