import React, { useState } from "react";
import { Message, Form, Input } from "semantic-ui-react";
import { AttendanceType } from "./attendance";
import SemanticDatePicker from "react-semantic-ui-datepickers";
import { getTimePart } from "./time";

export type AddForm = {
  attendanceType: AttendanceType;
  occurredAt: {
    date: Date;
    time: string;
  };
};

type Primitive =
  | string
  | boolean
  | number
  | bigint
  | symbol
  | null
  | undefined
  | Date;

type FormError<T> = {
  [K in keyof T]: T[K] extends Primitive ? string | null : FormError<T[K]>;
};

function validateForm(form: AddForm): FormError<AddForm> {
  return { attendanceType: null, occurredAt: { date: null, time: null } };
}

export const useAddForm = (onSubmit: (values: AddForm) => Promise<void>) => {
  const now = new Date();
  const [form, setForm] = useState<AddForm>({
    attendanceType: AttendanceType.Arrive,
    occurredAt: {
      date: now,
      time: getTimePart(now, false),
    },
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const changeAttendanceType = (_: unknown, data: any) => {
    setForm({ ...form, attendanceType: data.value });
  };

  const handleDateChange = (_: unknown, data: any) => {
    setForm({ ...form, occurredAt: { ...form.occurredAt, date: data.value } });
  };

  const handleTimeChange = (_: unknown, data: any) => {
    setForm({ ...form, occurredAt: { ...form.occurredAt, time: data.value } });
  };

  const handleSubmit = async () => {
    const errors = validateForm(form);
    if (errors.attendanceType) {
      setErrorMessage(errors.attendanceType);
      return;
    }
    if (errors.occurredAt.date) {
      setErrorMessage(errors.occurredAt.date);
      return;
    }
    if (errors.occurredAt.time) {
      setErrorMessage(errors.occurredAt.time);
      return;
    }
    await onSubmit(form);
  };
  return {
    value: form,
    handlers: {
      handleDateChange,
      handleTimeChange,
      handleSubmit,
      changeAttendanceType,
    },
    errorMessage,
  };
};

interface Props {
  form: {
    value: AddForm;
    handlers: {
      handleDateChange: (_: unknown, data: any) => void;
      handleTimeChange: (_: unknown, data: any) => void;
      changeAttendanceType: (_: unknown, data: any) => void;
    };
    errorMessage: string | null;
  };
}

export const AddForm: React.FC<Props> = ({
  form: { value, handlers, errorMessage },
}) => {
  return (
    <Form>
      <Form.Group inline>
        <SemanticDatePicker
          value={value.occurredAt.date}
          onChange={handlers.handleDateChange}
        />
        <Input
          value={value.occurredAt.time}
          placeholder="hhmmss"
          onChange={handlers.handleTimeChange}
        ></Input>
      </Form.Group>
      <Form.Group inline>
        <Form.Radio
          label="Attend"
          name="attendanceRadioGroup"
          value={AttendanceType.Arrive}
          checked={value.attendanceType === AttendanceType.Arrive}
          onChange={handlers.changeAttendanceType}
        />
        <Form.Radio
          label="Leave"
          name="attendanceRadioGroup"
          value={AttendanceType.Leave}
          checked={value.attendanceType === AttendanceType.Leave}
          onChange={handlers.changeAttendanceType}
        />
      </Form.Group>
      <Message>{errorMessage}</Message>
    </Form>
  );
};
