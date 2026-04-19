import { ExpirationCompleteEvent, Publisher, Subjects } from "@mutalibadetickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete  = Subjects.ExpirationComplete  
}