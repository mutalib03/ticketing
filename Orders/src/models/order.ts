import { OrderStatus } from "@mutalibadetickets/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";



interface OrderAttrs {
 userId: string;
 status: OrderStatus;
 expiresAt: Date;
 ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
 userId: string;
 status: OrderStatus;
 expiresAt: Date;
  version: number;
 ticket: TicketDoc;
}  

interface OrderModel extends mongoose.Model<OrderDoc> {
build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true
   },
   status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
   },
  expiresAt: {
   type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket"
  },
   
},{
 toJSON: {
      transform(doc: any, ret: any) {
        const transformedRet = ret as any;

        transformedRet.id = transformedRet._id;
        delete transformedRet._id;
        delete transformedRet.password;
        delete transformedRet.__v;
      },
    },
})  

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin) 

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order" , orderSchema)
export {Order}