
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Tag } from 'lucide-react';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  allTags: string[];
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  tagFilter,
  setTagFilter,
  allTags
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <div className="flex-1 w-full flex items-center space-x-2">
          <Search className="text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 w-full flex items-center space-x-2">
          <Tag className="text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Filtrar por tag..."
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Tags populares:</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`cursor-pointer ${tagFilter === tag ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionFilters;
