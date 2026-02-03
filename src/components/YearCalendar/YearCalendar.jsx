import React, { useState } from 'react';

const YearCalendar = ({ year = new Date().getFullYear(), habit }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

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
    <div style={{
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h4 style={{ marginBottom: "8px", fontWeight: "600", color: habit.color }}>
        {habit.title}
      </h4>

      {/* Month Labels */}
      <div style={{
        position: "relative",
        height: "20px",
        marginLeft: "50px",     // make room for sidebar
        marginBottom: "10px"
      }}>
        {monthPositions.map(({ month, wi }) => (
          <div key={month} style={{
            position: "absolute",
            left: `${wi * 16}px`,
            fontSize: "11px",
            color: "#666",
            fontWeight: "500"
          }}>
            {monthLabels[month]}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "4px" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "14px" }}>
          {sidebarDayIndexes.map((weekday, idx) => (
            <div key={idx} style={{
              height: "12px",
              fontSize: "10px",
              color: "#777",
              marginBottom: (weekday === 1 ? "16px" : weekday === 3 ? "16px" : "16px")
            }}>
              {sidebarDays[idx]}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {week.map((day, di) => {
              if (!day) return (
                <div
                  key={di}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    background: "transparent",
                  }}
                ></div>
              );

              const dayKey = getDayKey(day);
              const record = habit.dates.find(d => d.date === dayKey);

              let background = "#d5d5d5"; // default grey for no habit
              let border = "none";

              if (record) {
                if (record.completed) {
                  background = "#3CB371"; // filled green
                } else {
                  background = "transparent"; // leave transparent
                  border = "1px solid #3CB371"; // green border for incomplete
                }
              }

              return (
                <div
                  key={di}
                  title={formatDate(day)}
                  onClick={() => handleToggle(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    cursor: "pointer",
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
      {hoveredDay && (
        <div style={{
          marginTop: "10px",
          padding: "8px",
          background: "#f2f2f2",
          borderRadius: "4px",
          border: "1px solid #ddd",
          fontSize: "12px",
          color: "#555"
        }}>
          <strong>{formatDate(hoveredDay)}</strong>
        </div>
      )}
    </div>
  );

};

export default YearCalendar;
