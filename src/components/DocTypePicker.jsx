import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check, ChevronDown } from 'lucide-react';
import { REQUIRED_DOC_TYPES } from '@/lib/compliance';

export default function DocTypePicker({ value, onChange }) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {value || <span className="text-muted-foreground">Select type...</span>}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select document type</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-1">
            {REQUIRED_DOC_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChange(t);
                  setDrawerOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                  value === t ? 'bg-amber-50 text-amber-900' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium">{t}</span>
                {value === t && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select type..." />
      </SelectTrigger>
      <SelectContent>
        {REQUIRED_DOC_TYPES.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}