export interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  unit?: string;
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  active?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface ChartConfig {
  type: "line" | "bar" | "pie" | "doughnut";
  data: ChartData;
  options?: any;
}

export interface ProgressData {
  label: string;
  value: number;
  max: number;
  color: string;
}

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

export interface LayoutState {
  sidebar: SidebarState;
  isMobile: boolean;
}

// Authentication interfaces
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
    model: string;
  };
  message?: string;
}

export interface ImageRequest {
  prompt: string;
  width?: number;
  height?: number;
}

export interface ImageResponse {
  success: boolean;
  data?: {
    imageBase64?: string;
    imageUrl?: string;
    provider: string;
  };
  message?: string;
}

export interface AdminStats {
  users: {
    total: number;
    newThisMonth: number;
    admins: number;
  };
  chats: {
    total: number;
    today: number;
    avgMessagesPerChat: number;
  };
  images: {
    total: number;
    today: number;
    safetyRejections: number;
  };
  apiUsage: {
    totalCalls: number;
    avgLatency: number;
    errorRate: number;
    byEndpoint: Record<string, number>;
  };
  providers: Record<string, number>;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface AdminChat {
  _id: string;
  userId: { name: string; email: string };
  title: string;
  aiModel: string;
  messageCount: number;
  createdAt: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}
