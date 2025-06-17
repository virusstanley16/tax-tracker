"use client";
import React from "react";
import { Flex, Button, TextField, Box, Text, TextArea } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Spinner } from "@radix-ui/themes";
import axios from "axios";

interface RegistrationForm {
  // Define any props if needed
  name: string;
  ownername: string;
  email: string;
  password: string;
  Address: string;
  phone_number: number;
  tax_type: string;
  amount: Float64Array;
  payment_date: Date;
  description: string;
}

const RegistrationPage = () => {
  const router = useRouter();
  // You can handle form submission here if needed
  const { register, handleSubmit } = useForm<RegistrationForm>();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  return (
    <>
      <Flex
        direction="column"
        gap="3"
        className="flex border-b-0 h-screen w-full py-2 max-w-2xl space-x-4 mb-1 "
      >
        <form
          action={"submit"}
          className="items-center flex flex-col space-y-4 justify-between w-full p-4"
          onSubmit={handleSubmit(async (data) => {
            setIsSubmitting(true);
            try {
              // Log the data to the console for debugging
              await axios.post("/api/register", data);
              router.push("/Dashboard");
            } catch (error) {
              console.error("Error submitting form:", error);
            } finally {
              setIsSubmitting(false);
            }
            // Handle form submission logic here
          })}
        >
          <Box maxWidth="80%" height={"50%"}>
            <Text className="text-bold">Name:</Text>
            <TextField.Root
              className="w-100"
              type="text"
              placeholder="Enter name of the business"
              {...register("name", { required: true })}
            ></TextField.Root>
            <Text>ownerName:</Text>
            <TextField.Root
              className="w-100"
              type="text"
              placeholder="Enter your name"
              {...register("ownername", { required: true })}
            ></TextField.Root>
            <Text>email:</Text>
            <TextField.Root
              className="w-100"
              type="email"
              placeholder="Enter your email address"
              {...register("email", { required: true })}
            ></TextField.Root>
            <Text>password:</Text>
            <TextField.Root
              className="w-100"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            ></TextField.Root>
            <Text>Address:</Text>
            <TextField.Root
              className="w-100"
              type="text"
              placeholder="where is your business located?"
              {...register("Address", { required: true })}
            ></TextField.Root>
            <Text>phone_Number:</Text>
            <TextField.Root
              className="w-100"
              type="number"
              placeholder="Enter your phone number"
              {...register("phone_number", { required: true })}
            ></TextField.Root>
            <Text>Tax_type:</Text>
            <TextField.Root
              className="w-100"
              type="text"
              placeholder="Enter the type of tax"
              {...register("tax_type", { required: true })}
            ></TextField.Root>
            <Text>Amount:</Text>
            <TextField.Root
              className="w-100"
              type="number"
              placeholder="Enter the amount to be paid"
              {...register("amount", { required: true })}
            ></TextField.Root>
            <Text>Payment_date:</Text>
            <TextField.Root
              className="space-x-7"
              type="date"
              placeholder="Enter the date of payment"
              {...register("payment_date", { required: true })}
            ></TextField.Root>
            <TextArea
              className="space-y-3"
              placeholder="Business description"
            ></TextArea>
          </Box>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-2xs transition-discrete"
          >
            Create New Account {isSubmitting && <Spinner />}
          </Button>
        </form>
      </Flex>
    </>
  );
};

export default RegistrationPage;
