"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  MoreVertical,
  User,
  Mail,
  Calendar,
  BookOpen,
  TrendingUp,
  CreditCard,
  Activity,
  UserCheck,
  UserX,
  Eye,
  Grid2X2,
  List,
  ChevronDown,
  SortAsc,
  SortDesc,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TypeScript interfaces
interface Course {
  id: string;
  name: string;
  progress: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "suspended" | "pending";
  courses: Course[];
  overallProgress: number;
  completionRate: number;
  paymentStatus: "paid" | "pending" | "overdue" | "trial";
  totalSpent: number;
  lastActivity: string;
  lastLogin: string;
}

interface FilterOptions {
  status: string;
  course: string;
  paymentStatus: string;
}

interface SortOption {
  field: keyof Student | "totalSpent" | "overallProgress";
  direction: "asc" | "desc";
}

// Sample data
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/avatars/sarah.jpg",
    enrollmentDate: "2024-01-15",
    status: "active",
    courses: [
      { id: "1", name: "Introduction to Finance", progress: 85 },
      { id: "2", name: "Advanced Investment Strategies", progress: 45 }
    ],
    overallProgress: 65,
    completionRate: 75,
    paymentStatus: "paid",
    totalSpent: 299,
    lastActivity: "2024-01-22",
    lastLogin: "2024-01-22 14:30"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    enrollmentDate: "2024-01-10",
    status: "active",
    courses: [
      { id: "1", name: "Introduction to Finance", progress: 100 },
      { id: "3", name: "Personal Budgeting Masterclass", progress: 30 }
    ],
    overallProgress: 65,
    completionRate: 50,
    paymentStatus: "paid",
    totalSpent: 199,
    lastActivity: "2024-01-21",
    lastLogin: "2024-01-21 09:15"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    enrollmentDate: "2024-01-18",
    status: "pending",
    courses: [
      { id: "1", name: "Introduction to Finance", progress: 15 }
    ],
    overallProgress: 15,
    completionRate: 15,
    paymentStatus: "trial",
    totalSpent: 0,
    lastActivity: "2024-01-20",
    lastLogin: "2024-01-20 16:45"
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@email.com",
    enrollmentDate: "2023-12-05",
    status: "active",
    courses: [
      { id: "1", name: "Introduction to Finance", progress: 100 },
      { id: "2", name: "Advanced Investment Strategies", progress: 100 },
      { id: "3", name: "Personal Budgeting Masterclass", progress: 80 }
    ],
    overallProgress: 93,
    completionRate: 90,
    paymentStatus: "paid",
    totalSpent: 597,
    lastActivity: "2024-01-22",
    lastLogin: "2024-01-22 11:20"
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    enrollmentDate: "2024-01-08",
    status: "suspended",
    courses: [
      { id: "2", name: "Advanced Investment Strategies", progress: 25 }
    ],
    overallProgress: 25,
    completionRate: 25,
    paymentStatus: "overdue",
    totalSpent: 99,
    lastActivity: "2024-01-15",
    lastLogin: "2024-01-15 08:30"
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@email.com",
    enrollmentDate: "2024-01-12",
    status: "inactive",
    courses: [
      { id: "1", name: "Introduction to Finance", progress: 5 }
    ],
    overallProgress: 5,
    completionRate: 5,
    paymentStatus: "pending",
    totalSpent: 0,
    lastActivity: "2024-01-13",
    lastLogin: "2024-01-13 19:45"
  }
];

const StudentManagement = () => {
  const [students] = useState<Student[]>(sampleStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    course: "all",
    paymentStatus: "all"
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "name",
    direction: "asc"
  });
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || student.status === filters.status;
      const matchesPayment = filters.paymentStatus === "all" || student.paymentStatus === filters.paymentStatus;
      const matchesCourse = filters.course === "all" || 
        student.courses.some(course => course.name === filters.course);

      return matchesSearch && matchesStatus && matchesPayment && matchesCourse;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortOption.field];
      let bValue: any = b[sortOption.field];

      if (sortOption.field === "totalSpent" || sortOption.field === "overallProgress") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOption.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, searchTerm, filters, sortOption]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredAndSortedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const getStatusBadge = (status: Student["status"]) => {
    const variants = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      suspended: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: Student["paymentStatus"]) => {
    const variants = {
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      overdue: "bg-red-500/20 text-red-400 border-red-500/30",
      trial: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status === "trial" ? "Free Trial" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const StudentCard = ({ student }: { student: Student }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={selectedStudents.includes(student.id)}
                onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
              />
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="bg-green-500/20 text-green-400">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold">{student.name}</h3>
                <p className="text-gray-400 text-sm">{student.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                <DropdownMenuItem className="text-gray-300 hover:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-gray-700" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              {getStatusBadge(student.status)}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment</p>
              {getPaymentStatusBadge(student.paymentStatus)}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-sm">Overall Progress</p>
              <p className="text-white text-sm font-medium">{student.overallProgress}%</p>
            </div>
            <Progress value={student.overallProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Enrolled</p>
              <p className="text-white">{formatDate(student.enrollmentDate)}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Spent</p>
              <p className="text-white">${student.totalSpent}</p>
            </div>
            <div>
              <p className="text-gray-400">Courses</p>
              <p className="text-white">{student.courses.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Last Activity</p>
              <p className="text-white">{formatDate(student.lastActivity)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold">Student Management</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className={viewMode === "cards" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
            </div>
            
            {selectedStudents.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-700">
                    Bulk Actions ({selectedStudents.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                  <DropdownMenuItem className="text-gray-300 hover:text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message to Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button className="bg-green-500 hover:bg-green-600">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-white">{students.length}</p>
                </div>
                <User className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                  <p className="text-2xl font-bold text-white">
                    {students.filter(s => s.status === "active").length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${students.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                  <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700">
                      <SortAsc className="w-4 h-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuLabel className="text-gray-400">Sort by</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => setSortOption({ field: "name", direction: "asc" })}
                      className="text-gray-300 hover:text-white"
                    >
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortOption({ field: "enrollmentDate", direction: "desc" })}
                      className="text-gray-300 hover:text-white"
                    >
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortOption({ field: "overallProgress", direction: "desc" })}
                      className="text-gray-300 hover:text-white"
                    >
                      Progress (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setSortOption({ field: "totalSpent", direction: "desc" })}
                      className="text-gray-300 hover:text-white"
                    >
                      Spending (High to Low)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Display */}
        <AnimatePresence mode="wait">
          {viewMode === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredAndSortedStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <td className="p-4">
                            <Checkbox
                              checked={selectedStudents.length === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </td>
                          <th className="text-left p-4 text-gray-400 font-medium">Student</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Courses</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Progress</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Payment</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Spent</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Last Login</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedStudents.map((student) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-b border-gray-800 hover:bg-gray-850 transition-colors"
                          >
                            <td className="p-4">
                              <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={student.avatar} />
                                  <AvatarFallback className="bg-green-500/20 text-green-400">
                                    {student.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white font-medium">{student.name}</p>
                                  <p className="text-gray-400 text-sm">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(student.status)}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {student.courses.map(course => (
                                  <div key={course.id} className="text-sm">
                                    <p className="text-white">{course.name}</p>
                                    <Progress value={course.progress} className="h-1 w-20" />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Progress value={student.overallProgress} className="w-16 h-2" />
                                <span className="text-white text-sm font-medium">
                                  {student.overallProgress}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              {getPaymentStatusBadge(student.paymentStatus)}
                            </td>
                            <td className="p-4">
                              <p className="text-white font-medium">${student.totalSpent}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-gray-300 text-sm">{student.lastLogin}</p>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                  <DropdownMenuItem className="text-gray-300 hover:text-white">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-gray-300 hover:text-white">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="border-gray-700" />
                                  <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                    <UserX className="w-4 h-4 mr-2" />
                                    Suspend Student
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredAndSortedStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;