import {
  AlertTriangle,
  BarChart3,
  Bell,
  Globe,
  Network,
  Radio,
  Settings,
  Sparkles,
  Target,
  UserCircle,
  Users,
} from 'lucide-react';
import { MenuConfig } from '@/config/types';

export const ZEITGEIST_SIDEBAR: MenuConfig = [
  {
    title: 'Briefing',
    icon: BarChart3,
    path: '/briefing',
  },
  {
    title: 'Map',
    icon: Globe,
    path: '/map',
  },
  {
    title: 'Events',
    icon: Radio,
    path: '/events',
  },
  {
    title: 'Risk',
    icon: AlertTriangle,
    path: '/risk',
  },
  {
    title: 'Theater',
    icon: Target,
    path: '/theater',
  },
  {
    title: 'Alerts',
    icon: Bell,
    path: '/alerts',
  },
  {
    title: 'Simulations',
    icon: Users,
    path: '/simulations',
  },
  {
    title: 'Agents',
    icon: UserCircle,
    path: '/agents',
  },
  {
    title: 'Predictions',
    icon: Sparkles,
    path: '/predictions',
  },
  {
    title: 'Knowledge Graph',
    icon: Network,
    path: '/graph',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];
