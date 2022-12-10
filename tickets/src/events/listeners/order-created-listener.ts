import { Listener, OrderCreatedEvent, Subjects } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";
import { TicketUpdatedPublisher } from "../publishers/tickets-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket , throw an error
    if (!ticket) {
      throw new Error("Tikcet not found");
    }

    //mark the ticket as reserved by setting its orderid property
    ticket.set({ orderId: data.id });

    // save the ticket and ack the message
    await ticket.save();

   await new TicketUpdatedPublisher(this.client).publish({
        id : ticket.id, 
        price : ticket.price,
        title : ticket.title,
        userId : ticket.userId,
        orderId : ticket.orderId, 
        version : ticket.version
    });

    msg.ack();
  }
}
