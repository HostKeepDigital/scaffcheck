import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Mail } from 'lucide-react';
import { enterpriseMailto, ENTERPRISE_THRESHOLD } from '@/lib/contact';

export default function EnterpriseContactCard({ companyName = '' }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">More than {ENTERPRISE_THRESHOLD} operatives?</p>
            <p className="text-sm text-muted-foreground">
              We build a custom plan for your company, priced to your headcount. Get in touch and we'll set it up for you.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="flex-shrink-0">
          <a href={enterpriseMailto(companyName)}>
            <Mail className="w-4 h-4 mr-2" /> Contact us
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}