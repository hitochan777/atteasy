import React from "react";
import { Button } from "semantic-ui-react";
import { useUser } from "./useUser";
import { Redirect } from "react-router-dom";

async function logAttendance(userId: string, type: "Arrive" | "Leave") {
  const data = { type };
  await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/api/LogAttendance/${userId}?code=${process.env.REACT_APP_API_KEY}&clientId=attendance-taking-app`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    }
  );
}

export function LogPage() {
  const { data, loading } = useUser();
  if (loading) {
    return <div>loading...</div>;
  }
  if (!data) {
    return <Redirect to="/signin" />;
  }
  const handleAttendClick = async () => {
    await logAttendance(data.userId, "Arrive");
  };
  const handleLeaveClick = async () => {
    await logAttendance(data.userId, "Leave");
  };
  return (
    <div>
      <Button primary onClick={handleAttendClick}>
        Attend
      </Button>
      <Button secondary onClick={handleLeaveClick}>
        Leave
      </Button>
    </div>
  );
}
