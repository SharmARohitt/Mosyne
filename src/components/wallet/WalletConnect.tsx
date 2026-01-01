'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard, Badge } from '../ui/Cards';
import { Button } from '../ui/Buttons';
import {
  Shield,
  Eye,
  Zap,
  Bell,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Brain,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  icon: string;
  riskLevel?: 'low' | 'medium' | 'high';
  usageCount?: number;
}

interface PermissionCardProps {
  permission: Permission;
  onToggle: (id: string) => void;
}

export function PermissionCard({ permission, onToggle }: PermissionCardProps) {
  const icons: Record<string, React.ReactNode> = {
    '🔍': <Eye className="w-5 h-5" />,
    '📊': <Brain className="w-5 h-5" />,
    '⚠️': <AlertTriangle className="w-5 h-5" />,
    '🧬': <Zap className="w-5 h-5" />,
    '🛡️': <Shield className="w-5 h-5" />,
    '⚡': <Zap className="w-5 h-5" />,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        'p-4 rounded-xl border transition-all duration-300',
        permission.granted
          ? 'bg-neon-green/5 border-neon-green/30'
          : 'bg-white/5 border-white/10'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            permission.granted
              ? 'bg-neon-green/20 text-neon-green'
              : 'bg-white/10 text-white/50'
          )}>
            {icons[permission.icon] || <Settings className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-white">{permission.name}</h4>
              {permission.riskLevel && (
                <Badge
                  variant={
                    permission.riskLevel === 'high' ? 'danger' :
                    permission.riskLevel === 'medium' ? 'warning' : 'success'
                  }
                  size="sm"
                >
                  {permission.riskLevel} risk
                </Badge>
              )}
            </div>
            <p className="text-sm text-white/50 mt-1">{permission.description}</p>
            {permission.usageCount !== undefined && permission.usageCount > 0 && (
              <p className="text-xs text-white/30 mt-1">{permission.usageCount.toLocaleString()} uses</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onToggle(permission.id)}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors duration-300',
            permission.granted ? 'bg-neon-green' : 'bg-white/20'
          )}
        >
          <motion.div
            initial={false}
            animate={{ x: permission.granted ? 24 : 2 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
          />
        </button>
      </div>
    </motion.div>
  );
}

interface MetaMaskConnectionProps {
  isConnected: boolean;
  address?: string;
  permissions: Permission[];
  onConnect: () => void;
  onDisconnect: () => void;
  onPermissionToggle: (id: string) => void;
}

export function MetaMaskConnection({
  isConnected,
  address,
  permissions,
  onConnect,
  onDisconnect,
  onPermissionToggle,
}: MetaMaskConnectionProps) {
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <GlassCard className="p-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* MetaMask Logo */}
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center',
            isConnected
              ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30'
              : 'bg-white/5 border border-white/10'
          )}>
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
              <path d="M35.4 3L21.6 13.2L24.2 7.1L35.4 3Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.6 3L18.3 13.3L15.8 7.1L4.6 3Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30.6 26.7L27 32.5L34.6 34.6L36.8 26.8L30.6 26.7Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.2 26.8L5.4 34.6L13 32.5L9.4 26.7L3.2 26.8Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.6 17.4L10.5 20.6L18 20.9L17.7 12.9L12.6 17.4Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M27.4 17.4L22.2 12.8L22 20.9L29.5 20.6L27.4 17.4Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 32.5L17.5 30.3L13.6 26.9L13 32.5Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22.5 30.3L27 32.5L26.4 26.9L22.5 30.3Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg">MetaMask</h3>
            {isConnected && address ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-sm text-white/60">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-white/50">Not connected</p>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowPermissions(!showPermissions)}>
              <Settings className="w-4 h-4" />
              Permissions
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisconnect}>
              <Lock className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={onConnect} glow>
            <Unlock className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>

      {/* ERC-7715 Banner */}
      {isConnected && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-neon-purple/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-neon-purple" />
              <div>
                <p className="text-sm font-medium text-white">ERC-7715 Advanced Permissions</p>
                <p className="text-xs text-white/50">Grant MOSYNE permission to analyze transactions</p>
              </div>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-xs text-neon-cyan hover:underline"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Permissions List */}
      {isConnected && showPermissions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white/70">Active Permissions</h4>
            <span className="text-xs text-white/40">
              {permissions.filter(p => p.granted).length}/{permissions.length} enabled
            </span>
          </div>
          
          {permissions.map((permission) => (
            <PermissionCard
              key={permission.id}
              permission={permission}
              onToggle={onPermissionToggle}
            />
          ))}
        </motion.div>
      )}

      {/* Connection Benefits */}
      {!isConnected && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          {[
            { icon: <Brain className="w-5 h-5" />, label: 'Memory Analysis' },
            { icon: <Shield className="w-5 h-5" />, label: 'Risk Protection' },
            { icon: <Zap className="w-5 h-5" />, label: 'Real-time Alerts' },
          ].map((benefit, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-neon-cyan mb-2">
                {benefit.icon}
              </div>
              <p className="text-xs text-white/50">{benefit.label}</p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export function WalletActivityFeed() {
  const activities = [
    { type: 'analysis', message: 'Swap transaction analyzed - Low risk (0.12)', time: '45s ago', status: 'success' },
    { type: 'pattern', message: 'Reentrancy pattern match - 89% confidence', time: '2m ago', status: 'danger' },
    { type: 'analysis', message: 'Bridge transaction verified - Safe', time: '8m ago', status: 'success' },
    { type: 'pattern', message: 'MEV sandwich detected in mempool', time: '15m ago', status: 'warning' },
    { type: 'block', message: 'Phishing contract blocked - Drain pattern', time: '23m ago', status: 'danger' },
    { type: 'analysis', message: 'Stake transaction analyzed - Low risk', time: '41m ago', status: 'success' },
    { type: 'permission', message: 'Pattern matching permission active', time: '1h ago', status: 'info' },
  ];

  const statusColors = {
    success: 'bg-neon-green text-neon-green',
    warning: 'bg-neon-orange text-neon-orange',
    info: 'bg-neon-cyan text-neon-cyan',
    danger: 'bg-neon-red text-neon-red',
  };

  return (
    <GlassCard className="p-4">
      <h4 className="text-sm font-medium text-white/70 mb-4">Recent Activity</h4>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className={cn(
              'w-2 h-2 rounded-full',
              statusColors[activity.status as keyof typeof statusColors].split(' ')[0]
            )} />
            <p className="flex-1 text-sm text-white/70">{activity.message}</p>
            <span className="text-xs text-white/40">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
