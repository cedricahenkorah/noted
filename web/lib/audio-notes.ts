import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createAudioNote(data: { accessToken: string }) {
  try {
    const response = await axios.post(
      `${uri}/api/audio-notes/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to create audio note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create audio note. Try again later"
      );
    }
  }
}

export async function saveAudioNote(data: {
  id: string;
  title: string;
  url: string;
  recordingTime: number;
  accessToken: string;
}) {
  try {
    const audioNoteData = {
      title: data.title,
      url: data.url,
      recordingTime: data.recordingTime,
    };

    const response = await axios.patch(
      `${uri}/api/audio-notes/${data.id}`,
      audioNoteData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to save audio note. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to save audio note. Try again later"
      );
    }
  }
}

export async function fetchAudioNotes(data: {
  accessToken: string;
  page: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${uri}/api/audio-notes`, {
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
        response.data.message || "Failed to fetch audio notes. Try again later"
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch audio notes. Try again later"
      );
    }
  }
}
