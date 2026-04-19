import  request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { response } from 'express';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';


it ("returns a 404 if the provided id does not exist" , async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).put(`/api/tickets/${id}`)
   .set("Cookie" , await global.signin())
    .send({title: 'asldfk', price:20})
})

it ("returns a 401 user is not authenticated" , async () => {
     const id = new mongoose.Types.ObjectId().toHexString()
     await request(app).put(`/api/tickets/${id}`)
     .send({title: 'asldfk', price:20}).expect(401) 
})


it ("returns a 401 if user does not own the ticket" , async () => {
     
    const response =   await request(app).post(`/api/tickets`)
     .set("Cookie" , await global.signin())
     .send({title: 'asldfk', price:20}) 


 await request(app).put(`/api/tickets/${response.body.id}`)
     .set("Cookie" , await global.signin())
     .send({title: 'asldfk', price:2000}).expect(401) 

}) 

it ("returns a 400 if user provides an invalid title or price" , async () => {
 const cookie = await global.signin() 

 const response =  await request(app).post(`/api/tickets`)
   .set("Cookie" , cookie)
    .send({title: 'asldfk', price:20}) 

  await request(app).put(`/api/tickets/${response.body.id}`)
   .set("Cookie" , cookie)
    .send({title: 'asldfk', price:-100}).expect(400) 


})

it ("its update the ticket provided valid" , async () => {
  const cookie = await global.signin() 

 const response =  await request(app).post(`/api/tickets`)
   .set("Cookie" , cookie)
    .send({title: 'asldfk', price:20})   

   await request(app).put(`/api/tickets/${response.body.id}`)
   .set("Cookie" , cookie)
    .send({title: 'New Title', price:400})  
    
    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

    expect(ticketResponse.body.title).toEqual('New Title')
    expect(ticketResponse.body.price).toEqual(400)
  

})


it ('publishes an event', async () => {
  const cookie = await global.signin() 

 const response =  await request(app).post(`/api/tickets`)
   .set("Cookie" , cookie)
    .send({title: 'asldfk', price:20})   

   await request(app).put(`/api/tickets/${response.body.id}`)
   .set("Cookie" , cookie)
    .send({title: 'new title', price:400}) 


 expect(natsWrapper.client.publish).toHaveBeenCalled()
})  

it('rejects updates if the ticket is reserved', async () => {
   const orderId = new mongoose.Types.ObjectId().toHexString()
    const cookie = await global.signin() 

 const response =  await request(app).post(`/api/tickets`)
   .set("Cookie" , cookie)
    .send({title: 'asldfk', price:20})   


    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({orderId})
    await ticket!.save()

   await request(app).put(`/api/tickets/${response.body.id}`)
   .set("Cookie" , cookie)
   .send({title: 'wukskkks', price:2900}).expect(400)   


})