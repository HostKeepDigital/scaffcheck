import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function OperativeListToolbar({ search, onSearchChange, shown, total, filtersActive, onClear }) {
  return (
    <div className="mb-4 space-y-2">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or company"
          className="pl-9 h-11"
          aria-label="Search operatives"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {shown} of {total} operatives</span>
        {filtersActive && (
          <button type="button" onClick={onClear} className="underline font-medium hover:text-foreground">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}