import useSWR, { mutate } from "swr";

import { Attendance } from "./attendance";
import { fetcher } from "./fetcher";
import { useState } from "react";

export function useAttendances(
  userId: string | undefined,
  year: number,
  month: number
): { attendances?: Attendance[]; isLoading: boolean; isError: any } {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/api/${userId}/attendances?code=${process.env.REACT_APP_API_KEY}&clientId=attendance-taking-app&year=${year}&month=${month}`;
  const { data, error } = useSWR<
    { id: string; occurredAt: string; type: number }[]
  >(userId ? endpoint : null, fetcher);
  const attendances = data?.map(
    (attendance) =>
      new Attendance(
        attendance.id,
        new Date(attendance.occurredAt),
        attendance.type
      )
  );
  return {
    attendances,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDeleteAttendance(): {
  deleteAttendance: (
    userId: string | undefined,
    attendance: Attendance
  ) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteAttendance = async (
    userId: string | undefined,
    attendance: Attendance
  ) => {
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/api/${userId}/attendance/${attendance.id}?code=${process.env.REACT_APP_API_KEY}`;
    try {
      await fetch(endpoint, {
        method: "DELETE",
      });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      mutate(
        `${process.env.REACT_APP_API_ENDPOINT}/api/${userId}/attendances?code=${
          process.env.REACT_APP_API_KEY
        }&clientId=attendance-taking-app&year=${attendance.occurredAt.getFullYear()}&month=${
          attendance.occurredAt.getMonth() + 1
        }`
      );
    }
  };
  return { deleteAttendance, loading, error };
}
