import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchNotebooks(data: {
  accessToken: string;
  page: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${uri}/api/notebooks`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
      params: {
        page: data.page,
        limit: data?.limit,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to fetch notebooks. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch notebooks. Try again later"
      );
    }
  }
}

export async function createNotebook(data: {
  title: string;
  description: string;
  accessToken: string;
}) {
  try {
    const notebookData = {
      title: data.title,
      description: data.description,
    };

    const response = await axios.post(`${uri}/api/notebooks/`, notebookData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to create notebook. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create notebook. Try again later"
      );
    }
  }
}
