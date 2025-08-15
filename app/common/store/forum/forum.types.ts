export interface ITopic {
  id: number;
  title: string;
  slug: string;
  content: string;
  userId: number;
  categoryId?: string;
  forumId: string;
  status: string;
  isPinned: boolean;
  isLocked: boolean;
  isSticky: boolean;
  viewCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  lastReplyAt?: string;
  lastReplyBy?: string;
  tags: string[];
  user: {
    id: number;
    username: string;
    profileImage: string;
  };
  forum: {
    id: string;
    title: string;
    description?: string;
    category?: string;
  };
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  _count: {
    posts: number;
  };
}

export interface IForum {
  id: string;
  title: string;
  description?: string;
  category?: string;
  isActive: boolean;
  topicCount?: number;
  topics?: ITopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IForumCreate {
  title: string;
  description?: string;
  category?: string;
  isActive: boolean;
}

export interface IForumUpdate {
  title?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface ITopicCreate {
  title: string;
  content: string;
  author?: string;
  authorAvatar?: string;
}

export interface ITopicUpdate {
  title?: string;
  content?: string;
}

export interface IReply {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  isModerated?: boolean;
}

export interface IReplyCreate {
  content: string;
  author?: string;
  authorAvatar?: string;
}

export interface IReplyUpdate {
  content?: string;
}
