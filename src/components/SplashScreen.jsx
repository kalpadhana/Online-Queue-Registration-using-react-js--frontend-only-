import { Zap, ArrowRight } from 'lucide-react'

export default function SplashScreen({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27] flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
            <Zap size={48} className="text-blue-400 animate-bounce" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-black mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            QueueSmart
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
          Intelligent Queue Management System
        </p>

        {/* Description */}
        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Experience the future of waiting lines. Smart queue tracking, real-time updates, and zero hassle. Join thousands of satisfied users today.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '⚡', title: 'Real-time Tracking', desc: 'Know your exact position' },
            { icon: '📊', title: 'Smart Analytics', desc: 'Data-driven insights' },
            { icon: '🎯', title: 'Priority Queue', desc: 'Fair & transparent' }
          ].map((feature, i) => (
            <div key={i} className="p-4 bg-[#1a1f3a]/50 border border-[#2a3060] rounded-xl backdrop-blur-sm hover:border-blue-500/30 transition-all">
              <p className="text-2xl mb-2">{feature.icon}</p>
              <p className="font-semibold text-white mb-1">{feature.title}</p>
              <p className="text-xs text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-lg text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Footer text */}
        <p className="mt-12 text-slate-500 text-sm">
          Already have an account?{' '}
          <span className="text-blue-400 cursor-pointer hover:text-blue-300">Sign in</span>
        </p>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 text-6xl animate-pulse opacity-20">
        📍
      </div>
      <div className="absolute top-1/4 right-10 text-6xl animate-bounce opacity-20" style={{ animationDelay: '0.5s' }}>
        ✨
      </div>
      <div className="absolute bottom-1/4 right-20 text-6xl animate-pulse opacity-20" style={{ animationDelay: '1s' }}>
        ⏱️
      </div>
    </div>
  )
}
