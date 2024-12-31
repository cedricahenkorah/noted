import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function emailSignUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${uri}/api/auth/email-signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Sign up failed. Try again later."
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Sign up failed. Try again later."
      );
    }
  }
}
