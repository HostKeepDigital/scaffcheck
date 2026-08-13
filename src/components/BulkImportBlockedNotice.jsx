import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { PLANS } from '@/lib/stripePrices';

export default function BulkImportBlockedNotice({ planName, limit, currentCount, fileCount }) {
  const total = currentCount + fileCount;
  const nextPlan = PLANS.find((p) => p.operativeLimit >= total);

  return (
    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm space-y-2">
      <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          This file contains {fileCount} operative{fileCount === 1 ? '' : 's'}, but your {planName} plan
          covers {limit} and you're already tracking {currentCount}. Nothing has been imported.
        </span>
      </div>
      <p className="text-muted-foreground">
        {nextPlan ? (
          <>
            Upgrade to {nextPlan.name} (up to {nextPlan.operativeLimit} operatives) to import them all —{' '}
            <Link to="/settings" className="underline font-medium">manage your subscription</Link>.
          </>
        ) : (
          <>
            {total} operatives needs custom pricing —{' '}
            <Link to="/settings" className="underline font-medium">see enterprise pricing</Link>.
          </>
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        You can cancel and upload a smaller file instead.
      </p>
    </div>
  );
}