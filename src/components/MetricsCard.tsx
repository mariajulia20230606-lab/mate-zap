import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className = "",
  onClick 
}: MetricsCardProps) => {
  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && (
            <span className="text-whatsapp font-medium">
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};