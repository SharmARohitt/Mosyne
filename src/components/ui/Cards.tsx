'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'pink' | 'none';
  hover?: boolean;
  animated?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  glow = 'none',
  hover = true,
  animated = true,
  delay = 0,
}: GlassCardProps) {
  const glowStyles = {
    cyan: 'hover:shadow-neon-cyan',
    purple: 'hover:shadow-neon-purple',
    pink: 'hover:shadow-neon-pink',
    none: '',
  };

  const content = (
    <div
      className={cn(
        'glass-card p-6',
        hover && 'card-hover',
        glowStyles[glow],
        className
      )}
    >
      {children}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {content}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'red';
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'cyan',
  delay = 0,
}: StatCardProps) {
  const colorStyles = {
    cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30',
    purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
    pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30',
    green: 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
    orange: 'from-neon-orange/20 to-neon-orange/5 border-neon-orange/30',
    red: 'from-neon-red/20 to-neon-red/5 border-neon-red/30',
  };

  const textColors = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink',
    green: 'text-neon-green',
    orange: 'text-neon-orange',
    red: 'text-neon-red',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6',
        'bg-gradient-to-br backdrop-blur-xl',
        colorStyles[color]
      )}
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-radial from-current to-transparent opacity-10" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn('text-2xl', textColors[color])}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-white/60">{title}</h3>
          </div>
          {trend !== undefined && (
            <span
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend >= 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
              )}
            >
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        <p className={cn('stat-number', textColors[color])}>{value}</p>
        
        {subtitle && (
          <p className="text-sm text-white/40 mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  gradient?: string;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon,
  gradient = 'from-neon-cyan to-neon-purple',
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="glass-card p-6 h-full">
        {/* Icon */}
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
          'bg-gradient-to-br',
          gradient,
          'shadow-lg'
        )}>
          <span className="text-2xl text-white">{icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
          {title}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed">
          {description}
        </p>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={cn('absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20', gradient)} />
        </div>
      </div>
    </motion.div>
  );
}

interface ProgressCardProps {
  label: string;
  value: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'red';
}

export function ProgressCard({ label, value, max = 100, color = 'cyan' }: ProgressCardProps) {
  const percentage = (value / max) * 100;
  
  const gradients = {
    cyan: 'from-neon-cyan to-neon-blue',
    purple: 'from-neon-purple to-neon-pink',
    pink: 'from-neon-pink to-neon-red',
    green: 'from-neon-green to-neon-cyan',
    orange: 'from-neon-orange to-neon-red',
    red: 'from-neon-red to-neon-pink',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-sm font-mono text-white/90">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', gradients[color])}
        />
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-white/50 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/70 border-white/20',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    warning: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
    danger: 'bg-neon-red/20 text-neon-red border-neon-red/30',
    info: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border font-medium', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}

interface PulseIndicatorProps {
  status: 'online' | 'warning' | 'offline';
}

export function PulseIndicator({ status }: PulseIndicatorProps) {
  const colors = {
    online: 'bg-neon-green',
    warning: 'bg-neon-orange',
    offline: 'bg-neon-red',
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', colors[status])} />
      <span className={cn('relative inline-flex rounded-full h-3 w-3', colors[status])} />
    </span>
  );
}
