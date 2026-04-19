import { Publisher, Subjects, TicketCreatedEvent } from "@mutalibadetickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
     subject: Subjects.TicketCreated = Subjects.TicketCreated
} 