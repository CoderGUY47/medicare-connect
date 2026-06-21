// OAuth social login configs
// Better Auth database client setup
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("medi-doc");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword:{
    enabled: true,
    minPasswordLength: 4,
  },
  socialProviders:{
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    }
  },
  session:{
    cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, //7 days
    }
  },
  plugins:[
    jwt(),
  ]
});