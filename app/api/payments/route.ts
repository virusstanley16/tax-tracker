import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find({})
      .populate('business', 'name registrationNumber')
      .populate('tax', 'name rate')
      .sort({ createdAt: -1 });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const payment = await Payment.create(data);
    const populatedPayment = await Payment.findById(payment._id)
      .populate('business', 'name registrationNumber')
      .populate('tax', 'name rate');
    return NextResponse.json(populatedPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 