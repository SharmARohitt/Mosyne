'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import { TransactionCard, TransactionSimulation, TransactionList } from '@/components/transactions/TransactionCard';
import { realTransactions, MOSYNE_CORE_STATS } from '@/lib/data/realData';
import { Transaction } from '@/lib/store';
import {
  Activity,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Play,
  Pause,
  Zap,
} from 'lucide-react';

const TransactionFlow3D = dynamic(
  () => import('@/components/3d/TransactionFlow3D'),
  { ssr: false }
);

export default function TransactionsPage() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [isLive, setIsLive] = useState(true);

  const handleAnalyze = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const filteredTransactions = realTransactions.filter(tx => {
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    return true;
  });

  const statusCounts = {
    all: realTransactions.length,
    pending: realTransactions.filter(t => t.status === 'pending').length,
    success: realTransactions.filter(t => t.status === 'success').length,
    failed: realTransactions.filter(t => t.status === 'failed').length,
  };

  return (
    <MainLayout>
      <PageHeader
        title="Transactions"
        subtitle="Real-time transaction analysis with memory intelligence"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Transactions' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLive ? 'Live' : 'Paused'}
            </Button>
            <PulseIndicator status={isLive ? 'online' : 'offline'} />
          </div>
        }
      />

      {/* Stats */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Total Analyzed"
          value={MOSYNE_CORE_STATS.transactionsToday.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Activity />}
          trend={18}
          color="cyan"
        />
        <StatCard
          title="Pending"
          value={statusCounts.pending.toString()}
          subtitle="Awaiting confirmation"
          icon={<Clock />}
          color="orange"
        />
        <StatCard
          title="Threats Detected"
          value="847"
          subtitle="High-risk blocked"
          icon={<AlertTriangle />}
          trend={-15}
          color="red"
        />
        <StatCard
          title="Safe Transactions"
          value={`${((1 - MOSYNE_CORE_STATS.falsePositiveRate) * 100).toFixed(1)}%`}
          subtitle="Accuracy rate"
          icon={<CheckCircle />}
          trend={2}
          color="green"
        />
      </Grid>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Transaction List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search by hash, address..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'success', 'failed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                    filterStatus === status
                      ? status === 'pending' ? 'bg-neon-orange/20 text-neon-orange border border-neon-orange/30'
                      : status === 'success' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                      : status === 'failed' ? 'bg-neon-red/20 text-neon-red border border-neon-red/30'
                      : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
                  }`}
                >
                  {status === 'pending' && <Loader2 className="w-3 h-3" />}
                  {status === 'success' && <CheckCircle className="w-3 h-3" />}
                  {status === 'failed' && <XCircle className="w-3 h-3" />}
                  {status}
                  <span className="text-xs opacity-60">({statusCounts[status]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {filteredTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TransactionCard
                  transaction={tx}
                  onClick={() => handleAnalyze(tx)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Analysis Panel */}
        <div className="space-y-6">
          {/* Transaction Simulation */}
          {selectedTx ? (
            <TransactionSimulation
              transaction={selectedTx}
              isAnalyzing={isAnalyzing}
              onProceed={() => setSelectedTx(null)}
              onReject={() => setSelectedTx(null)}
            />
          ) : (
            <GlassCard className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-semibold text-white mb-2">Select a Transaction</h3>
              <p className="text-sm text-white/50">
                Click on any transaction to analyze it with MOSYNE memory intelligence
              </p>
            </GlassCard>
          )}

          {/* 3D Flow */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Transaction Flow</h4>
                  <p className="text-xs text-white/50">Real-time visualization</p>
                </div>
                <PulseIndicator status={isLive ? 'online' : 'offline'} />
              </div>
            </div>
            <div className="h-[300px]">
              <TransactionFlow3D />
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-4">
            <h4 className="text-sm font-medium text-white/70 mb-4">Analysis Summary</h4>
            <div className="space-y-3">
              {[
                { label: 'Low Risk (0-30%)', value: 36_528, color: 'bg-neon-green', percent: 72 },
                { label: 'Medium Risk (30-60%)', value: 9_645, color: 'bg-neon-orange', percent: 19 },
                { label: 'High Risk (60%+)', value: 4_567, color: 'bg-neon-red', percent: 9 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-sm text-white/70 flex-1">{item.label}</span>
                  <span className="text-sm font-mono text-white/50">{item.value}</span>
                  <span className="text-xs text-white/30">({item.percent}%)</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Pattern Matches */}
          <GlassCard className="p-4">
            <h4 className="text-sm font-medium text-white/70 mb-4">Recent Pattern Matches</h4>
            <div className="space-y-2">
              {[
                { pattern: 'Approval Exploit Drain', matches: 1247, severity: 'high' },
                { pattern: 'Flash Loan Manipulation', matches: 187, severity: 'high' },
                { pattern: 'MEV Sandwich Attack', matches: 23847, severity: 'medium' },
                { pattern: 'Verified Protocol Interaction', matches: 458293, severity: 'low' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    item.severity === 'high' ? 'bg-neon-red/10' : item.severity === 'medium' ? 'bg-neon-orange/10' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.severity === 'high' ? (
                      <AlertTriangle className="w-4 h-4 text-neon-red" />
                    ) : item.severity === 'medium' ? (
                      <AlertTriangle className="w-4 h-4 text-neon-orange" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    )}
                    <span className="text-sm text-white/70">{item.pattern}</span>
                  </div>
                  <Badge variant={item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warning' : 'success'}>
                    {item.matches.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
