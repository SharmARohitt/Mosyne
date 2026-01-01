'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConnectWalletButton } from './Buttons';
import { PulseIndicator } from './Cards';
import {
  Brain,
  LayoutDashboard,
  Shield,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Zap,
  Database,
  Network,
  History,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/memory', label: 'Memory Engine', icon: Brain },
  { href: '/transactions', label: 'Transactions', icon: Activity },
  { href: '/patterns', label: 'Patterns', icon: Network },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/history', label: 'History', icon: History },
  { href: '/security', label: 'Security', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50',
        'flex flex-col',
        'bg-mosyne-darker/80 backdrop-blur-xl',
        'border-r border-white/5'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple blur-lg opacity-50" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <span className="text-xl font-bold gradient-text">MOSYNE</span>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Memory Engine</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-transparent border border-neon-cyan/30 text-neon-cyan'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Status Panel */}
      <div className="p-4 border-t border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50">Envio Status</span>
                <PulseIndicator status="online" />
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs text-white/70">2.85M memories indexed</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-4 h-4 text-neon-purple" />
                <span className="text-xs text-white/50">47ms avg latency</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleConnect = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8e5A1');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
  };

  return (
    <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-6 bg-mosyne-dark/50 backdrop-blur-xl border-b border-white/5">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 400 : 300 }}
          className="relative hidden md:block"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search patterns, transactions..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl',
              'bg-white/5 border border-white/10',
              'text-white placeholder-white/30',
              'focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10',
              'transition-all duration-200'
            )}
          />
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors"
          >
            <Zap className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />
        </motion.button>

        {/* Wallet Connection */}
        <ConnectWalletButton
          isConnected={isConnected}
          address={address}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>
    </header>
  );
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Nav Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-mosyne-darker border-r border-white/5 lg:hidden"
          >
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">MOSYNE</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-neon-cyan/20 to-transparent border border-neon-cyan/30 text-neon-cyan'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
