import React from 'react';
import { UserRole, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  Building2, 
  HeartHandshake, 
  Bike, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Flame, 
  Bot,
  BarChart3,
  MapPin
} from 'lucide-react';

interface HeaderNavProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageToggle: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenDonationModal: () => void;
  onOpenChatbot: () => void;
  activeTab: 'dashboard' | 'map' | 'analytics';
  onTabChange: (tab: 'dashboard' | 'map' | 'analytics') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageToggle,
  isDarkMode,
  onDarkModeToggle,
  unreadCount,
  onOpenNotifications,
  onOpenDonationModal,
  onOpenChatbot,
  activeTab,
  onTabChange
}) => {
  const t = getTranslation(language);

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'restaurant', label: t.roleRestaurant, icon: <Building2 className="w-4 h-4" />, color: 'bg-[#2E7D32] text-white' },
    { key: 'ngo', label: t.roleNgo, icon: <HeartHandshake className="w-4 h-4" />, color: 'bg-blue-600 text-white' },
    { key: 'volunteer', label: t.roleVolunteer, icon: <Bike className="w-4 h-4" />, color: 'bg-[#FF9800] text-white' },
    { key: 'admin', label: t.roleAdmin, icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-purple-700 text-white' },
  ];

  return (
    <header className={`sticky top-0 z-30 border-b transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Top Banner & Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & App Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#2E7D32]/20">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#2E7D32] dark:text-[#81C784]">
                  {t.appName}
                </span>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#1B5E20]/40 border border-[#2E7D32]/20">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#2E7D32] dark:text-[#81C784]">
                    AI Node Active
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-[#2E7D32] dark:text-[#81C784] shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#2E7D32]" />
              {t.dashboard}
            </button>
            <button
              onClick={() => onTabChange('map')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-700 text-[#2E7D32] dark:text-[#81C784] shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#FF9800]" />
              {t.liveMap}
            </button>
            <button
              onClick={() => onTabChange('analytics')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-[#2E7D32] dark:text-[#81C784] shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#2E7D32]" />
              {t.analytics}
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Quick Donate Button (if restaurant role) */}
            {currentRole === 'restaurant' && (
              <button
                onClick={onOpenDonationModal}
                className="px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#2E7D32]/20 transition-all flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-[#FF9800] animate-pulse" />
                <span className="hidden sm:inline">{t.newDonation}</span>
                <span className="sm:hidden">+ Donate</span>
              </button>
            )}

            {/* AI Assistant Floating Trigger */}
            <button
              onClick={onOpenChatbot}
              className="p-2 px-3 rounded-xl bg-[#E8F5E9] dark:bg-[#1B5E20]/30 text-[#2E7D32] dark:text-[#81C784] border border-[#2E7D32]/20 hover:bg-[#C8E6C9] transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Open AI Chat Assistant"
            >
              <Bot className="w-4 h-4 text-[#2E7D32] dark:text-[#81C784] animate-bounce" />
              <span className="hidden lg:inline">{t.chatbot}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onLanguageToggle}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1 text-slate-700 dark:text-slate-300"
              title="Switch Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{t.langToggle}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onDarkModeToggle}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Role Selector Toolbar Bar */}
        <div className="py-2 overflow-x-auto flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
              User Role:
            </span>
            {roles.map((r) => {
              const isSelected = currentRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => onRoleChange(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? `${r.color} shadow-sm ring-2 ring-emerald-500/30 font-bold`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Mobile view subnav */}
          <div className="flex md:hidden items-center gap-1 text-xs">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-2 py-1 rounded-md ${activeTab === 'dashboard' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 font-bold' : 'text-slate-500'}`}
            >
              {t.dashboard}
            </button>
            <button
              onClick={() => onTabChange('map')}
              className={`px-2 py-1 rounded-md ${activeTab === 'map' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 font-bold' : 'text-slate-500'}`}
            >
              {t.liveMap}
            </button>
            <button
              onClick={() => onTabChange('analytics')}
              className={`px-2 py-1 rounded-md ${activeTab === 'analytics' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 font-bold' : 'text-slate-500'}`}
            >
              {t.analytics}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
