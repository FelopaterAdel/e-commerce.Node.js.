import {catchAsync} from "../Utlites/wrapperFunction.js";
import Product from "../models/product.js"


export const getAllProducts = catchAsync(async (req, res, next) => {   
let product = await productModel.find()
    res.status(200).json({
        status: "success",
        data: product,
    });})

export const searchForProduct = catchAsync(async (req, res, next) => {   
 const { id } = req.params;
    let product = await Product.findOne({ _id: id });

    if (product) {
        res.status(200).json({
            status: "success",
            data: product,
            
        });
    } else {
        next(AppError(404,"product not found"))
       
    }})
