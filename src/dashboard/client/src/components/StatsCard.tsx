import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color = 'default' }) => {
    const getColorClass = () => {
        switch (color) {
            case 'accent': return 'text-accent';
            case 'success': return 'text-success';
            case 'warning': return 'text-warning';
            case 'error': return 'text-error';
            default: return 'text-primary';
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{label}</span>
                <Icon size={20} className={getColorClass()} style={{ opacity: 0.8 }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'boold' }} className={getColorClass()}>
                {value}
            </div>
        </div>
    );
};
