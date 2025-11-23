import GamePage from './pages/GamePage';
import HowToPlayPage from './pages/HowToPlayPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'GLITCHGUESS',
    path: '/',
    element: <GamePage />
  },
  {
    name: 'How to Play',
    path: '/how-to-play',
    element: <HowToPlayPage />
  },
  {
    name: 'Admin Login',
    path: '/lokka',
    element: <AdminLoginPage />,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/lokka/dashboard',
    element: <AdminDashboardPage />,
    visible: false
  }
];

export default routes;