import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Menu, Modal, Button, Form, Checkbox, Input } from "semantic-ui-react";
import { useUser } from "./useUser";
import { AttendanceType } from "./attendance";
import SemanticDatePicker from "react-semantic-ui-datepickers";

type ItemType = "log" | "history";

function useActiveItem(): ItemType {
  const match = useRouteMatch();
  if (match.path === "/") {
    return "log";
  } else if (match.path === "/history") {
    return "history";
  }
  return "log";
}

export const Navbar = () => {
  const activeItem = useActiveItem();
  const { data } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    attendanceType: AttendanceType.Arrive,
    occurredAt: new Date(),
  });

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = () => {
    setForm({ ...form });
  };

  const handleDateChange = (_: unknown, data: any) => {
    setForm({...form, occurredAt: data.value})
  }

  return (
    <>
      <Menu>
        <Menu.Item header>Attcy</Menu.Item>
        <Link to="/">
          <Menu.Item name="log" active={activeItem === "log"} />
        </Link>
        <Link to="/history">
          <Menu.Item name="history" active={activeItem === "history"} />
        </Link>
        <Menu.Menu position="right">
          {data ? (
            <>
              <Menu.Item onClick={openAddModal}>Add</Menu.Item>
              <Menu.Item>Welcome {data.userDetails}</Menu.Item>
              <a href="/.auth/logout">
                <Menu.Item name="logout" />
              </a>
            </>
          ) : (
            <Link to="/signin">
              <Menu.Item name="signin"></Menu.Item>
            </Link>
          )}
        </Menu.Menu>
      </Menu>
      <Modal dimmer="inverted" open={isModalOpen} onClose={closeAddModal}>
        <Modal.Header>Add attendance</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <SemanticDatePicker onChange={handleDateChange} />
              <Input></Input>
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="Attend"
                name="attendanceRadioGroup"
                value={AttendanceType.Arrive}
                checked={form.attendanceType === AttendanceType.Arrive}
                onChange={handleFormChange}
              />
              <Checkbox
                radio
                label="Leave"
                name="attendanceRadioGroup"
                value={AttendanceType.Leave}
                checked={form.attendanceType === AttendanceType.Leave}
                onChange={handleFormChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Add"
            onClick={closeAddModal}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};
