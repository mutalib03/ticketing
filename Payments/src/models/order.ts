import { OrderStatus } from "@mutalibadetickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface OrderAttrs {
    id: string;
    price: number;
    status: OrderStatus;
    userId: string;
    version: number;
} 

interface OrderDoc extends mongoose.Document {
    price: number;
    status: string;
    userId: string;
    version: number;
}  

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}  

const orderSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },

}, {
    toJSON: {
        transform(doc:any, ret:any) {
            ret.id = ret._id;
            delete ret._id;
        }
}
});


orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        price: attrs.price,
        status: attrs.status,
        userId: attrs.userId,
        version: attrs.version
    });
}  


export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);