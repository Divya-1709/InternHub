import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Check,
  Settings as SettingsIcon,
  LogOut,
  AppWindow,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTheme, themes } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const Settings = () => {
  const { themeName, changeTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appearance");
  const role = localStorage.getItem("role");

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account Info", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-full space-y-8 pb-12 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">System Settings</h1>
            <p className="text-[var(--text-muted)] mt-1">Manage your account preferences and application interface.</p>
          </div>
          <Button variant="outline" size="sm" color="danger" onClick={handleLogout}>
             <LogOut size={16} className="mr-2" /> Logout Session
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="border-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                      <CardTitle className="text-lg">Application Theme</CardTitle>
                      <p className="text-xs text-slate-500">Select a visual style for your dashboard.</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(themes).map(([key, themeData]) => (
                          <button
                            key={key}
                            onClick={() => {
                              changeTheme(key);
                              toast.success(`${themeData.name} theme applied`);
                            }}
                            className={`relative group p-4 rounded-2xl border-2 text-left transition-all ${
                              themeName === key 
                              ? 'border-indigo-600 bg-indigo-50/10' 
                              : 'border-slate-100 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-sm">
                                  {themeData.emoji}
                               </div>
                               {themeName === key && (
                                 <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                    <Check size={14} strokeWidth={3} />
                                 </div>
                               )}
                            </div>
                            <h4 className={`text-sm font-bold ${themeName === key ? 'text-indigo-900' : 'text-slate-800'}`}>
                               {themeData.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black opacity-60">
                               {themeData.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b">
                       <CardTitle className="text-lg">Display Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="divide-y divide-slate-100">
                          <div className="flex items-center justify-between p-6">
                             <div className="flex gap-4">
                                <Monitor className="text-slate-400" />
                                <div>
                                   <p className="text-sm font-bold text-slate-900">Reduced Motion</p>
                                   <p className="text-xs text-slate-500">Minimize animations and transitions.</p>
                                </div>
                             </div>
                             <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                             </div>
                          </div>
                          <div className="flex items-center justify-between p-6">
                             <div className="flex gap-4">
                                <AppWindow className="text-slate-400" />
                                <div>
                                   <p className="text-sm font-bold text-slate-900">Sidebar Density</p>
                                   <p className="text-xs text-slate-500">Adjust the spacing in navigation.</p>
                                </div>
                             </div>
                             <select className="text-xs font-bold border rounded px-2 py-1 bg-white outline-none">
                                <option>Comfortable</option>
                                <option>Compact</option>
                             </select>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b">
                      <CardTitle className="text-lg">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-6">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 border-dashed flex items-center justify-center text-slate-400">
                             <User size={32} />
                          </div>
                          <div className="space-y-2">
                             <Button size="sm" variant="outline">Change Avatar</Button>
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Recommended size: 400x400px</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Your Role</label>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 uppercase">
                               {role}
                            </div>
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Language</label>
                            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold">
                               <Globe size={16} className="text-slate-400" />
                               English (United States)
                            </div>
                         </div>
                       </div>
                       <Button className="w-fit" onClick={() => toast.success("Redirecting to profile edit...")}>
                          Manage Profile Details
                       </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {(activeTab === "notifications" || activeTab === "security") && (
                <Card className="border-slate-200 bg-slate-50/50 border-dashed border-2">
                   <CardContent className="p-12 text-center text-slate-400 space-y-2">
                      <SettingsIcon size={48} className="mx-auto mb-4 opacity-20" />
                      <h3 className="font-bold text-slate-600">Advanced Settings</h3>
                      <p className="text-sm">These enterprise features are currently in development.</p>
                   </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
};

export default Settings;
