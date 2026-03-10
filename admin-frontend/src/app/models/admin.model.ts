export interface Admin {
  adminId?: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  role?: string;
  permissions?: string;
  isActive?: boolean;
  password?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  message: string;
}

export interface AdminStats {
  totalAdmins: number;
  activeAdmins: number;
}