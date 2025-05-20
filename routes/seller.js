import express from 'express';
import { Add_product, Update_product, Delete_product, Get_product, Get_all_products } from '../controllers/seller.js';
import { auth,restrictTo,restrictToProductOwner } from '../middlewares/auth.js';
//import { restrictToProductOwner } from '../middlewares/productOwnership.js';

const router = express.Router(); 



router.use(auth ,restrictTo("seller"))
router.get('/' ,Get_all_products);
router.get('/:productId',restrictToProductOwner, Get_product); 
router.post('/', Add_product);
router.patch('/:productId',restrictToProductOwner, Update_product);
router.delete('/:productId',restrictToProductOwner, Delete_product);

export default router;