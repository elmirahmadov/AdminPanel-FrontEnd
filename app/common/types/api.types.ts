// ======== Admin Types ========//
export interface IAdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  created_at: string;
}

// ======== Auth Types ========//
export interface IAuthProfile {
  id: string;
  name: string;
  role: string; // role doğrudan burada
  phone?: string;
  email?: string;
  data: string; // data bir string, obje değil
}

export interface ILogin {
  phone: string;
  password: string;
}

export interface ILoginResponse {
  user: IAuthProfile;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

// ======== Campaign Types ========//
export interface ICampaign {
  id: number;
  title: string;
  description?: string;
  img_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICampaignCreate {
  title: string;
  description?: string;
  img_url?: string;
}

export interface ICampaignUpdate {
  title?: string;
  description?: string;
  img_url?: string;
}

// ======== Category Types ========//
export interface ICategory {
  id: number;
  name: string;
  description?: string;
  img_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: boolean;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
  img_url?: string;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
  img_url?: string;
}

// ======== Product Types ========//

export enum ProductMeasure {
  KG = "kg",
  GR = "gr",
  LITRE = "litr",
  ML = "ml",
  METER = "metr",
  CM = "cm",
  MM = "mm",
  PIECE = "əd",
  PACKET = "paket",
  BOX = "qutu",
}

export interface IProduct {
  id: number;
  title: string;
  description?: string;
  price: string;
  type: ProductMeasure;
  img_url?: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  status?: boolean;
}

export interface IProductCreate {
  title: string;
  description?: string;
  price: string;
  type: ProductMeasure;
  img_url?: string;
  category_id: number;
}

export interface IProductUpdate {
  title?: string;
  description?: string;
  price?: string;
  type?: ProductMeasure;
  img_url?: string;
  category_id?: number;
}

// ======== Order Types ========//
export interface IOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  delivery_phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IOrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export interface IOrderStatusUpdate {
  status: string;
  notes?: string;
}

// ======== Upload Types ========//

export interface IUploadResponse {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicUrl?: string;
  uploadedAt: string;
  path?: string;
}

// ======== Dashboard Types ========//
export interface IDashboardLog {
  id: string;
  type: string; // ör: 'login', 'update', 'delete', 'error', ...
  message: string;
  user?: string; // işlemi yapan kullanıcı adı/id
  createdAt: string; // ISO tarih
}

export interface IDashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalAnimes: number;
  totalComments: number;
  totalReports: number;
  totalViews: number;
  pendingReports: number;
  lastUpdated: string;
  // Legacy fields for backward compatibility
  userCount?: number;
  animeCount?: number;
  watchCount?: number;
  commentCount?: number;
  favoriteCount?: number;
  reportCount?: number;
  activeBadges?: number;
  activeTasks?: number;
  averageFavoritesPerCharacter?: number;
  totalAwards?: number;
  totalBadges?: number;
  totalCharacters?: number;
  totalCompletions?: number;
  totalFavorites?: number;
  totalTasks?: number;
  uniqueUsersWithBadges?: number;
  uniqueUsersWithCompletions?: number;
}
