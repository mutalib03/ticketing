import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttrs {
  title:string;
  price:number;
  userId: string; 
}


interface TicketDoc extends mongoose.Document {
  title:string;
  price:number;
  userId: string; 
  version: number  
  orderId?:string
}


interface TicketsModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc   
} 

const ticketSchema = new mongoose.Schema({
  title: {
  type: String,
  required: true
  },
   price: {
  type: Number,
  required: true
  },
 userId: {
    type: String,
    required:true
 },
  orderId: {
    type: String,
  }
},
  {
   toJSON: {
      transform(doc, ret) {
        const transformedRet = ret as any;

        transformedRet.id = transformedRet._id;
        delete transformedRet._id;
        delete transformedRet.password;
        delete transformedRet.__v;
      },
    },
  }

)
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin) 



ticketSchema.statics.build = (attr: TicketAttrs) => {
    return new Ticket(attr)
}

const Ticket = mongoose.model<TicketDoc, TicketsModel>('Ticket', ticketSchema) 

export {Ticket}