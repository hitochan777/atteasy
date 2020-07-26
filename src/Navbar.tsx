import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Menu, Modal, Button } from "semantic-ui-react";
import { useUser } from "./useUser";
import { AddForm, useAddForm } from "./AddForm";
import { useLogAttendance } from "./useAttendances";

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

const useAddFormSubmit = (userId: string | undefined) => {
  const { logAttendance } = useLogAttendance();
  const submitAddForm = async (values: AddForm) => {
    if (!userId) {
      return;
    }
    await logAttendance(userId, values.attendanceType, new Date());
  };
  return submitAddForm;
};

export const Navbar = () => {
  const activeItem = useActiveItem();
  const { data } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const submitAddForm = useAddFormSubmit(data?.userId);
  const addForm = useAddForm(submitAddForm);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

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
          <AddForm form={addForm} />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button positive onClick={addForm.handlers.handleSubmit}>
            Add
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
