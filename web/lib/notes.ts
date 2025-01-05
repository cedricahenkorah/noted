import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createNote(data: { accessToken: string }) {
  try {
    const response = await axios.post(
      `${uri}/api/notes/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }
    );

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
  accessToken: string;
}) {
  try {
    const noteData = {
      title: data.title,
      content: data.content,
      tags: data.tags,
    };

    const response = await axios.patch(
      `${uri}/api/notes/${data.id}`,
      noteData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      }
    );

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

export async function fetchNote(data: { id: string; accessToken: string }) {
  try {
    const response = await axios.get(`${uri}/api/notes/${data.id}`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

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

export async function fetchNotes(data: {
  accessToken: string;
  page: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${uri}/api/notes`, {
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
        response.data.message || "Failed to fetch notes. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch notes. Try again later"
      );
    }
  }
}

export async function deleteNote(data: { id: string; accessToken: string }) {
  try {
    const response = await axios.delete(`${uri}/api/notes/${data.id}`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to delete note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete note. Try again later"
      );
    }
  }
}
