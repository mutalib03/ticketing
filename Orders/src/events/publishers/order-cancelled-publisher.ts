import { OrderCancelledEvent, Publisher, Subjects } from "@mutalibadetickets/common";



export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled =Subjects.OrderCancelled
}