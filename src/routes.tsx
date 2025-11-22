import GamePage from './pages/GamePage';
import HowToPlayPage from './pages/HowToPlayPage';
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
  }
];

export default routes;