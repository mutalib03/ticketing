import { Publisher, Subjects, TicketUpdatedEvent } from "@mutalibadetickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
     subject: Subjects.TicketUpdated = Subjects.TicketUpdated
} 