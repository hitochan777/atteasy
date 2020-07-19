import React, { useMemo } from "react";
import useSWR from "swr";
import { Table } from "semantic-ui-react";
import { Attendance, AttendanceType } from "./attendance";
import { useLocation, Redirect } from "react-router-dom";
import { YearMonthSelector } from "./YearMonthSelector";
import { fetcher } from "./fetcher";
import { useUser } from "./useUser";

function getTimePart(date: Date): string {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function useAttendances(
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function HistoryPage() {
  const { data, loading: isLoadingUser } = useUser();
  const now = new Date();
  const query = useQuery();
  const year = query.get("year");
  const month = query.get("month");
  const { attendances, isLoading } = useAttendances(
    data?.userId,
    year ? +year : now.getFullYear(),
    month ? +month : now.getMonth() + 1
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

  if (isLoading || isLoadingUser) {
    return <span>Loading the page...</span>;
  }

  if (!data) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <YearMonthSelector year={2020} month={7} />
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
              <Table.Row key={day}>
                <Table.Cell>{`${now.getFullYear()}/${
                  now.getMonth() + 1
                }/${day}`}</Table.Cell>
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
    </div>
  );
}
