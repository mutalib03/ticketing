import { Listener, PaymentCreatedEvent, OrderStatus, Subjects } from "@mutalibadetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;  


    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
       const order = await Order.findById(data.orderId);

         if (!order) throw new Error("Order not found");
         console.log("Order found: ", order)
         order.set({ status: OrderStatus.Complete });
         await order.save();

            msg.ack();
    }
}