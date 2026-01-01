'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, FeatureCard, ProgressCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import {
  MemoryTimelineChart,
  RiskDistributionChart,
  NetworkActivityChart,
  ChainDistributionChart,
  MemoryDepthChart,
  LivePulseChart,
} from '@/components/charts/AdvancedCharts';
import { PatternCard, MemorySequence } from '@/components/memory/PatternCard';
import { TransactionList } from '@/components/transactions/TransactionCard';
import { MetaMaskConnection, WalletActivityFeed } from '@/components/wallet/WalletConnect';
import LandingPage from '@/components/landing/LandingPage';
import { 
  realPatterns, 
  realTransactions, 
  analyticsData, 
  permissionConfigs,
  MOSYNE_CORE_STATS,
  envioStatus,
} from '@/lib/data/realData';
import { useMosyneStore } from '@/lib/store';
import {
  Brain,
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Database,
  Zap,
  Eye,
  Network,
  BarChart3,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';

// Dynamic import for 3D components (no SSR)
const MemoryVisualization3D = dynamic(
  () => import('@/components/3d/MemoryVisualization3D'),
  { ssr: false }
);

const TransactionFlow3D = dynamic(
  () => import('@/components/3d/TransactionFlow3D'),
  { ssr: false }
);

const DataVisualization3D = dynamic(
  () => import('@/components/3d/DataVisualization3D'),
  { ssr: false }
);

export default function HomePage() {
  const { patterns, setPatterns, transactions, setTransactions } = useMosyneStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string>();
  const [permissions, setPermissions] = useState(permissionConfigs);
  const [selectedPattern, setSelectedPattern] = useState<typeof realPatterns[0] | null>(null);
  const [show3D, setShow3D] = useState(true);

  // Initialize with real data
  useEffect(() => {
    setPatterns(realPatterns);
    setTransactions(realTransactions);
  }, [setPatterns, setTransactions]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.log('No existing connection');
        }
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      } else {
        // Demo mode - simulate connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8e5A1');
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
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

  // Show landing page if not connected
  if (!isConnected) {
    return <LandingPage onConnect={handleConnect} isConnecting={isConnecting} />;
  }

  // Dashboard view when connected
  return (
    <MainLayout>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to <span className="gradient-text">MOSYNE</span>
            </h1>
            <p className="text-white/60">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleDisconnect}>
            <LogOut className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </motion.div>

      {/* Hero Section with 3D Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mb-8 overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
        <div className="absolute inset-0 glass-card" />
        
        <div className="relative grid lg:grid-cols-2 gap-8 p-8">
          {/* Left: Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="info">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Powered by Envio HyperSync
                </Badge>
                <Badge variant="success">
                  <PulseIndicator status="online" />
                  <span className="ml-2">Live</span>
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="gradient-text-animated">MOSYNE</span>
                <br />
                <span className="text-white/90">Memory Engine</span>
              </h1>
              
              <p className="text-lg text-white/60 mb-6 max-w-md">
                Transform historical on-chain behavior into reusable intelligence at transaction-signing time.
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold font-mono text-neon-cyan">{(MOSYNE_CORE_STATS.totalMemoriesIndexed / 1_000_000).toFixed(1)}M</p>
                  <p className="text-xs text-white/50">Memories Indexed</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold font-mono text-neon-purple">{(MOSYNE_CORE_STATS.transactionsAnalyzed / 1_000_000).toFixed(1)}M</p>
                  <p className="text-xs text-white/50">Transactions Analyzed</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold font-mono text-neon-green">{(MOSYNE_CORE_STATS.threatsBlocked / 1_000).toFixed(1)}K</p>
                  <p className="text-xs text-white/50">Threats Blocked</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: 3D Visualization */}
          <div className="relative h-[400px] lg:h-[500px]">
            {show3D && <MemoryVisualization3D />}
            <button
              onClick={() => setShow3D(!show3D)}
              className="absolute bottom-4 right-4 px-3 py-1 text-xs bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              {show3D ? 'Hide 3D' : 'Show 3D'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Active Patterns"
          value={MOSYNE_CORE_STATS.activePatterns.toLocaleString()}
          icon={<Brain />}
          trend={12}
          color="cyan"
          delay={0.1}
        />
        <StatCard
          title="Transactions Analyzed"
          value={`${(MOSYNE_CORE_STATS.transactionsAnalyzed / 1_000_000).toFixed(1)}M`}
          icon={<Activity />}
          trend={8}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Threats Blocked"
          value={MOSYNE_CORE_STATS.threatsBlocked.toLocaleString()}
          icon={<Shield />}
          trend={23}
          color="green"
          delay={0.3}
        />
        <StatCard
          title="Avg Risk Score"
          value={`${(MOSYNE_CORE_STATS.avgRiskScore * 100).toFixed(1)}%`}
          icon={<AlertTriangle />}
          trend={-5}
          color="yellow"
          delay={0.4}
        />
      </Grid>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Charts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Memory Timeline */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Memory Timeline</h3>
                <p className="text-sm text-white/50">Patterns, transactions & threats over time</p>
              </div>
              <div className="flex items-center gap-2">
                {['7D', '30D', '90D', 'ALL'].map((period) => (
                  <button
                    key={period}
                    className="px-3 py-1 text-xs rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <MemoryTimelineChart data={analyticsData.timelineData} />
          </GlassCard>

          {/* Network Activity & Risk Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-1">Network Activity</h3>
              <p className="text-sm text-white/50 mb-4">24-hour transaction volume</p>
              <NetworkActivityChart data={analyticsData.networkActivity} />
            </GlassCard>
            
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-1">Risk Distribution</h3>
              <p className="text-sm text-white/50 mb-4">Overall risk assessment</p>
              <RiskDistributionChart data={analyticsData.riskDistribution} />
            </GlassCard>
          </div>

          {/* 3D Transaction Flow */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Transaction Flow</h3>
                <p className="text-sm text-white/50">Real-time behavioral flow visualization</p>
              </div>
              <Badge variant="info">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="h-[300px] rounded-xl overflow-hidden">
              {show3D && <TransactionFlow3D />}
            </div>
          </GlassCard>
        </div>

        {/* Right: Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Wallet Status */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
              <PulseIndicator status="online" />
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Protected</p>
                  <p className="text-xs text-white/50 font-mono">
                    {address?.slice(0, 10)}...{address?.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-lg font-bold text-neon-green">Safe</p>
                  <p className="text-xs text-white/50">Status</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-lg font-bold text-neon-cyan">12%</p>
                  <p className="text-xs text-white/50">Risk Score</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Envio Status */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Envio HyperSync</h4>
              <Badge variant="success" className="text-xs">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Query Latency</span>
                <span className="text-neon-cyan font-mono">{envioStatus.queryLatency}ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Blocks Indexed</span>
                <span className="text-white font-mono">{envioStatus.blocksIndexed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Uptime</span>
                <span className="text-neon-green font-mono">{envioStatus.uptime}%</span>
              </div>
            </div>
          </GlassCard>

          {/* Live Pulse */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white/70">System Pulse</h4>
              <PulseIndicator status={envioStatus.status === 'healthy' ? 'online' : 'warning'} />
            </div>
            <LivePulseChart />
            <div className="flex items-center justify-between mt-2 text-xs text-white/40">
              <span>Envio HyperSync Active</span>
              <span>~{envioStatus.queryLatency}ms latency</span>
            </div>
          </GlassCard>

          {/* Chain Distribution */}
          <GlassCard>
            <h4 className="text-sm font-medium text-white/70 mb-4">Chain Coverage</h4>
            <ChainDistributionChart data={analyticsData.chainDistribution} />
          </GlassCard>

          {/* Memory Depth */}
          <GlassCard>
            <h4 className="text-sm font-medium text-white/70 mb-4">Memory Depth</h4>
            <MemoryDepthChart data={analyticsData.memoryDepth} />
          </GlassCard>

          {/* Activity Feed */}
          <WalletActivityFeed />
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Active Patterns</h2>
            <p className="text-sm text-white/50">Recently detected behavioral patterns</p>
          </div>
          <Button variant="secondary" size="sm">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Grid cols={3}>
          {realPatterns.slice(0, 3).map((pattern, i) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PatternCard pattern={pattern} onClick={() => setSelectedPattern(pattern)} />
            </motion.div>
          ))}
        </Grid>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <p className="text-sm text-white/50">Analyzed transactions with memory insights</p>
          </div>
          <Button variant="secondary" size="sm">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <TransactionList transactions={realTransactions.slice(0, 5)} />
      </div>

      {/* Feature Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Core Features</h2>
        <Grid cols={4}>
          <FeatureCard
            title="Memory Engine"
            description="Access 2+ years of behavioral patterns indexed via Envio"
            icon={<Brain className="w-6 h-6" />}
            gradient="from-neon-cyan to-neon-blue"
            delay={0.1}
          />
          <FeatureCard
            title="Pattern Matching"
            description="Real-time matching against known exploit signatures"
            icon={<Network className="w-6 h-6" />}
            gradient="from-neon-purple to-neon-pink"
            delay={0.2}
          />
          <FeatureCard
            title="Risk Analysis"
            description="AI-powered risk scoring for every transaction"
            icon={<Shield className="w-6 h-6" />}
            gradient="from-neon-orange to-neon-red"
            delay={0.3}
          />
          <FeatureCard
            title="Predictive Safety"
            description="Learn from past exploits before they happen to your wallet"
            icon={<Zap className="w-6 h-6" />}
            gradient="from-neon-green to-neon-cyan"
            delay={0.4}
          />
        </Grid>
      </div>

      {/* 3D Data Visualization Section */}
      <GlassCard className="p-0 overflow-hidden mb-8">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <Badge variant="info" className="w-fit mb-4">
              <BarChart3 className="w-3 h-3 mr-1" />
              3D Analytics
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-4">
              Visualize Risk in 3D
            </h2>
            <p className="text-white/60 mb-6">
              Explore multi-dimensional risk data with our interactive 3D visualization engine. 
              Each hexagon represents a behavioral cluster, with height indicating severity and 
              color showing risk level.
            </p>
            <div className="space-y-3">
              <ProgressCard label="Exploit Patterns" value={MOSYNE_CORE_STATS.exploitPatternsDetected} max={1000} color="red" />
              <ProgressCard label="Rug Pull Indicators" value={MOSYNE_CORE_STATS.rugPullPatternsDetected} max={1000} color="orange" />
              <ProgressCard label="Safe Interactions" value={MOSYNE_CORE_STATS.safePatternsRecorded} max={500000} color="green" />
            </div>
          </div>
          <div className="h-[400px] bg-gradient-to-br from-white/5 to-transparent">
            {show3D && <DataVisualization3D />}
          </div>
        </div>
      </GlassCard>

      {/* Footer Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <blockquote className="text-xl text-white/70 italic max-w-2xl mx-auto">
          "Blockchains store everything, but remember nothing.
          <br />
          <span className="gradient-text font-semibold not-italic">MOSYNE changes that.</span>"
        </blockquote>
        <p className="text-sm text-white/40 mt-4">
          Built for MetaMask Advanced Permissions & Best Use of Envio
        </p>
      </motion.div>
    </MainLayout>
  );
}
