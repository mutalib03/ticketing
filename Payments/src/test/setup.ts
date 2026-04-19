import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt  from "jsonwebtoken"; 


declare global {
  var signin: (id?: string) => Promise<string[]>;
}
jest.mock("../nats-wrapper")
 process.env.STRIPE_KEY = 'sk_test_51JSgFxAAsRFGiyZgfhvZ1osKVog5lfixCMZyd8wnkNtgRlgrGMnd6Y3krE3zAQv0p6x89xx3w4qlMPaoSg19mpYB00JhU0afsv'
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks()
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async (id?: string) => {  
  // Build a jwt payload
const payload = {
  id: id || new mongoose.Types.ObjectId().toHexString(),
  email:"test@test.com"
}

// Create the JWT
  const token = jwt.sign(payload , process.env.JWT_KEY!)

  // Build session Object. {jwt: MY_JWT}
  const session = {jwt:token} 

  
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64') 


    return [`session=${base64}`];
};
