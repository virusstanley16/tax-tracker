import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
// import { createRegisterSchema } from "@/validationSchema"; // Import the validation schema
import prisma from "@/prisma/client";
// Import the Prisma client instance


const createRegisterSchema = z.object({
  name: z.string().min(1, 'name is required').max(255),
  owner_name: z.string().min(1, 'ownername is required').max(255),
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(8, 'password must be at least 8 characters').max(255),
  address: z.string().min(1).max(255),
  phone: z.string().min(10, 'phone_number is required').max(20), // Assuming phone number is 10 digits
  tax_type: z.string().min(1).max(255),
 payment_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: "Invalid date format",
})
  .transform((date) => new Date(date)),
  amount_due: z.string().refine((val) => !isNaN(Number(val)), {
  message: "Invalid amount format",
})
  .transform((val) => parseFloat(val)),
  description: z.string().min(20).max(500),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createRegisterSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
    console.log("validation error:");
  }
  console.log('====================================');
  console.log("validation success:", validation.data);
  console.log('====================================');
  // If validation passes, proceed to create the register entry
  // Assuming you have a Prisma client instance set up
  const newRegister = await prisma.register.create ({
    data: {
      name: body.Name,
      ownerName: body.ownerName,
      email: body.email, // Assuming email is part of the request body
      password: body.password, // Assuming password is part of the request body
      address: body.Address,
      phone: body.phone_Number,
      tax_type: body.tax_type,
      payment_date: new Date(body.payment_date),
      amount_due: body.Amount,
      description: body.Description,
    },
  });
  // Return the newly created register entry
  return NextResponse.json(newRegister, { status: 201 });
}
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request body:", req.body);
  if (req.method === "POST") {
    try {
      const body = req.body;
      const validation = createRegisterSchema.safeParse(body);
      if (!validation.success) {
        return res.status(400).json(validation.error.format());
      }
      // If validation passes, proceed to create the register entry
      const newRegister = await prisma.register.create({
        data: {
          name: body.Name,
          owner_name: body.ownerName,
          address: body.Address,
          phone: body.phone_Number,
          tax_type: body.tax_type,
          amount_due: body.Amount,
          payment_date: new Date(body.payment_date),
          description: body.Description,
        },
      });
      // Return the newly created register entry
      return res.status(201).json(newRegister);
    } catch (error) {
      console.error("Error creating register entry:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
