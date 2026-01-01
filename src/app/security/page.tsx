'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import { MetaMaskConnection, PermissionCard, WalletActivityFeed } from '@/components/wallet/WalletConnect';
import { permissionConfigs } from '@/lib/data/realData';
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  Bell,
  BellOff,
  Settings,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Info,
  Zap,
  Database,
  History,
  RefreshCw,
} from 'lucide-react';

export default function SecurityPage() {
  const [permissions, setPermissions] = useState(permissionConfigs);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [autoBlock, setAutoBlock] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8e5A1');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
  };

  const handlePermissionToggle = (id: string) => {
    setPermissions(prev =>
      prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p)
    );
  };

  const securityStats = [
    { label: 'Transactions Protected', value: '5,847', trend: 12 },
    { label: 'Threats Blocked', value: '23', trend: -8 },
    { label: 'Risk Alerts Sent', value: '156', trend: 5 },
    { label: 'Security Score', value: '94/100', trend: 2 },
  ];

  const securityEvents = [
    { type: 'block', message: 'High-risk transaction blocked', time: '5m ago', severity: 'danger' },
    { type: 'alert', message: 'Suspicious contract interaction detected', time: '23m ago', severity: 'warning' },
    { type: 'success', message: 'Permission updated successfully', time: '1h ago', severity: 'success' },
    { type: 'info', message: 'New pattern added to watchlist', time: '2h ago', severity: 'info' },
    { type: 'block', message: 'Phishing attempt prevented', time: '5h ago', severity: 'danger' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Security"
        subtitle="Manage permissions and protect your wallet"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Security' },
        ]}
        action={
          <Badge variant="success">
            <Shield className="w-3 h-3 mr-1" />
            Protected
          </Badge>
        }
      />

      {/* Stats */}
      <Grid cols={4} className="mb-8">
        {securityStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <p className="text-sm text-white/50 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold font-mono text-white">{stat.value}</p>
              {stat.trend && (
                <span className={`text-xs font-medium ${stat.trend > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                  {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </Grid>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Security Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Connection */}
          <MetaMaskConnection
            isConnected={isConnected}
            address={address}
            permissions={permissions}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onPermissionToggle={handlePermissionToggle}
          />

          {/* ERC-7715 Permissions */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">ERC-7715 Permissions</h3>
                <p className="text-sm text-white/50">MetaMask Advanced Permissions for MOSYNE</p>
              </div>
              <a
                href="https://eips.ethereum.org/EIPS/eip-7715"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-neon-cyan hover:underline"
              >
                Learn more <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className={`p-4 rounded-xl border transition-all ${
                    permission.granted
                      ? 'bg-neon-green/5 border-neon-green/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        permission.granted
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {permission.icon === '🔍' && <Eye className="w-5 h-5" />}
                        {permission.icon === '📊' && <Database className="w-5 h-5" />}
                        {permission.icon === '⚠️' && <AlertTriangle className="w-5 h-5" />}
                        {permission.icon === '🧬' && <Zap className="w-5 h-5" />}
                        {permission.icon === '🛡️' && <Shield className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{permission.name}</h4>
                        <p className="text-sm text-white/50 mt-1">{permission.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePermissionToggle(permission.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        permission.granted
                          ? 'text-neon-green hover:bg-neon-green/10'
                          : 'text-white/30 hover:bg-white/5'
                      }`}
                    >
                      {permission.granted ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Settings */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-neon-red" />
                  <div>
                    <p className="font-medium text-white">Auto-Block High Risk</p>
                    <p className="text-sm text-white/50">Automatically reject transactions with risk > 80%</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoBlock(!autoBlock)}
                  className={autoBlock ? 'text-neon-green' : 'text-white/30'}
                >
                  {autoBlock ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-neon-orange" />
                  <div>
                    <p className="font-medium text-white">Risk Notifications</p>
                    <p className="text-sm text-white/50">Get alerts for medium and high risk patterns</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={notifications ? 'text-neon-green' : 'text-white/30'}
                >
                  {notifications ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Security Events */}
        <div className="space-y-6">
          {/* Security Score */}
          <GlassCard className="p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-4 border-neon-green/30 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-neon-green">94</span>
            </div>
            <h3 className="font-semibold text-white mb-1">Security Score</h3>
            <p className="text-sm text-white/50 mb-4">Your wallet is well protected</p>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-neon-green">All critical permissions enabled</span>
            </div>
          </GlassCard>

          {/* Security Events */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Security Events</h4>
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {securityEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    event.severity === 'danger' ? 'bg-neon-red/10' :
                    event.severity === 'warning' ? 'bg-neon-orange/10' :
                    event.severity === 'success' ? 'bg-neon-green/10' :
                    'bg-white/5'
                  }`}
                >
                  {event.severity === 'danger' && <AlertTriangle className="w-4 h-4 text-neon-red flex-shrink-0 mt-0.5" />}
                  {event.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-neon-orange flex-shrink-0 mt-0.5" />}
                  {event.severity === 'success' && <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />}
                  {event.severity === 'info' && <Info className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">{event.message}</p>
                    <p className="text-xs text-white/40 mt-1">{event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Activity Feed */}
          <WalletActivityFeed />
        </div>
      </div>
    </MainLayout>
  );
}
