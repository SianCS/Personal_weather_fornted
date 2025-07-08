import { object, ref, string } from "yup";

export const registerSchema = object({
  email: string().email("Email Worng").required("Put your Email"),
  password: string().min(6, "Need more than 6"),
  confirmPassword: string().required("This file cant not Empty").oneOf(
    [ref("password"), null],
    "Password not Match"
  ),
});

export const loginSchema = object({
  email: string().email("Email Worng").required("Put your Email"),
  password: string().min(6, "Need more than 6"),
});