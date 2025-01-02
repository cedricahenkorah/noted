import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createNote(data: { author: string }) {
  try {
    const response = await axios.post(`${uri}/api/notes/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to create note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create note. Try again later"
      );
    }
  }
}

export async function saveNote(data: {
  id: string;
  title: string;
  content: string;
  tags: string[];
}) {
  try {
    const response = await axios.patch(`${uri}/api/notes/${data.id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to save note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to save note. Try again later"
      );
    }
  }
}

export async function fetchNote(data: { id: string }) {
  try {
    const response = await axios.get(`${uri}/api/notes/${data.id}`);

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to fetch note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch note. Try again later"
      );
    }
  }
}
