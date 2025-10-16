"use client";

import InputField from "@/components/forms/InputField";
import React from "react";
import { useForm } from "react-hook-form";

const SignUp: () => React.JSX.Element = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onBlur",
  });
  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <h1 className="form-title">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField />
        <button type="submit" disabled={isSubmitting} className="w-full mt-5">
          {isSubmitting ? "Creating account" : "Create account"}
        </button>
      </form>
    </>
  );
};

export default SignUp;
