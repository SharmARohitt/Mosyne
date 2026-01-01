'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import {
  MemoryTimelineChart,
  RiskDistributionChart,
  NetworkActivityChart,
  ChainDistributionChart,
  RiskScatterChart,
  MemoryDepthChart,
} from '@/components/charts/AdvancedCharts';
import { analyticsData, MOSYNE_CORE_STATS } from '@/lib/data/realData';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
} from 'lucide-react';

const DataVisualization3D = dynamic(
  () => import('@/components/3d/DataVisualization3D'),
  { ssr: false }
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30D');
  const [isLoading, setIsLoading] = useState(false);

  const scatterData = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random(),
    z: Math.random() * 300 + 100,
    name: `Pattern ${i + 1}`,
  }));

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into on-chain behavioral patterns"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Analytics' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={refreshData}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          {['24H', '7D', '30D', '90D', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Calendar className="w-4 h-4" />
          <span>Last updated: 2 min ago</span>
          <PulseIndicator status="online" />
        </div>
      </div>

      {/* Key Metrics */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Total Transactions"
          value={(MOSYNE_CORE_STATS.transactionsAnalyzed / 1_000_000).toFixed(1) + 'M'}
          subtitle="Across all chains"
          icon={<Activity />}
          trend={12}
          color="cyan"
        />
        <StatCard
          title="Risk Events"
          value={MOSYNE_CORE_STATS.threatsIdentified.toLocaleString()}
          subtitle="Detected threats"
          icon={<TrendingUp />}
          trend={-8}
          color="red"
        />
        <StatCard
          title="Safe Interactions"
          value={((1 - MOSYNE_CORE_STATS.falsePositiveRate) * 100).toFixed(1) + '%'}
          subtitle="Success rate"
          icon={<TrendingUp />}
          trend={2}
          color="green"
        />
        <StatCard
          title="Avg Response"
          value={MOSYNE_CORE_STATS.avgQueryLatency + 'ms'}
          subtitle="HyperSync query time"
          icon={<Activity />}
          color="purple"
        />
      </Grid>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Memory Timeline</h3>
              <p className="text-sm text-white/50">Patterns & threats over time</p>
            </div>
            <LineChart className="w-5 h-5 text-neon-cyan" />
          </div>
          <MemoryTimelineChart data={analyticsData.timelineData} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Risk Scatter Analysis</h3>
              <p className="text-sm text-white/50">Pattern distribution by risk & time</p>
            </div>
            <BarChart3 className="w-5 h-5 text-neon-purple" />
          </div>
          <RiskScatterChart data={scatterData} />
        </GlassCard>
      </div>

      {/* 3D Visualization */}
      <GlassCard className="mb-8 p-0 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="info">
                <BarChart3 className="w-3 h-3 mr-1" />
                3D Analytics
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Multi-Dimensional Risk Analysis
            </h3>
            <p className="text-white/60 mb-6">
              Explore pattern clusters in 3D space. Height represents severity,
              color indicates risk level, and position shows temporal proximity.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neon-green" />
                  <span className="text-sm text-white/70">Low Risk Clusters</span>
                </div>
                <span className="text-sm font-mono text-neon-green">458,293</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neon-orange" />
                  <span className="text-sm text-white/70">Medium Risk Clusters</span>
                </div>
                <span className="text-sm font-mono text-neon-orange">1,247</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neon-red" />
                  <span className="text-sm text-white/70">High Risk Clusters</span>
                </div>
                <span className="text-sm font-mono text-neon-red">567</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] bg-gradient-to-br from-white/5 to-transparent">
            <DataVisualization3D />
          </div>
        </div>
      </GlassCard>

      {/* Bottom Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Risk Distribution</h3>
              <p className="text-xs text-white/50">Overall assessment</p>
            </div>
            <PieChart className="w-4 h-4 text-white/30" />
          </div>
          <RiskDistributionChart data={analyticsData.riskDistribution} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Network Activity</h3>
              <p className="text-xs text-white/50">24-hour volume</p>
            </div>
            <Activity className="w-4 h-4 text-white/30" />
          </div>
          <NetworkActivityChart data={analyticsData.networkActivity} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Chain Distribution</h3>
              <p className="text-xs text-white/50">Multi-chain coverage</p>
            </div>
            <Globe className="w-4 h-4 text-white/30" />
          </div>
          <ChainDistributionChart data={analyticsData.chainDistribution} />
        </GlassCard>
      </div>

      {/* Memory Depth Chart */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Memory Depth Analysis</h3>
            <p className="text-sm text-white/50">Historical data coverage by time period</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">2+ Years of Data</Badge>
          </div>
        </div>
        <MemoryDepthChart data={analyticsData.memoryDepth} />
        
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Envio HyperSync Advantage</p>
              <p className="text-xs text-white/60 mt-1">
                MOSYNE leverages Envio's HyperSync to query 2+ years of historical blockchain data 
                in milliseconds, enabling real-time pattern matching that would be impossible with 
                traditional RPC endpoints.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </MainLayout>
  );
}
