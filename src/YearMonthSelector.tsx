import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const YearMonthSelector: React.FC<{ year: number; month: number }> = ({
  year,
  month,
}) => {
  return (
    <Menu secondary>
      <Link to={`/history?year=${year - 1}&month=${12}`}>
        <Menu.Item name="＜" />
      </Link>
      {Array.from(Array(12).keys()).map((i) => (
        <Link key={i} to={`/history?year=${year}&month=${i + 1}`}>
          <Menu.Item key={i} name={`${i + 1}`} />
        </Link>
      ))}
      <Link to={`/history?year=${year + 1}&month=${1}`}>
        <Menu.Item name="＞" />
      </Link>
    </Menu>
  );
};
