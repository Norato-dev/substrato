export type Role = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  _count?: { posts: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any;
  coverImage?: string;
  status: PostStatus;
  publishedAt?: string;
  readTime?: number;
  views: number;
  featured: boolean;
  author: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  category: Category;
  tags: { tag: Tag }[];
  _count?: { comments: number; reactions: number };
  createdAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}