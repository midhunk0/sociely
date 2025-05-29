export interface UserRef{
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatRef{
    members: UserRef[]
}

export interface UserType{
    name?: string;
    username?: string;
    email?: string;
    followers?: UserRef[];
    followings?: UserRef[];
    posts?: string[];
    _id?: string;
}

export interface VerificationType{
    email: string;
    otp: string;
}

export interface RegisterDataType{
    name: string,
    username: string,
    email: string,
    password: string
}

export interface LoginDataType{
    credential: string,
    password: string
}

export interface UpdateUserType{
    name?: string;
    username?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
}

export interface PostType{
    title: string;
    description: string;
}

export interface CommentType{
    _id: string;
    userId: string;
    comment: string;
    replies: CommentType[];
    createdAt: string;
    updatedAt: string;
}

export interface FetchedPostType{
    _id: string;
    userId: string;
    title: string;
    description: string;
    imageUrls: string[];
    likesCount: number;
    likes: UserRef[];
    comments: CommentType[];
    createdAt: string;
    updatedAt: string;
}

export interface MessageType{
    chatId: string,
    senderId: string,
    message: string,
    timestamp?: Date
}
