import { Listener, OrderCreatedEvent, Subjects } from "@mutalibadetickets/common";
import { queueGroupname } from "../queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupname;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`[Publisher] Adding job to queue. It should process in ${delay} in miliseconds & ${delay / 1000} seconds...`);

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay
        });

        msg.ack();
    }
} 