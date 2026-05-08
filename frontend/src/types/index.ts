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
    images: string[];
    mainImageIndex: number; // Dodano pole do wyboru zdjęcia głównego
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
