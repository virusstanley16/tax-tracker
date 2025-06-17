import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Business from '@/models/Business';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const business = await Business.findById(params.id);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const business = await Business.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const business = await Business.findByIdAndDelete(params.id);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
} 