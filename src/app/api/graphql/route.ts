import { ApolloServer } from '@apollo/server';
import { NextRequest, NextResponse } from 'next/server';
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

// Start the server once
const serverStartPromise = server.start();
let serverStarted = false;

async function getContext(req: NextRequest) {
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
}

async function handleRequest(req: NextRequest): Promise<NextResponse> {
  if (!serverStarted) {
    await serverStartPromise;
    serverStarted = true;
  }

  const context = await getContext(req);
  
  if (req.method === 'GET') {
    // Return a simple response for GET requests (health check)
    return NextResponse.json({ status: 'ok', message: 'GraphQL server is running' });
  }

  // Handle POST request
  const body = await req.json();
  
  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
      operationName: body.operationName,
    },
    { contextValue: context }
  );

  if (response.body.kind === 'single') {
    return NextResponse.json(response.body.singleResult);
  }

  return NextResponse.json({ errors: [{ message: 'Unexpected response type' }] });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleRequest(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleRequest(req);
}
