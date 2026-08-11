import { useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Settings, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'About us', path: '/about', icon: Info },
  { label: 'Contact us', path: '/contact', icon: Mail },
];

export default function AppHeaderMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="sm:hidden text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {ITEMS.map(({ label, path, icon: Icon }) => (
          <DropdownMenuItem key={path} onSelect={() => navigate(path)} className="py-2.5">
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}