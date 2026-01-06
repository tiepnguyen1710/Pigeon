import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import {
    login as apiLogin,
    logout as apiLogout,
    getProfile,
    refreshToken,
    type User,
} from '@/api/auth';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    });
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!accessToken;

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (savedToken) {
                try {
                    // Verify token by getting profile
                    const profile = await getProfile(savedToken);
                    setUser({
                        id: profile.id,
                        username: profile.username,
                        email: profile.email,
                        role: 'user',
                    });
                    setAccessToken(savedToken);
                } catch {
                    // Token expired, try to refresh
                    if (savedRefreshToken) {
                        try {
                            await handleRefreshToken(savedRefreshToken);
                        } catch {
                            // Refresh failed, clear auth
                            clearAuth();
                        }
                    } else {
                        clearAuth();
                    }
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleRefreshToken = async (refresh_token: string) => {
        const response = await refreshToken(refresh_token);
        setAccessToken(response.access_token);
        setUser(response.user);
        localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    };

    const clearAuth = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    const login = async (email: string, password: string) => {
        const response = await apiLogin(email, password);
        setAccessToken(response.access_token);
        setUser(response.user);
        localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    };

    const logout = async () => {
        if (accessToken) {
            try {
                await apiLogout(accessToken);
            } catch (error) {
                console.error('Logout API failed:', error);
            }
        }
        clearAuth();
    };

    const refreshAuth = async () => {
        const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (savedRefreshToken) {
            await handleRefreshToken(savedRefreshToken);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoading,
                isAuthenticated,
                login,
                logout,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
