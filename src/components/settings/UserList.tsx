
import React from 'react';
import { User } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onManagePermissions: (user: User) => void;
  currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEditUser,
  onDeleteUser,
  onManagePermissions,
  currentUserId
}) => {
  // Função para gerar as iniciais do nome do usuário
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Função para mapear o papel a um texto em português
  const getRoleText = (role: User['role']) => {
    const roleMap = {
      'admin': 'Administrador',
      'collaborator': 'Colaborador',
      'visitor': 'Visitante'
    };
    return roleMap[role];
  };

  // Função para determinar a cor do badge de status
  const getStatusVariant = (status: User['status']) => {
    const statusVariant = {
      'active': 'success',
      'pending': 'warning',
      'inactive': 'destructive'
    };
    return statusVariant[status] as "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  };

  // Função para traduzir o status
  const getStatusText = (status: User['status']) => {
    const statusMap = {
      'active': 'Ativo',
      'pending': 'Pendente',
      'inactive': 'Inativo'
    };
    return statusMap[status];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="ml-2">Você</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {getRoleText(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(user.status)}>
                  {getStatusText(user.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {user.lastLogin 
                  ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                  : 'Nunca'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManagePermissions(user)}
                    disabled={user.id === currentUserId}
                    title="Gerenciar permissões"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditUser(user)}
                    title="Editar usuário"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteUser(user.id)}
                    disabled={user.id === currentUserId}
                    title="Excluir usuário"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
