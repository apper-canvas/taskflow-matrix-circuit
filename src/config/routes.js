import HomePage from '@/components/pages/HomePage';
import ArchivePage from '@/components/pages/ArchivePage';

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: HomePage
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
component: ArchivePage
  }
};

export const routeArray = Object.values(routes);