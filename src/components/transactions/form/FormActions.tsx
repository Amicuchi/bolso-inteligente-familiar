
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  cancelText?: string;
  saveText?: string;
  addText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isEditing,
  cancelText = 'Cancelar',
  saveText = 'Salvar',
  addText = 'Adicionar'
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-3">
      <Button variant="outline" type="button" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button type="submit">
        {isEditing ? saveText : addText}
      </Button>
    </div>
  );
};
