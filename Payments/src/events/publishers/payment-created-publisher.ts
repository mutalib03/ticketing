import { PaymentCreatedEvent, Publisher, Subjects } from "@mutalibadetickets/common";



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}