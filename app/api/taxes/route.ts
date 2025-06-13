import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tax from '@/models/Tax';

export async function GET() {
  try {
    await connectDB();
    const taxes = await Tax.find({}).sort({ createdAt: -1 });
    return NextResponse.json(taxes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch taxes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const tax = await Tax.create(data);
    return NextResponse.json(tax, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tax' },
      { status: 500 }
    );
  }
} 