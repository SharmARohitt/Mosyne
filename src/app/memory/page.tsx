'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import { PatternCard, PatternDetailModal, MemorySequence } from '@/components/memory/PatternCard';
import { realPatterns, MOSYNE_CORE_STATS, analyticsData } from '@/lib/data/realData';
import { MemoryPattern } from '@/lib/store';
import {
  Brain,
  Search,
  Filter,
  Grid as GridIcon,
  List,
  ChevronDown,
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  Clock,
  Database,
  TrendingUp,
} from 'lucide-react';

const MemoryVisualization3D = dynamic(
  () => import('@/components/3d/MemoryVisualization3D'),
  { ssr: false }
);

export default function MemoryPage() {
  const [selectedPattern, setSelectedPattern] = useState<MemoryPattern | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Patterns', count: realPatterns.length },
    { id: 'exploit', label: 'Exploits', count: realPatterns.filter(p => p.category === 'exploit').length },
    { id: 'rug_pull', label: 'Rug Pulls', count: realPatterns.filter(p => p.category === 'rug_pull').length },
    { id: 'drain', label: 'Drains', count: realPatterns.filter(p => p.category === 'drain').length },
    { id: 'governance', label: 'Governance', count: realPatterns.filter(p => p.category === 'governance').length },
    { id: 'safe', label: 'Safe', count: realPatterns.filter(p => p.category === 'safe').length },
  ];

  const filteredPatterns = realPatterns.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Memory Engine"
        subtitle="Explore behavioral patterns and historical memory"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Memory Engine' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Badge variant="info">
              <Database className="w-3 h-3 mr-1" />
              2.8M Memories
            </Badge>
            <PulseIndicator status="online" />
          </div>
        }
      />

      {/* Stats */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Active Patterns"
          value={realPatterns.length.toString()}
          icon={<Brain />}
          trend={15}
          color="cyan"
        />
        <StatCard
          title="High Risk Detected"
          value={realPatterns.filter(p => p.riskScore >= 0.8).length.toString()}
          icon={<AlertTriangle />}
          trend={-8}
          color="red"
        />
        <StatCard
          title="Avg Detection Time"
          value={`${MOSYNE_CORE_STATS.avgQueryLatency}ms`}
          icon={<Clock />}
          color="purple"
        />
        <StatCard
          title="Pattern Accuracy"
          value={`${(100 - MOSYNE_CORE_STATS.falsePositiveRate * 100).toFixed(1)}%`}
          icon={<TrendingUp />}
          trend={2}
          color="green"
        />
      </Grid>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: 3D Visualization */}
        <div className="lg:col-span-1">
          <GlassCard className="h-[500px] p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Memory Network</h3>
              <p className="text-xs text-white/50">Real-time pattern connections</p>
            </div>
            <div className="h-[calc(100%-60px)]">
              <MemoryVisualization3D />
            </div>
          </GlassCard>
        </div>

        {/* Right: Pattern List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
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

            {/* Category Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">{categories.find(c => c.id === filter)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                  filter === cat.id
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
                }`}
              >
                {cat.label}
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  filter === cat.id ? 'bg-neon-cyan/20' : 'bg-white/10'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Pattern Grid */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-3'}>
            {filteredPatterns.map((pattern, i) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PatternCard
                  pattern={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No patterns found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Example Sequence Section */}
      <GlassCard className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Example: Liquidity Drain Pattern</h3>
            <p className="text-sm text-white/50">Behavioral sequence that resulted in 72% fund loss cases</p>
          </div>
          <Badge variant="danger">High Risk</Badge>
        </div>
        
        <MemorySequence
          sequence={[
            'Wallet Creates New Token',
            'Initial Liquidity Added',
            'Permission Grant to Contract',
            'Small Test Transactions',
            'Marketing Spike Detected',
            'Wallet Concentration Increases',
            'Liquidity Removal Initiated',
            'Final Drain Executed'
          ]}
        />
        
        <div className="mt-6 p-4 rounded-xl bg-neon-red/10 border border-neon-red/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neon-red">Memory Insight</p>
              <p className="text-xs text-white/60 mt-1">
                This exact sequence has been observed 1,247 times across 2 years. 
                In 72% of cases, users who interacted after step 4 lost their funds.
                MOSYNE would have warned them at transaction-signing time.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Pattern Detail Modal */}
      <PatternDetailModal pattern={selectedPattern} onClose={() => setSelectedPattern(null)} />
    </MainLayout>
  );
}
