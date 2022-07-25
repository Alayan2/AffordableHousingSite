export interface Menu {
  path: string;
  name: string;
}

export const menuList: Menu[] = [
  {
    path: '/search',
    name: 'Search'
  },
  {
    path: '/about',
    name: 'About'
  },
  {
    path: '/contact',
    name: 'Contact'
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard'
  // }
];
