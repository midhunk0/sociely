export interface UserRef{
    userId: string;
    createdAt: string;
    updatedAt: string;
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