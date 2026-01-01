'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button, IconButton } from '@/components/ui/Buttons';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Database,
  Globe,
  Zap,
  Save,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  AlertTriangle,
  Volume2,
  VolumeX,
  Download,
  Upload,
  ChevronRight,
  Network,
  Code,
  Layers,
} from 'lucide-react';

interface SettingToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  icon?: React.ReactNode;
}

function SettingToggle({ label, description, enabled, onChange, icon }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-white/40">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all ${
          enabled ? 'bg-neon-cyan' : 'bg-white/10'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            enabled ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SettingLinkProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

function SettingLink({ label, description, icon, badge, onClick }: SettingLinkProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 -mx-4 px-4 transition-all"
    >
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>}
        <div className="text-left">
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-white/40">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge variant="info">{badge}</Badge>}
        <ChevronRight className="w-4 h-4 text-white/30" />
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: false,
    riskAlerts: true,
    patternUpdates: true,
    darkMode: true,
    autoSimulate: true,
    advancedMode: false,
    telemetry: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      <PageHeader
        title="Settings"
        subtitle="Configure your MOSYNE experience"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Settings' },
        ]}
        action={
          <Button variant="primary" size="sm">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-4">
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
                { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" />, badge: '!' },
                { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                { id: 'network', label: 'Network', icon: <Globe className="w-4 h-4" /> },
                { id: 'data', label: 'Data & Privacy', icon: <Database className="w-4 h-4" /> },
                { id: 'advanced', label: 'Advanced', icon: <Code className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/50">{item.icon}</span>
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-neon-red/20 text-neon-red text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        {/* Right Column - Settings Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <span className="text-2xl font-bold">0x</span>
              </div>
              <div className="flex-1">
                <p className="font-mono text-white">0x742d...f44e</p>
                <p className="text-sm text-white/50">Connected via MetaMask</p>
              </div>
              <Button variant="secondary" size="sm">
                <RefreshCw className="w-4 h-4" />
                Reconnect
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Display Name</label>
                <input
                  type="text"
                  placeholder="Anonymous User"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Email (optional)</label>
                <input
                  type="email"
                  placeholder="notifications@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
                />
              </div>
            </div>
          </GlassCard>

          {/* Notifications Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>

            <SettingToggle
              label="Push Notifications"
              description="Receive browser notifications for important events"
              enabled={settings.notifications}
              onChange={(v) => updateSetting('notifications', v)}
              icon={<Bell className="w-4 h-4 text-white/50" />}
            />
            <SettingToggle
              label="Sound Effects"
              description="Play sounds for alerts and notifications"
              enabled={settings.soundEffects}
              onChange={(v) => updateSetting('soundEffects', v)}
              icon={<Volume2 className="w-4 h-4 text-white/50" />}
            />
            <SettingToggle
              label="Risk Alerts"
              description="Get notified when high-risk patterns are detected"
              enabled={settings.riskAlerts}
              onChange={(v) => updateSetting('riskAlerts', v)}
              icon={<AlertTriangle className="w-4 h-4 text-white/50" />}
            />
            <SettingToggle
              label="Pattern Updates"
              description="Receive updates when new patterns are added"
              enabled={settings.patternUpdates}
              onChange={(v) => updateSetting('patternUpdates', v)}
              icon={<Network className="w-4 h-4 text-white/50" />}
            />
          </GlassCard>

          {/* Appearance Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/50 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                  { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
                  { id: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      theme.id === 'dark'
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                        : 'border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {theme.icon}
                    <span className="text-sm">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <SettingLink
              label="Accent Color"
              description="Customize the primary accent color"
              icon={<div className="w-4 h-4 rounded-full bg-neon-cyan" />}
              badge="Cyan"
            />
          </GlassCard>

          {/* Network Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Network Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">RPC Endpoint</label>
                <input
                  type="text"
                  placeholder="https://mainnet.infura.io/v3/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Envio HyperSync Endpoint</label>
                <input
                  type="text"
                  placeholder="https://hypersync.envio.dev/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50 font-mono text-sm"
                />
              </div>
            </div>
          </GlassCard>

          {/* Data & Privacy Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Data & Privacy</h2>
            </div>

            <SettingToggle
              label="Anonymous Telemetry"
              description="Help improve MOSYNE by sharing anonymous usage data"
              enabled={settings.telemetry}
              onChange={(v) => updateSetting('telemetry', v)}
              icon={<Zap className="w-4 h-4 text-white/50" />}
            />

            <SettingLink
              label="Export Data"
              description="Download all your data in JSON format"
              icon={<Download className="w-4 h-4 text-white/50" />}
            />

            <SettingLink
              label="Import Data"
              description="Import previously exported data"
              icon={<Upload className="w-4 h-4 text-white/50" />}
            />

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button variant="secondary" className="w-full text-neon-red border-neon-red/30 hover:bg-neon-red/10">
                <Trash2 className="w-4 h-4" />
                Delete All Data
              </Button>
            </div>
          </GlassCard>

          {/* Advanced Section */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">Advanced</h2>
            </div>

            <SettingToggle
              label="Auto-Simulate Transactions"
              description="Automatically simulate transactions before signing"
              enabled={settings.autoSimulate}
              onChange={(v) => updateSetting('autoSimulate', v)}
              icon={<Zap className="w-4 h-4 text-white/50" />}
            />

            <SettingToggle
              label="Developer Mode"
              description="Enable advanced debugging features"
              enabled={settings.advancedMode}
              onChange={(v) => updateSetting('advancedMode', v)}
              icon={<Code className="w-4 h-4 text-white/50" />}
            />

            <SettingLink
              label="API Keys"
              description="Manage your API keys and access tokens"
              icon={<Key className="w-4 h-4 text-white/50" />}
            />

            <SettingLink
              label="Custom Patterns"
              description="Import and manage custom pattern definitions"
              icon={<Layers className="w-4 h-4 text-white/50" />}
            />
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
