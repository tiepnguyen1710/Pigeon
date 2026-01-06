import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Loader2,
    Sparkles,
    Circle
} from 'lucide-react';

export default function Home() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-zinc-500 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-zinc-100">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col text-white">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Pigeon
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    <a
                        href="#"
                        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white font-medium transition-all"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span>Chats</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <Users className="w-5 h-5" />
                        <span>Contacts</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </a>
                </nav>

                {/* Footer - User Profile */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                Online
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/25">
                        <Sparkles className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-bold text-zinc-800 mb-3">
                        Welcome to Pigeon Chat!
                    </h1>
                    <p className="text-lg text-zinc-600 mb-2">
                        Hello, <span className="text-blue-500 font-semibold">{user?.username}</span>! 👋
                    </p>
                    <p className="text-zinc-500 mb-8">
                        Select a conversation from the sidebar to start chatting, or create a new one.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-zinc-800">0</p>
                                <p className="text-xs text-zinc-500">Messages</p>
                            </div>
                        </Card>

                        <Card className="p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-zinc-800">0</p>
                                <p className="text-xs text-zinc-500">Friends</p>
                            </div>
                        </Card>

                        <Card className="p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center text-green-500">
                                <Circle className="w-6 h-6 fill-current" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-zinc-800">Online</p>
                                <p className="text-xs text-zinc-500">Status</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
