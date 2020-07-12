import React, { useMemo } from "react";
import useSWR from "swr";
import { Table } from "semantic-ui-react";
import { Attendance, AttendanceType } from "./attendance";

const fetcher = (endpoint: string, ...args: any[]) =>
  fetch(endpoint, ...args).then((res) => res.json());

function getTimePart(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function useAttendances(
  year: number,
  month: number
): { attendances?: Attendance[]; isLoading: boolean; isError: any } {
  const endpoint = `${process.env.REACT_APP_API_ENDPOINT}/api/GetAttendances?code=${process.env.REACT_APP_API_KEY}&clientId=attendance-taking-app`;
  const { data, error } = useSWR<
    { id: string; occurredAt: string; type: number }[]
  >(endpoint, fetcher);
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

export function HistoryPage() {
  const now = new Date();
  const { attendances, isLoading } = useAttendances(
    now.getFullYear(),
    now.getMonth() + 1
  );

  const groupedAttendances = useMemo(() => {
    if (!attendances) {
      return [];
    }
    const sortedAttendances = attendances.sort(
      (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()
    );
    const groupedAttendances = sortedAttendances.reduce<{
      [key: string]: Attendance[];
    }>((prev, cur) => {
      const groupValue = cur.occurredAt.getDate();
      if (!(groupValue in prev)) {
        prev[groupValue] = [];
      }
      prev[groupValue].push(cur);
      return prev;
    }, {});
    return Object.entries(groupedAttendances);
  }, [attendances]);

  if (isLoading) {
    return <span>Loading the page...</span>;
  }

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>日にち</Table.HeaderCell>
          <Table.HeaderCell>First Enter</Table.HeaderCell>
          <Table.HeaderCell>Last Leave</Table.HeaderCell>
          <Table.HeaderCell>詳細</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {groupedAttendances.map((group) => {
          const [day, attendances] = group;
          const firstArrival = attendances.find(
            (attendance) => attendance.type === AttendanceType.Arrive
          );
          const lastLeave = attendances
            .reverse()
            .find((attendance) => attendance.type === AttendanceType.Leave);
          return (
            <Table.Row>
              <Table.Cell>{`${now.getFullYear()}/${now.getMonth() + 1}/${
                day
              }`}</Table.Cell>
              <Table.Cell>
                {firstArrival ? getTimePart(firstArrival.occurredAt) : "-"}
              </Table.Cell>
              <Table.Cell>
                {lastLeave ? getTimePart(lastLeave.occurredAt) : "-"}
              </Table.Cell>
              <Table.Cell>詳細</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
