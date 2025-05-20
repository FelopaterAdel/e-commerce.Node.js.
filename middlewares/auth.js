import jwt from 'jsonwebtoken';
import Product from '../models/product.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in',
    });
  }

  try {
    const decoded = jwt.verify(authorization, process.env.SECRET);
    req.id = decoded.id;
    req.UserType = decoded.UserType;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized',
    });
  }
};

export const restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.UserType)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to access this route',
      });
    }
    next();
  };
};

export const restrictToProductOwner = async (req, res, next) => {
    try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this product',
      });
    }

    req.product = product;
    console.log("your product")
   next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: err.message,
    });
  }
};
