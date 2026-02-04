import React, { useState } from 'react';
import './YearCalendar.scss';

const YearCalendar = ({ year = new Date().getFullYear(), habit }) => {
  const generateYearDays = () => {
    const days = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const days = generateYearDays();
  const getDayKey = d => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleToggle = (day) => {
    if (!day) return;

    const dateKey = getDayKey(day);
    const existing = habit.dates.find(d => d.date === dateKey);

    habit.onToggle(dateKey, existing);
  };

  const getWeekday = d => (d.getDay() + 6) % 7;

  const weeks = [];
  let currentWeek = new Array(7).fill(null);

  days.forEach((day, index) => {
    const weekday = getWeekday(day);

    if (index === 0 && weekday !== 0) {
      currentWeek = new Array(7).fill(null);
    }

    currentWeek[weekday] = day;

    if (weekday === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
    }
  });

  // WEEKDAY SIDEBAR LABELS
  const sidebarDays = ["Tue", "Thu", "Sat"];

  // For sidebar placement: Tuesday=1, Thursday=3, Saturday=5 in Monday-start week
  const sidebarDayIndexes = [1, 3, 5];

  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const getMonthPositions = () => {
    const positions = [];

    for (let month = 0; month < 12; month++) {
      const firstOfMonth = new Date(year, month, 1);
      const firstKey = getDayKey(firstOfMonth);

      for (let wi = 0; wi < weeks.length; wi++) {
        const week = weeks[wi];
        const colIndex = week.findIndex(d => d && getDayKey(d) === firstKey);

        if (colIndex !== -1) {
          positions.push({ month, wi });
          break;
        }
      }
    }

    return positions;
  };

  const monthPositions = getMonthPositions();

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  return (
    <div className="year-calendar">
      <h4 className="year-calendar-title" style={{ color: habit.color }}>
        {habit.title}
      </h4>

      {/* Month Labels */}
      <div className="month-labels-container">
        {monthPositions.map(({ month, wi }) => (
          <div className="month-label" key={month} style={{
            left: `${wi * 16}px`,
          }}>
            {monthLabels[month]}
          </div>
        ))}
      </div>

      <div className="sidebar-container">
        <div className="sidebar-wrapper">
          {sidebarDayIndexes.map((weekday, idx) => (
            <div className="sidebar-day" key={idx}>
              {sidebarDays[idx]}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, wi) => (
          <div className="week-container" key={wi}>
            {week.map((day, di) => {
              if (!day) return (
                <div className="empty-day" key={di}></div>
              );

              const dayKey = getDayKey(day);
              const record = habit.dates.find(d => d.date === dayKey);

              let background = "#d5d5d5"; // default grey for no habit
              let border = "none";

              if (record) {
                if (record.completed) {
                  background = habit.color; // filled green
                } else {
                  background = "transparent"; // leave transparent
                  border = `1px solid ${habit.color}`; // green border for incomplete
                }
              }

              return (
                <div
                  className="calendar-day"
                  key={di}
                  title={formatDate(day)}
                  onClick={() => handleToggle(day)}
                  style={{
                    background,
                    border,
                    transition: "background 0.15s ease, border 0.15s ease",
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

};

export default YearCalendar;
