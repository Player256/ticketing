import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@sgtickets/common";

import { stripe } from "../stripe";

const router = express.Router();

router.post("/api/payments",
requireAuth,
[
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
     
],
async (req:Request, res:Response) => {
  
    const {token , orderId } = req.body;

    const order = await Order.findById(orderId);

    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    if(order.userId === OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for cancelled order');
    }

    await stripe.charges.create({
        currency : 'usd',
        amount : order.price * 100,
        source : token
    })

});

export {router as createChargeRouter};