import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpendingAlerts } from '@/hooks/useSpendingAlerts';
import { useCurrency } from '@/hooks/useCurrency';

export default function InsightsCard() {
  const { alerts } = useSpendingAlerts();
  const { symbol } = useCurrency();

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">💡 Insights</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">You're on track! No spending alerts right now.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">⚠️ Spending Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.category} className={`p-3 rounded-lg text-sm ${alert.isOver ? 'bg-destructive/10 text-destructive' : 'bg-yellow-500/10 text-yellow-700'}`}>
            <p className="font-medium">{alert.category}</p>
            <p>{symbol}{alert.spent.toLocaleString()} of {symbol}{alert.budget.toLocaleString()} ({alert.percentage}%)</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
