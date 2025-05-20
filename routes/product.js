import express from 'express';
import {getAllProducts, searchForProduct} from '../controllers/product.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/' ,getAllProducts);
router.get('/:id',auth, searchForProduct);

export default router;