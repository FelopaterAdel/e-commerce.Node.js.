import { catchAsync } from "../Utlites/wrapperFunction.js";
import productModel from "../models/product.js"


export const Add_product = catchAsync(async (req, res, next) => {
    let newProduct = req.body;

    const product = await productModel.create(newProduct);

    res.status(201).json({
        status: "success",
        message: "saved successfully",
        data: product,

    });
});


export const Update_product = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const updateData = req.body;

    let product = await productModel.findOneAndUpdate({ _id: productId }, { $set: updateData }, { new: true, runValidators: true });

    if (product) {
        res.status(200).json({
            status: "Update success",
            data: product,
        });
    } else {
        res.status(404).json({
            status: "failed",
            message: "Product not found",
        });
    }



});

export const Delete_product = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    let product = await productModel.findOneAndDelete({ _id: productId });

    if (product) {
        res.status(200).json({
            status: "delete success",
            data: todo,
        });
    } else {
        res.status(404).json({
            status: "failed",
            message: "product not found",
        });
    }
});

export const Get_product = catchAsync(async (req, res, next) => {

   const { productId } = req.params;
    let product = await productModel.findOne({ _id: productId });

    if (product) {
        res.status(200).json({
            status: "success",
            data: product,
            
        });
    } else {
        next(AppError(404,"product not found"))
       
    }})

export const Get_all_products = catchAsync(async (req, res, next) => {
   let product = await productModel.find()
    res.status(200).json({
        status: "success",
        data: product,
    });})