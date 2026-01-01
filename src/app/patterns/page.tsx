'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import { PatternCard, MemorySequence } from '@/components/memory/PatternCard';
import { realPatterns, MOSYNE_CORE_STATS } from '@/lib/data/realData';
import {
  Network,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Link2,
  GitBranch,
  Share2,
  Download,
} from 'lucide-react';

const TransactionFlow3D = dynamic(
  () => import('@/components/3d/TransactionFlow3D'),
  { ssr: false }
);

export default function PatternsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All', icon: <Activity className="w-4 h-4" /> },
    { id: 'exploit', label: 'Exploit', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'rug_pull', label: 'Rug Pull', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'drain', label: 'Drain', icon: <Zap className="w-4 h-4" /> },
    { id: 'governance', label: 'Governance', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'safe', label: 'Safe', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const filteredPatterns = realPatterns.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Pattern Library"
        subtitle="Explore and manage behavioral patterns in the memory network"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Patterns' },
        ]}
        action={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            Add Pattern
          </Button>
        }
      />

      {/* Stats */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Total Patterns"
          value={realPatterns.length.toString()}
          icon={<Network />}
          trend={15}
          color="cyan"
        />
        <StatCard
          title="Active Matches"
          value={(MOSYNE_CORE_STATS.threatsBlocked * 0.164).toLocaleString()}
          icon={<Link2 />}
          trend={8}
          color="purple"
        />
        <StatCard
          title="High Risk"
          value={realPatterns.filter(p => p.severity === 'critical').length.toString()}
          icon={<AlertTriangle />}
          color="red"
        />
        <StatCard
          title="Safe Patterns"
          value={(MOSYNE_CORE_STATS.totalMemoriesIndexed * 0.161).toLocaleString().split('.')[0]}
          icon={<CheckCircle />}
          trend={23}
          color="green"
        />
      </Grid>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Pattern Network */}
        <div className="lg:col-span-1">
          <GlassCard className="h-[500px] p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Pattern Network</h3>
              <p className="text-xs text-white/50">Interactive pattern connections</p>
            </div>
            <div className="h-[calc(100%-60px)]">
              <TransactionFlow3D />
            </div>
          </GlassCard>
        </div>

        {/* Right: Pattern List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pattern Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredPatterns.map((pattern, i) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PatternCard pattern={pattern} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Patterns */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-6">Featured Patterns</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Flash Loan Pattern */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-red/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Flash Loan Exploit</h3>
                  <Badge variant="danger">Critical</Badge>
                </div>
              </div>
              <span className="text-2xl font-bold font-mono text-neon-red">95%</span>
            </div>
            <MemorySequence
              sequence={[
                'Flash Loan Initiation',
                'Price Manipulation',
                'Collateral Deposit',
                'Excessive Borrow',
                'Loan Repayment',
              ]}
            />
          </GlassCard>

          {/* Safe DeFi Pattern */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Safe DeFi Interaction</h3>
                  <Badge variant="success">Low Risk</Badge>
                </div>
              </div>
              <span className="text-2xl font-bold font-mono text-neon-green">12%</span>
            </div>
            <MemorySequence
              sequence={[
                'Wallet Connection',
                'Token Approval',
                'Swap/Deposit',
                'Confirmation',
              ]}
            />
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
