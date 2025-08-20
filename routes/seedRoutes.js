import express from 'express';
import {
	seedUsers,
	seedVehicles,
	seedDrivers,
	clearNonUserDataController
} from '../controller/seedController.js';

const router = express.Router();

router.get('/seed-users', seedUsers);
router.get('/seed-vehicles', seedVehicles);
router.get('/seed-drivers', seedDrivers);
router.get('/clear-non-user-data', clearNonUserDataController);

export default router;