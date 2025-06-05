import { NextResponse } from 'next/server';

export async function GET() {
  // Log all environment variables that start with NEXT_PUBLIC
  const publicEnvVars = Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_PUBLIC_'))
    .reduce((obj, key) => {
      obj[key] = process.env[key] ? 'SET' : 'NOT SET';
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    envVars: publicEnvVars,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
  });
} 