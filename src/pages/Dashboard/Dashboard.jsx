import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Dashboard.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const { habits, dispatch } = useHabitsContext();
  const { user } = useAuthContext();
  
  useEffect(() => {
    const fetchHabits = async () => {
      const response = await fetch('https://habitus-be.vercel.app/api/habits', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      console.log("fetched habits", data);
        
      if (response.ok) {
        // setHabits(data);
        const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        dispatch({ type: 'SET_HABITS', payload: sorted });
      }
    }

    if (user) {
      fetchHabits();
    }
  }, [user]);

  const uniqueHabits = [
    ...new Map(
      habits.map(habit => [`${habit.title}-${habit.color}`, {
        title: habit.title,
        color: habit.color
      }])
    ).values()
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getWeekDates = (date) => {
    const week = [];
    const first = date.getDate() - date.getDay() + 1;
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(first + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const formatMonthYear = () => {
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const toggleHabit = async (habitId) => {
    const habit = habits.find(h => h._id === habitId || h.id === habitId);
    if (!habit) return;
    
    try {
      const response = await fetch(`https://habitus-be.vercel.app/api/habits/${habit._id || habit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ completed: !habit.completed })
      });
      
      if (response.ok) {
        dispatch({ type: 'TOGGLE_HABIT', payload: habit._id || habit.id });
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };
  
  const addHabit = async (habitName, color, date) => {
    const dateStr = formatDate(date);
    
    try {
      const response = await fetch('https://habitus-be.vercel.app/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title: habitName,
          date: dateStr,
          color: color,
          completed: false
        })
      });
      
      if (response.ok) {
        const newHabit = await response.json();
        dispatch({ type: 'ADD_HABIT', payload: newHabit });
        setShowModal(false);
        // console.log("newHabit", newHabit);
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };
  
  const removeHabit = async (habitId) => {
    try {
      const response = await fetch(`https://habitus-be.vercel.app/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        dispatch({ type: 'REMOVE_HABIT', payload: habitId });
      }
    } catch (error) {
      console.error('Error removing habit:', error);
    }
  };
  
  const openModal = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  return (

    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="calendar-container">
          {/* Header */}
          <div className="calendar-header">
            <div className="header-content">
              <h1 className="dashboard-title">Habit Tracker</h1>
              <p className="dashboard-subtitle">{formatMonthYear()}</p>
            </div>

            <div className="nav-buttons-container">
              <button className="nav-button" onClick={() => navigateWeek(-1)}>
                <ChevronLeft size={20} />
              </button>
              
              <button className="nav-today-button" onClick={() => setCurrentDate(new Date())}>
                Today
              </button>

              <button className="nav-button" onClick={() => navigateWeek(1)}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day Cards in Row */}
          <Swiper
            breakpoints={{
              0: { slidesPerView: 1.2 },
              575: { slidesPerView: 1.7 },
              786: { slidesPerView: 2.8 },
              1024: { slidesPerView: 3.8 },
              1200: { slidesPerView: 4.8 },
              1400: { slidesPerView: 7 }
            }}
            spaceBetween={32}
            className="day-cards-swiper"
          >
            {daysOfWeek.map((day, dayIndex) => {
              const date = weekDates[dayIndex];
              const dateStr = formatDate(date);
              const today = isToday(date);
              const dayHabits = habits.filter(habit => habit.date === dateStr);

              return (
                <SwiperSlide key={`${day}-${dateStr}`}>
                  <div className={`day-card ${today ? 'today' : ''}`}>
                    {/* Card Header */}
                    <div className={`day-card-header ${today ? 'today' : ''}`}>
                      <div className="day">{day}</div>
                      <div className="date-number">{date.getDate()}</div>
                      <div className="month-name">{date.toLocaleString('default', { month: 'short' })}</div>
                    </div>

                    {/* Habits Container */}
                    <div className="habits-container">
                      {dayHabits.length > 0 ? (
                        dayHabits.map(habit => (
                          <div
                            key={habit._id || habit.id}
                            className="habit-card"
                            style={{
                              background: habit.completed 
                                ? `linear-gradient(135deg, ${habit.color}CC 0%, ${habit.color}66 100%)`
                                : `linear-gradient(135deg, ${habit.color}CC 0%, ${habit.color}66 100%)`,
                              border: `1px solid ${habit.completed ? habit.color + '60' : habit.color + '60'}`,
                            }}
                          >
                            <div 
                              className="checkmark-circle"
                              onClick={() => toggleHabit(habit._id || habit.id)}
                              style={{
                                border: `2px solid ${habit.completed ? habit.color : '#666'}`,
                                background: habit.completed ? habit.color : 'transparent',
                              }}
                            >
                              {habit.completed && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path 
                                    d="M2 7L5.5 10.5L12 4" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className={`habit-title ${habit.completed ? 'completed' : ''}`} onClick={() => toggleHabit(habit._id || habit.id)}>
                              {habit.title}
                            </div>

                            <button
                              className="remove-habit-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHabit(habit._id || habit.id);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="no-habits-message">No habits set</div>
                      )}
                    </div>

                    <div className="add-habit-button-container">
                      <button
                        className="add-habit-button"
                        onClick={() => openModal(date)}
                      >
                        <Plus size={16} />
                        Add Habit
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Add Habit</h2>
                  <button
                    className="close-button"
                    onClick={() => setShowModal(false)}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-description" style={{
                }}>
                  Select a habit to add for {selectedDay && selectedDay.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>

                <div className="habit-options-container">
                  {uniqueHabits.length > 0 ? (
                    uniqueHabits.map((habit) => (
                      <button
                        key={habit.title}
                        onClick={() => addHabit(habit.title, habit.color, selectedDay)}
                        className="habit-button"
                        style={{
                          background: `linear-gradient(135deg, ${habit.color}20 0%, ${habit.color}10 100%)`,
                          border: `1px solid ${habit.color}40`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = `linear-gradient(135deg, ${habit.color}30 0%, ${habit.color}20 100%)`;
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = `linear-gradient(135deg, ${habit.color}20 0%, ${habit.color}10 100%)`;
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        <div className="habit-name" style={{ background: habit.color }}></div>
                        {habit.title}
                      </button>
                    ))
                  ) : (
                    <div className="no-unique-habits">
                      <p>You haven't created any habits yet.</p>
                      <button
                        className="go-to-habits-button"
                        onClick={() => window.location.href = "/habits"} // or use navigate()
                      >
                        Create Habit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}