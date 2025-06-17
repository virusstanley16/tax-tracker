import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tax from '@/models/Tax';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const tax = await Tax.findById(params.id);
    if (!tax) {
      return NextResponse.json(
        { error: 'Tax not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(tax);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tax' },
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
    const tax = await Tax.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!tax) {
      return NextResponse.json(
        { error: 'Tax not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(tax);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tax' },
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
    const tax = await Tax.findByIdAndDelete(params.id);
    if (!tax) {
      return NextResponse.json(
        { error: 'Tax not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Tax deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete tax' },
      { status: 500 }
    );
  }
} 