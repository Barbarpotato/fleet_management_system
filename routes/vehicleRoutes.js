import express from 'express';
import {
	getAllVehiclesController,
	createVehicleController,
	postVehicleController
} from '../controller/vehicleController.js';

const router = express.Router();

router.get('/', getAllVehiclesController);
router.get('/create', createVehicleController);
router.post('/', postVehicleController);

export default router;
