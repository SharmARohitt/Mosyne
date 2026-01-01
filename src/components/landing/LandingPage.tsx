'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { Button } from '@/components/ui/Buttons';
import { Badge, GlassCard, PulseIndicator } from '@/components/ui/Cards';
import { MOSYNE_CORE_STATS } from '@/lib/data/realData';
import {
  Brain,
  Shield,
  Zap,
  Eye,
  Database,
  Network,
  Lock,
  Activity,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Layers,
  GitBranch,
  Target,
} from 'lucide-react';

const MemoryVisualization3D = dynamic(
  () => import('@/components/3d/MemoryVisualization3D'),
  { ssr: false }
);

const DataVisualization3D = dynamic(
  () => import('@/components/3d/DataVisualization3D'),
  { ssr: false }
);

const TransactionFlow3D = dynamic(
  () => import('@/components/3d/TransactionFlow3D'),
  { ssr: false }
);

interface LandingPageProps {
  onConnect: () => void;
  isConnecting?: boolean;
}

export default function LandingPage({ onConnect, isConnecting }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Memory Engine',
      description: 'Transform 2+ years of blockchain history into reusable behavioral intelligence',
      color: 'cyan',
      stat: '2.8M+ Memories',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Real-Time Protection',
      description: 'Analyze transactions at signing time against known exploit patterns',
      color: 'green',
      stat: '11K+ Threats Blocked',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Envio HyperSync',
      description: 'Query historical blockchain data in milliseconds, not minutes',
      color: 'purple',
      stat: '47ms Avg Latency',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Pattern Recognition',
      description: 'Detect reentrancy, flash loans, rug pulls, and 50+ exploit signatures',
      color: 'orange',
      stat: '847 Active Patterns',
    },
  ];

  const stats = [
    { value: '158M+', label: 'Transactions Analyzed', icon: <Activity /> },
    { value: '2.8M+', label: 'Memories Indexed', icon: <Database /> },
    { value: '11.2K', label: 'Threats Blocked', icon: <Shield /> },
    { value: '99.97%', label: 'Uptime', icon: <CheckCircle /> },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Connect Your Wallet',
      description: 'Link your MetaMask to access MOSYNE protection',
      icon: <Lock />,
    },
    {
      step: 2,
      title: 'Automatic Analysis',
      description: 'Every transaction is analyzed against 2.8M+ behavioral memories',
      icon: <Brain />,
    },
    {
      step: 3,
      title: 'Risk Assessment',
      description: 'Get instant risk scores and pattern matches before signing',
      icon: <AlertTriangle />,
    },
    {
      step: 4,
      title: 'Safe Execution',
      description: 'Proceed with confidence or block high-risk transactions',
      icon: <CheckCircle />,
    },
  ];

  const protectedChains = [
    { name: 'Ethereum', color: '#627EEA' },
    { name: 'Polygon', color: '#8247E5' },
    { name: 'Arbitrum', color: '#28A0F0' },
    { name: 'Optimism', color: '#FF0420' },
    { name: 'Base', color: '#0052FF' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[200px]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MOSYNE</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-white/60 hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="text-white/60 hover:text-white transition-colors">Stats</a>
          </div>

          <Button variant="primary" size="sm" onClick={onConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Launch App'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="info">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by Envio HyperSync
              </Badge>
              <Badge variant="success">
                <PulseIndicator status="online" />
                <span className="ml-2">Live on Mainnet</span>
              </Badge>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="gradient-text-animated">Collective</span>
              <br />
              <span className="text-white">On-Chain</span>
              <br />
              <span className="gradient-text">Memory</span>
            </h1>

            <p className="text-xl text-white/60 mb-8 max-w-lg">
              Blockchains store everything, but remember nothing.
              <span className="text-white font-medium"> MOSYNE changes that.</span>
            </p>

            <p className="text-white/50 mb-8 max-w-lg">
              Transform 2+ years of historical blockchain behavior into real-time protection. 
              Every transaction you sign is analyzed against millions of behavioral memories.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Button glow size="lg" onClick={onConnect} disabled={isConnecting}>
                <Brain className="w-5 h-5" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              <Button variant="secondary" size="lg">
                <Eye className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8">
              {stats.slice(0, 3).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-2xl font-bold font-mono gradient-text">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-purple/20 rounded-3xl" />
            <MemoryVisualization3D />
            
            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-10 glass-card p-4 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-sm text-white/70">Pattern Detected</span>
              </div>
              <p className="text-xs text-neon-red mt-1">Flash Loan Exploit</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-20 left-10 glass-card p-4 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="text-sm text-white/70">Safe Transaction</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Risk Score: 12%</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">
              <Layers className="w-3 h-3 mr-1" />
              Core Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Blockchain Memory, <span className="gradient-text">Reimagined</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Four pillars of protection powered by collective on-chain intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-neon-cyan/30 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-neon-${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`text-neon-${feature.color}`}>{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 mb-4">{feature.description}</p>
                <div className={`text-sm font-mono text-neon-${feature.color}`}>{feature.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Visualization Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 h-[400px] rounded-3xl overflow-hidden glass-card"
            >
              <DataVisualization3D />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge variant="purple" className="mb-4">
                <Target className="w-3 h-3 mr-1" />
                Visual Intelligence
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                See Risk in <span className="gradient-text">3D</span>
              </h2>
              <p className="text-white/60 mb-6">
                Our interactive 3D visualization engine maps behavioral patterns across multiple dimensions. 
                Height indicates severity, color shows risk level, and clustering reveals related exploit families.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-neon-green" />
                  <span className="text-sm text-white/70">Low Risk Patterns</span>
                  <span className="ml-auto text-sm font-mono text-neon-green">458,293</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-neon-orange" />
                  <span className="text-sm text-white/70">Medium Risk Patterns</span>
                  <span className="ml-auto text-sm font-mono text-neon-orange">1,247</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-neon-red" />
                  <span className="text-sm text-white/70">High Risk Patterns</span>
                  <span className="ml-auto text-sm font-mono text-neon-red">567</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="success" className="mb-4">
              <GitBranch className="w-3 h-3 mr-1" />
              How It Works
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Protection in <span className="gradient-text">Four Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                )}
                
                <div className="glass-card p-6 rounded-2xl text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-4 relative">
                    <div className="text-neon-cyan">{step.icon}</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center text-sm font-bold text-black">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-12 rounded-3xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-4">
                    <div className="text-neon-cyan">{stat.icon}</div>
                  </div>
                  <p className="text-4xl font-bold font-mono gradient-text mb-2">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Chains Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 mb-8">Protected across leading networks</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {protectedChains.map((chain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                <span className="text-white/70">{chain.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to <span className="gradient-text">Remember</span>?
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-xl mx-auto">
                Join thousands of wallets protected by collective on-chain memory. 
                Connect now and never sign blind again.
              </p>

              <Button glow size="lg" onClick={onConnect} disabled={isConnecting}>
                <Brain className="w-5 h-5" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet & Start'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">MOSYNE</span>
            <span className="text-white/40">|</span>
            <span className="text-white/40 text-sm">Collective On-Chain Memory Engine</span>
          </div>

          <p className="text-white/40 text-sm">
            Built for MetaMask Advanced Permissions & Best Use of Envio
          </p>
        </div>
      </footer>
    </div>
  );
}
