'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard, Badge, PulseIndicator } from '../ui/Cards';
import { envioStatus, MOSYNE_CORE_STATS } from '@/lib/data/realData';
import {
  Database,
  Zap,
  Globe,
  Activity,
  Clock,
  Server,
  ArrowUpRight,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface EnvioStatusProps {
  compact?: boolean;
}

export function EnvioStatusPanel({ compact = false }: EnvioStatusProps) {
  const [currentBlock, setCurrentBlock] = useState(envioStatus.latestBlock);
  const [syncProgress, setSyncProgress] = useState(99.98);

  // Simulate live block updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 12000); // New block roughly every 12 seconds

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
        <PulseIndicator status="online" />
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/70">
            <Database className="w-4 h-4 inline mr-1" />
            {(MOSYNE_CORE_STATS.totalMemoriesIndexed / 1_000_000).toFixed(2)}M indexed
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white/70">
            <Zap className="w-4 h-4 inline mr-1" />
            {envioStatus.queryLatency}ms
          </span>
          <span className="text-white/50">|</span>
          <span className="text-neon-green">
            {envioStatus.uptime}% uptime
          </span>
        </div>
      </div>
    );
  }

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-neon-cyan/30">
            <Database className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Envio HyperSync
              <Badge variant="success" size="sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </h3>
            <p className="text-sm text-white/50">Real-time blockchain indexer</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono text-neon-cyan">{envioStatus.uptime}%</p>
          <p className="text-xs text-white/50">Uptime</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-white/50">Blocks Indexed</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {currentBlock.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-white/50">Memories Stored</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {(MOSYNE_CORE_STATS.totalMemoriesIndexed / 1_000_000).toFixed(2)}M
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-neon-orange" />
            <span className="text-xs text-white/50">Query Latency</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {envioStatus.queryLatency}ms
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-white/50">Index Speed</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {(envioStatus.indexingSpeed / 1000).toFixed(1)}K/s
          </p>
        </div>
      </div>

      {/* Sync Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Sync Progress</span>
          <span className="text-sm font-mono text-neon-green">{syncProgress.toFixed(2)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${syncProgress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-white/40">
          <span>{envioStatus.blocksBehind} blocks behind</span>
          <span>Latest: #{currentBlock}</span>
        </div>
      </div>

      {/* Region Status */}
      <div>
        <h4 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Regional Nodes
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {envioStatus.regions.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">{region.name}</span>
                <PulseIndicator status={region.status === 'healthy' ? 'online' : 'warning'} />
              </div>
              <p className="text-lg font-mono text-neon-cyan">{region.latency}ms</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-lg font-mono text-white">{envioStatus.memoryWrites}</p>
            <p className="text-xs text-white/40">Writes/sec</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-lg font-mono text-white">2,347</p>
            <p className="text-xs text-white/40">Queries/sec</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-lg font-mono text-white">{MOSYNE_CORE_STATS.chainsMonitored}</p>
            <p className="text-xs text-white/40">Chains</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-lg font-mono text-white">12.8K</p>
            <p className="text-xs text-white/40">Active Users</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function EnvioMiniStatus() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
      </span>
      <span className="text-xs text-neon-cyan font-medium">Envio Active</span>
      <span className="text-xs text-white/40">·</span>
      <span className="text-xs text-white/50">{envioStatus.queryLatency}ms</span>
    </div>
  );
}
