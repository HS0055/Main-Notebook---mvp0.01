"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "courses",
    label: "Courses",
    href: "/dashboard/courses",
    icon: GraduationCap,
  },
  {
    id: "students",
    label: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    id: "community",
    label: "Community",
    href: "/dashboard/community",
    icon: MessageSquare,
    badge: 3,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const mockUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "/avatar.jpg",
  role: "Administrator",
};

const sidebarVariants = {
  expanded: { width: "280px" },
  collapsed: { width: "80px" },
};

const menuItemVariants: any = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#00D563] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">LC</span>
          </div>
          <AnimatePresence>
            {(!isCollapsed || mobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h2 className="text-xl font-bold text-white">Limitless Concepts</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial="hidden"
              animate="visible"
              variants={menuItemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href} onClick={mobile ? toggleMobileMenu : undefined}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors",
                    isActiveRoute(item.href)
                      ? "bg-[#00D563]/20 text-[#00D563] border border-[#00D563]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {(!isCollapsed || mobile) && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && (!isCollapsed || mobile) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-[#00D563] text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto hover:bg-white/5",
                isCollapsed && !mobile ? "justify-center" : ""
              )}
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-[#00D563] text-black">
                  {mockUser.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {(!isCollapsed || mobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-white">{mockUser.name}</p>
                    <p className="text-xs text-gray-400">{mockUser.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
            <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-gray-700" />
            <DropdownMenuItem className="text-gray-300 hover:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-gray-700" />
            <DropdownMenuItem className="text-gray-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex flex-col bg-gray-950 border-r border-white/10 relative"
      >
        <SidebarContent />
        
        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-900 border border-white/20 hover:bg-white/10 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-950 border-r border-white/10 z-50 lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="relative flex items-center justify-between px-8 py-5 border-b border-white/5 bg-gradient-to-r from-gray-950/95 via-gray-900/95 to-gray-950/95 backdrop-blur-2xl">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
          
          <div className="relative flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden hover:bg-white/8 transition-all duration-200 rounded-xl p-2.5"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </Button>
            
            <div className="hidden sm:flex items-center space-x-3 bg-white/[0.03] rounded-2xl px-5 py-3 hover:bg-white/[0.06] transition-all duration-300 group border border-white/[0.05] hover:border-white/[0.1]">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search courses, students, or content..."
                className="bg-transparent border-none outline-none text-sm placeholder-gray-500 w-80 group-hover:placeholder-gray-300 transition-colors duration-200"
              />
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-white/[0.08] rounded-lg border border-white/[0.1]">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="relative flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-white/8 transition-all duration-200 p-3 rounded-xl group"
            >
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-[#00D563] to-[#00B84A] rounded-full animate-pulse shadow-lg shadow-[#00D563]/30"></span>
            </Button>
            
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-white/8 transition-all duration-200 rounded-xl p-2">
                    <Avatar className="w-8 h-8 ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#00D563] to-[#00B84A] text-black text-xs font-semibold">
                        {mockUser.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                  <DropdownMenuLabel className="text-gray-200 font-medium">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-gray-700/50" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-gray-700/50" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}