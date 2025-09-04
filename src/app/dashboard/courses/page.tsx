"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Plus, 
  Users, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Play,
  Pause,
  Archive,
  Eye,
  TrendingUp,
  BookOpen,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  students: number;
  status: "Published" | "Draft" | "Archived";
  revenue: number;
  progress: number;
  createdAt: Date;
  duration: string;
  modules: number;
  category: string;
  rating: number;
}

interface SortOption {
  value: string;
  label: string;
}

const CardContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      whileHover={{ 
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const courses: Course[] = [
    {
      id: "1",
      title: "Financial Mastery Course",
      description: "Complete guide to personal and business finance management with real-world applications.",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      students: 2847,
      status: "Published",
      revenue: 142350,
      progress: 85,
      createdAt: new Date(2024, 0, 15),
      duration: "8 weeks",
      modules: 24,
      category: "Finance",
      rating: 4.9
    },
    {
      id: "2",
      title: "Business Fundamentals",
      description: "Essential business concepts for entrepreneurs and professionals looking to excel.",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      students: 1923,
      status: "Published",
      revenue: 96150,
      progress: 92,
      createdAt: new Date(2024, 1, 3),
      duration: "6 weeks",
      modules: 18,
      category: "Business",
      rating: 4.7
    },
    {
      id: "3",
      title: "Advanced Analytics",
      description: "Data-driven decision making with advanced analytics tools and techniques.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      students: 1456,
      status: "Published",
      revenue: 87360,
      progress: 73,
      createdAt: new Date(2024, 2, 10),
      duration: "10 weeks",
      modules: 32,
      category: "Analytics",
      rating: 4.8
    },
    {
      id: "4",
      title: "Marketing Strategies",
      description: "Modern marketing approaches for digital and traditional channels.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      students: 892,
      status: "Draft",
      revenue: 0,
      progress: 45,
      createdAt: new Date(2024, 3, 5),
      duration: "7 weeks",
      modules: 21,
      category: "Marketing",
      rating: 0
    },
    {
      id: "5",
      title: "Leadership Development",
      description: "Building effective leadership skills for teams and organizations.",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
      students: 654,
      status: "Archived",
      revenue: 32700,
      progress: 100,
      createdAt: new Date(2023, 11, 20),
      duration: "5 weeks",
      modules: 15,
      category: "Leadership",
      rating: 4.6
    },
    {
      id: "6",
      title: "Digital Transformation",
      description: "Navigate the digital landscape with cutting-edge strategies and tools.",
      thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop",
      students: 1234,
      status: "Published",
      revenue: 74040,
      progress: 67,
      createdAt: new Date(2024, 3, 12),
      duration: "9 weeks",
      modules: 27,
      category: "Technology",
      rating: 4.5
    }
  ];

  const sortOptions: SortOption[] = [
    { value: "createdAt", label: "Date Created" },
    { value: "students", label: "Enrollment" },
    { value: "revenue", label: "Revenue" },
    { value: "title", label: "Title" },
    { value: "rating", label: "Rating" }
  ];

  const statusOptions = ["All", "Published", "Draft", "Archived"];
  const categoryOptions = ["All", "Finance", "Business", "Analytics", "Marketing", "Leadership", "Technology"];

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || course.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || course.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "students":
          aValue = a.students;
          bValue = b.students;
          break;
        case "revenue":
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [courses, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const getStatusBadgeColor = (status: Course["status"]) => {
    switch (status) {
      case "Published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-400">Manage your educational content and track performance</p>
          </div>
          <Button className="bg-[#00D563] hover:bg-[#00C557] text-black font-semibold mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-gray-900/50 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredAndSortedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardContainer>
                  <Card className="bg-gray-900/80 border-gray-800 overflow-hidden hover:border-[#00D563]/50 transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getStatusBadgeColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary" className="bg-black/50 hover:bg-black/70">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {course.status === "Published" ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{course.title}</h3>
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-yellow-400">
                            ⭐ {course.rating}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#00D563]" />
                          <span>{formatNumber(course.students)} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#00D563]" />
                          <span>{course.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#00D563]" />
                          <span>{formatCurrency(course.revenue)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00D563]" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Course Progress</span>
                          <span className="text-[#00D563]">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <motion.div
                            className="bg-[#00D563] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="default" className="bg-[#00D563] hover:bg-[#00C557] text-black flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          <TrendingUp className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContainer>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAndSortedCourses.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new course</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}