import loginUser from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { collectionNamesObj, dbConnect } from "./dbconnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          const user = await loginUser(credentials);
          
          if (user) {
            return {
              id: user.id, // Make sure this is a valid MongoDB ObjectId string
              email: user.email,
              name: user.name,
              role: user.role
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authentication failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      if (account?.provider === "google") {
        const { providerAccountId, provider } = account;
        const { email, image, name } = user;

        try {
          const userCollection = await dbConnect(collectionNamesObj.userCollection);
          const isExisted = await userCollection.findOne({ providerAccountId });

          if (!isExisted) {
            const payload = {
              providerAccountId,
              provider,
              email,
              image,
              name,
              role: "customer",
              createdAt: new Date(),
            };
            const result = await userCollection.insertOne(payload);
            
            // Update the user object with the MongoDB _id
            user.id = result.insertedId.toString();
          } else {
            // Use the existing user's _id
            user.id = isExisted._id.toString();
          }
        } catch (error) {
          console.error("Error handling Google sign-in:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "customer";
        token.id = user.id; // Make sure this is set
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.id = token.id; // Make sure this is set
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};