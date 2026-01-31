import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const authHeader = req.headers.get('authorization');
    let user: UserPayload | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        user = jwt.verify(token, JWT_SECRET) as UserPayload;
      } catch {
        // Invalid token
      }
    }

    return { user };
  },
});

export { handler as GET, handler as POST };
