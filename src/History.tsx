import React, { useMemo } from "react";
import { useLocation, Redirect, Link } from "react-router-dom";
import { Table, Button } from "semantic-ui-react";

import { Attendance, AttendanceType } from "./attendance";
import { YearMonthSelector } from "./YearMonthSelector";
import { useUser } from "./useUser";
import { useAttendances } from "./useAttendances";
import { getTimePart } from "./time";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function HistoryPage() {
  const { data, loading: isLoadingUser } = useUser();
  const now = new Date();
  const query = useQuery();
  const year = +(query.get("year") ?? now.getFullYear());
  const month = +(query.get("month") ?? now.getMonth() + 1);
  const { attendances, isLoading } = useAttendances(data?.userId, year, month);

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
      <Button href={`/csv/${year}/${month}`} download>
        Download CSV
      </Button>
      <YearMonthSelector year={year} month={month} />
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
                <Table.Cell>{`${year}/${month}/${day}`}</Table.Cell>
                <Table.Cell>
                  {firstArrival ? getTimePart(firstArrival.occurredAt) : "-"}
                </Table.Cell>
                <Table.Cell>
                  {lastLeave ? getTimePart(lastLeave.occurredAt) : "-"}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/history/${now.getFullYear()}/${
                      now.getMonth() + 1
                    }/${day}`}
                  >
                    詳細
                  </Link>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
