import { Router } from 'express';
// import { UserRoutes } from '../modules/user/user.route';
// import { MedicineRoutes } from '../modules/medicine/medicine.route';

const router = Router();


type TModuleRoute = {
  path: string;
  route: Router;
};

const moduleRoutes: TModuleRoute[] = [
  {
    path: '/users',
    route: Router(), 
  },
  /* {
    path: '/medicines',
    route: MedicineRoutes,
  },
  */
];

// Dynamically register all routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;