import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const Calendar = () => {
  const [startDate, setStartDate] = useState(false);

  const onChange = (event) => {
    setStartDate(event)
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      isClearable
      placeholderText="Choose a date"
    />
  );
};
