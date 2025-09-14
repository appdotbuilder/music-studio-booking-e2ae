import { cn } from '@/lib/utils';
import { 
    Calendar, Clock, Music, DollarSign, CheckCircle, Settings, Plus, 
    Zap, CreditCard, AlertTriangle, Info, FileText, BarChart3, Smartphone
} from 'lucide-react';
import { type LucideProps } from 'lucide-react';
import { type ComponentType } from 'react';

// Map string names to actual icon components
const iconMap: Record<string, ComponentType<LucideProps>> = {
    'calendar': Calendar,
    'clock': Clock,
    'music': Music,
    'music-note': Music,
    'currency-dollar': DollarSign,
    'check-circle': CheckCircle,
    'cog': Settings,
    'plus': Plus,
    'lightning-bolt': Zap,
    'credit-card': CreditCard,
    'exclamation-triangle': AlertTriangle,
    'information-circle': Info,
    'document-text': FileText,
    'chart-bar': BarChart3,
    'mobile': Smartphone,
};

// Support both old and new patterns
interface IconPropsOld extends Omit<LucideProps, 'ref'> {
    iconNode: ComponentType<LucideProps>;
    name?: never;
}

interface IconPropsNew extends Omit<LucideProps, 'ref'> {
    name: string;
    iconNode?: never;
}

type IconProps = IconPropsOld | IconPropsNew;

export function Icon(props: IconProps) {
    const { className, ...restProps } = props;
    
    if ('iconNode' in props && props.iconNode) {
        // Old pattern: iconNode prop
        const IconComponent = props.iconNode;
        return <IconComponent className={cn('h-4 w-4', className)} {...restProps} />;
    } else if ('name' in props && props.name) {
        // New pattern: name prop
        const IconComponent = iconMap[props.name] || AlertTriangle;
        return <IconComponent className={cn('h-4 w-4', className)} {...restProps} />;
    }
    
    // Fallback
    return <AlertTriangle className={cn('h-4 w-4', className)} {...restProps} />;
}