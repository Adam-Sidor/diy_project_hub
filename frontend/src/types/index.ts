export interface User {
    _id: string;
    username: string;
    email: string;
    token?: string;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    components: string[];
    author: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

export interface Comment {
    _id: string;
    project: string;
    user: string;
    authorName: string;
    content: string;
    createdAt: string;
}
