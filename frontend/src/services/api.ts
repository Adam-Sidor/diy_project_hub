const BASE_URL = 'http://localhost:8080/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Wystąpił błąd podczas komunikacji z serwerem');
    }

    return response.json();
};

// Specjalna funkcja do przesyłania plików (FormData nie potrzebuje Content-Type JSON)
export const apiUpload = async (endpoint: string, formData: FormData, method: string = 'POST') => {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {};
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        body: formData,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Błąd podczas przesyłania pliku');
    }

    return response.json();
};
