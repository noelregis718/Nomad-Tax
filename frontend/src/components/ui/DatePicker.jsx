import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

const DatePicker = ({ selected, onChange, placeholderText, className }) => {
  return (
    <div className={`modern-datepicker-wrapper ${className}`}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat="yyyy-MM-dd"
        className="modern-datepicker-input"
        calendarClassName="modern-calendar-dropdown"
        popperPlacement="bottom-start"
        showPopperArrow={false}
        portalId="datepicker-portal"
      />
      <Calendar className="calendar-icon" size={16} />
    </div>
  );
};

export default DatePicker;
