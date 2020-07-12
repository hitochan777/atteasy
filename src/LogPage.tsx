import React from "react";
import { Button } from "semantic-ui-react";


async function logAttendance(type: "Arrive" | "Leave") {
  const data = { type };
  await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/api/LogAttendance?code=${process.env.REACT_APP_API_KEY}&clientId=attendance-taking-app`,
    { method: "POST", body: JSON.stringify(data), headers: {"content-type": "application/json"} }
  ); // TODO: replace with correct Endpoint
}

export function LogPage() {
  const handleAttendClick = async () => {
    await logAttendance("Arrive");
  };
  const handleLeaveClick = async () => {
    await logAttendance("Leave");
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
