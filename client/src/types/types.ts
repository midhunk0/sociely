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