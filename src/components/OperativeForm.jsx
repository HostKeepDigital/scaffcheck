import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export default function OperativeForm({ open, onClose, operative, accountId, onSaved, onCreate }) {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Scaffolder');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (operative) {
      setFullName(operative.full_name || '');
      setCompanyName(operative.company_name || '');
      setEmail(operative.email || '');
      setPhone(operative.phone || '');
      setRole(operative.role || 'Scaffolder');
      setNotes(operative.notes || '');
    } else {
      setFullName(''); setCompanyName(''); setEmail(''); setPhone(''); setRole('Scaffolder'); setNotes('');
    }
    setError('');
  }, [operative, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Full name is required'); return; }
    setLoading(true);
    try {
      if (operative) {
        await base44.entities.Operative.update(operative.id, {
          full_name: fullName, company_name: companyName, email, phone, role, notes,
        });
      } else {
        const opData = {
          account_id: accountId, full_name: fullName, company_name: companyName,
          email, phone, role, notes,
        };
        if (onCreate) {
          await onCreate(opData);
        } else {
          await base44.entities.Operative.create(opData);
          await base44.entities.Account.update(accountId, {
            operative_count: (await base44.entities.Operative.filter({ account_id: accountId })).length,
          });
        }
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save operative');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{operative ? 'Edit Operative' : 'Add Operative'}</DialogTitle>
        </DialogHeader>
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name *</Label>
            <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Smith" required autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company name (optional)</Label>
            <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Smith Scaffolding Ltd" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07123 456789" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Scaffolder" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any notes..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (operative ? 'Save changes' : 'Add operative')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}