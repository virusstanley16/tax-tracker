import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Business from '@/models/Business';

export async function GET() {
  try {
    await connectDB();
    const businesses = await Business.find({}).sort({ createdAt: -1 });
    return NextResponse.json(businesses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const business = await Business.create(data);
    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
} 