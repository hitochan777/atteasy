import useSWR from "swr";

import { Attendance } from "./attendance";
import { fetcher } from "./fetcher";

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
