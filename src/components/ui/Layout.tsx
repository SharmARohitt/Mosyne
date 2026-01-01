'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar, TopBar, MobileNav } from './Navigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mosyne-dark">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        className="min-h-screen lg:transition-[margin] lg:duration-300"
        style={{ marginLeft: 0 }}
      >
        <div className="hidden lg:block">
          <motion.div
            initial={false}
            animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
            className="transition-[margin] duration-300"
          >
            <TopBar onMenuClick={() => setMobileNavOpen(true)} />
          </motion.div>
        </div>
        
        <div className="lg:hidden">
          <TopBar onMenuClick={() => setMobileNavOpen(true)} />
        </div>

        <motion.div
          initial={false}
          animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
          className="hidden lg:block transition-[margin] duration-300"
        >
          <div className="p-6">
            {children}
          </div>
        </motion.div>

        <div className="lg:hidden p-4">
          {children}
        </div>
      </motion.main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
        {/* Bottom Right Glow */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm mb-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <a href={crumb.href} className="text-white/40 hover:text-white/70 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-white/60">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-white/20">/</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-white/50 mt-1">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </motion.div>
  );
}

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, cols = 4, gap = 'md', className }: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={cn('grid', colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Container({ children, className, size = 'full' }: ContainerProps) {
  const sizeClass = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto', sizeClass[size], className)}>
      {children}
    </div>
  );
}
