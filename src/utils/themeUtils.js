/**
 * Theme utility functions to generate responsive classes for dark/light modes
 */

export const themeClasses = {
  // Background colors
  bgPrimary: 'bg-[#0a0e27] light:bg-[#f5f5f7]',
  bgSecondary: 'bg-[#1a1f3a] light:bg-white',
  bgTertiary: 'bg-[#0f1535] light:bg-[#f9fafb]',
  
  // Text colors
  textPrimary: 'text-white light:text-[#1a1a1a]',
  textSecondary: 'text-slate-400 light:text-[#374151]',
  textTertiary: 'text-slate-500 light:text-[#6b7280]',
  
  // Border colors
  border: 'border-[#2a3060] light:border-[#e5e7eb]',
  
  // Cards and containers
  card: 'bg-[#1a1f3a] light:bg-white border border-[#2a3060] light:border-[#e5e7eb]',
  
  // Inputs
  input: 'bg-[#0a0e27] light:bg-[#f3f4f6] border border-[#2a3060] light:border-[#e5e7eb] text-white light:text-[#1a1a1a] placeholder-slate-600 light:placeholder-[#9ca3af]',
}

/**
 * Generate CSS classes that respond to light mode
 * Example: cn('bg-dark-primary', 'text-dark-primary') with light mode support
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
