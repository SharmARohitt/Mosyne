'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: cn(
      'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20',
      'border border-neon-cyan/40 hover:border-neon-cyan/80',
      'text-white hover:text-neon-cyan',
      'shadow-lg hover:shadow-neon-cyan/25',
      glow && 'animate-glow-pulse'
    ),
    secondary: cn(
      'bg-white/5 hover:bg-white/10',
      'border border-white/10 hover:border-white/30',
      'text-white/80 hover:text-white'
    ),
    ghost: cn(
      'bg-transparent hover:bg-white/5',
      'border border-transparent',
      'text-white/60 hover:text-white'
    ),
    danger: cn(
      'bg-neon-red/20 hover:bg-neon-red/30',
      'border border-neon-red/40 hover:border-neon-red/80',
      'text-neon-red',
      glow && 'hover:shadow-neon-red/25'
    ),
    success: cn(
      'bg-neon-green/20 hover:bg-neon-green/30',
      'border border-neon-green/40 hover:border-neon-green/80',
      'text-neon-green',
      glow && 'hover:shadow-neon-green/25'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl font-medium',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-mosyne-dark',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon && iconPosition === 'left' ? (
        icon
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' ? icon : null}
    </motion.button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  className,
  ...props
}: IconButtonProps) {
  const variants = {
    primary: 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30',
    secondary: 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
    ghost: 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white',
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50',
        variants[variant],
        sizes[size],
        className
      )}
      title={tooltip}
      {...props}
    >
      {icon}
    </motion.button>
  );
}

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn('inline-flex rounded-xl overflow-hidden', className)}>
      {children}
    </div>
  );
}

interface ConnectWalletButtonProps {
  isConnected: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
}

export function ConnectWalletButton({
  isConnected,
  address,
  onConnect,
  onDisconnect,
  loading = false,
}: ConnectWalletButtonProps) {
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-sm text-white/80">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onConnect}
      loading={loading}
      glow
      className="relative overflow-hidden group"
    >
      <span className="relative z-10 flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.8,10.2l-2.3-0.6c-0.1-0.3-0.2-0.6-0.3-0.9l1.3-2c0.2-0.3,0.2-0.7-0.1-0.9l-2.2-2.2c-0.3-0.3-0.7-0.3-0.9-0.1l-2,1.3c-0.3-0.1-0.6-0.2-0.9-0.3l-0.6-2.3C13.8,2,13.4,1.8,13.1,1.8h-3.1c-0.4,0-0.7,0.3-0.8,0.6L8.5,4.7C8.2,4.8,7.9,4.9,7.6,5L5.6,3.7C5.3,3.5,4.9,3.5,4.6,3.8L2.4,6c-0.3,0.3-0.3,0.7-0.1,0.9l1.3,2C3.5,9.2,3.4,9.5,3.3,9.8l-2.3,0.6c-0.3,0.1-0.6,0.4-0.6,0.8v3.1c0,0.4,0.3,0.7,0.6,0.8l2.3,0.6c0.1,0.3,0.2,0.6,0.3,0.9l-1.3,2c-0.2,0.3-0.2,0.7,0.1,0.9l2.2,2.2c0.3,0.3,0.7,0.3,0.9,0.1l2-1.3c0.3,0.1,0.6,0.2,0.9,0.3l0.6,2.3c0.1,0.3,0.4,0.6,0.8,0.6h3.1c0.4,0,0.7-0.3,0.8-0.6l0.6-2.3c0.3-0.1,0.6-0.2,0.9-0.3l2,1.3c0.3,0.2,0.7,0.2,0.9-0.1l2.2-2.2c0.3-0.3,0.3-0.7,0.1-0.9l-1.3-2c0.1-0.3,0.2-0.6,0.3-0.9l2.3-0.6c0.3-0.1,0.6-0.4,0.6-0.8v-3.1C22.3,10.6,22.1,10.3,21.8,10.2z M11.5,15.5c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S13.7,15.5,11.5,15.5z"/>
        </svg>
        Connect Wallet
      </span>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </Button>
  );
}
