import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, role }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const handleToggle = (collapsed) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex overflow-x-hidden transition-colors duration-300">
      <Sidebar 
        role={role} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={handleToggle} 
      />

      <motion.main
        animate={{ 
          paddingLeft: isCollapsed ? '80px' : '260px' 
        }}
        className="flex-1 transition-all duration-300 ease-in-out min-w-0"
      >
        <div className="h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              layout // Add layout prop for smoother transitions
              key={window.location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 md:p-8 xl:p-12 w-full max-w-[1920px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
