"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Book, 
  Users, 
  BarChart3, 
  MessageCircle, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  GraduationCap,
  Activity,
  Plus,
  MoreHorizontal,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  Menu
} from "lucide-react";

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  type: "enrollment" | "completion" | "review" | "payment";
  user: string;
  course: string;
  timestamp: string;
  avatar?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ChartData {
  month: string;
  students: number;
  revenue: number;
}

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const metrics: DashboardMetric[] = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-[#00D563]" />
    },
    {
      title: "Active Courses",
      value: "8",
      change: "+2",
      trend: "up",
      icon: <Book className="h-6 w-6 text-[#00D563]" />
    },
    {
      title: "Monthly Revenue",
      value: "$47,892",
      change: "+18.2%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6 text-[#00D563]" />
    },
    {
      title: "Completion Rate",
      value: "84.3%",
      change: "-2.1%",
      trend: "down",
      icon: <GraduationCap className="h-6 w-6 text-[#00D563]" />
    }
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: "1",
      type: "enrollment",
      user: "Sarah Johnson",
      course: "Financial Mastery Course",
      timestamp: "2 hours ago",
      avatar: "/avatar1.jpg"
    },
    {
      id: "2", 
      type: "completion",
      user: "Mike Chen",
      course: "Business Fundamentals",
      timestamp: "4 hours ago",
      avatar: "/avatar2.jpg"
    },
    {
      id: "3",
      type: "review",
      user: "Emily Davis",
      course: "Financial Mastery Course",
      timestamp: "6 hours ago",
      avatar: "/avatar3.jpg"
    },
    {
      id: "4",
      type: "payment",
      user: "Alex Thompson",
      course: "Advanced Analytics",
      timestamp: "1 day ago",
      avatar: "/avatar4.jpg"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Create New Course",
      description: "Start building your next course",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => console.log("Create course")
    },
    {
      title: "Send Announcement",
      description: "Notify all students",
      icon: <MessageCircle className="h-5 w-5" />,
      onClick: () => console.log("Send announcement")
    },
    {
      title: "View Analytics",
      description: "Deep dive into metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => console.log("View analytics")
    }
  ];

  const chartData: ChartData[] = [
    { month: "Jan", students: 1200, revenue: 28000 },
    { month: "Feb", students: 1580, revenue: 32000 },
    { month: "Mar", students: 1890, revenue: 38000 },
    { month: "Apr", students: 2100, revenue: 41000 },
    { month: "May", students: 2450, revenue: 45000 },
    { month: "Jun", students: 2847, revenue: 47892 }
  ];

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Courses",
      href: "/dashboard/courses",
      icon: <Book className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Students",
      href: "/dashboard/students",
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Community",
      href: "/dashboard/community",
      icon: <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment": return <Users className="h-4 w-4 text-[#00D563]" />;
      case "completion": return <GraduationCap className="h-4 w-4 text-[#00D563]" />;
      case "review": return <Star className="h-4 w-4 text-yellow-500" />;
      case "payment": return <DollarSign className="h-4 w-4 text-[#00D563]" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case "enrollment": return `${item.user} enrolled in ${item.course}`;
      case "completion": return `${item.user} completed ${item.course}`;  
      case "review": return `${item.user} left a review for ${item.course}`;
      case "payment": return `${item.user} purchased ${item.course}`;
      default: return `${item.user} performed an action`;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "John Doe",
                href: "#",
                icon: (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                )
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-hidden">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back, John!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                Today
              </Button>
              <Button size="sm" className="bg-[#00D563] hover:bg-[#00D563]/90 text-black">
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 overflow-auto">
          {/* Metrics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900 border-gray-800 hover:border-[#00D563]/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      {metric.title}
                    </CardTitle>
                    {metric.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="flex items-center text-xs">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-[#00D563] mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={metric.trend === "up" ? "text-[#00D563]" : "text-red-500"}>
                        {metric.change}
                      </span>
                      <span className="text-gray-400 ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Student Growth</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly student enrollment trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {chartData.map((data, index) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <motion.div
                          className="w-full bg-[#00D563] rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.students / 3000) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                        <span className="text-xs text-gray-400 mt-2">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 border-gray-700 hover:border-[#00D563]/50 flex flex-col items-start gap-2"
                          onClick={action.onClick}
                        >
                          <div className="w-8 h-8 bg-[#00D563]/10 rounded-lg flex items-center justify-center">
                            {action.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-white">{action.title}</div>
                            <div className="text-xs text-gray-400">{action.description}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{getActivityText(item)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{item.timestamp}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-[#00D563] hover:text-[#00D563]/80">
                    View All Activity
                    <ArrowUpRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>

              {/* Course Performance */}
              <Card className="bg-gray-900 border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Top Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Financial Mastery Course", students: 1247, completion: 89 },
                      { name: "Business Fundamentals", students: 892, completion: 92 },
                      { name: "Advanced Analytics", students: 708, completion: 76 }
                    ].map((course, index) => (
                      <motion.div
                        key={course.name}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{course.name}</span>
                          <Badge variant="secondary" className="bg-[#00D563]/10 text-[#00D563]">
                            {course.students} students
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Completion Rate</span>
                            <span className="text-gray-400">{course.completion}%</span>
                          </div>
                          <Progress value={course.completion} className="h-1 bg-gray-800" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="w-8 h-8 bg-[#00D563] rounded-lg flex items-center justify-center">
        <span className="text-black font-bold text-sm">LC</span>
      </div>
      <span className="font-bold text-lg text-white">Limitless Concepts</span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 bg-[#00D563] rounded-lg flex items-center justify-center">
        <span className="text-black font-bold text-sm">LC</span>
      </div>
    </div>
  );
};