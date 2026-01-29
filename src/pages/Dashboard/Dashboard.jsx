import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Habits are now stored by full date string (YYYY-MM-DD) instead of day index
  const [habits, setHabits] = useState([]);
  
  const availableHabits = [
    { name: 'Meditate', color: '#667eea' },
    { name: 'Read', color: '#4ecdc4' },
    { name: 'Exercise', color: '#ff6b6b' },
    { name: 'Journal', color: '#f7b731' },
    { name: 'Drink Water', color: '#45b7d1' },
    { name: 'Sleep 8hrs', color: '#a29bfe' },
    { name: 'Eat Healthy', color: '#fd79a8' },
    { name: 'No Social Media', color: '#fdcb6e' },
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
  
  const toggleHabit = (habitId) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
    ));
  };
  
  const addHabit = (habitName, color, date) => {
    const dateStr = formatDate(date);
    const newHabit = {
      id: `${habitName.toLowerCase()}-${dateStr}-${Date.now()}`,
      date: dateStr,
      title: habitName,
      color: color,
      completed: false
    };
    setHabits([...habits, newHabit]);
    setShowModal(false);
  };
  
  const removeHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };
  
  const openModal = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  return (

    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        padding: '3rem 2rem',
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
            
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            .calendar-container {
              animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .day-card {
              animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .day-card:nth-child(1) { animation-delay: 0.05s; }
            .day-card:nth-child(2) { animation-delay: 0.1s; }
            .day-card:nth-child(3) { animation-delay: 0.15s; }
            .day-card:nth-child(4) { animation-delay: 0.2s; }
            .day-card:nth-child(5) { animation-delay: 0.25s; }
            .day-card:nth-child(6) { animation-delay: 0.3s; }
            .day-card:nth-child(7) { animation-delay: 0.35s; }
            
            .day-card:hover {
              transform: translateY(-4px);
              border-color: rgba(255, 255, 255, 0.15) !important;
            }
            
            .habit-card {
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .habit-card:hover {
              transform: translateX(4px);
            }
            
            .event-card {
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .event-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            }
            
            .nav-button {
              transition: all 0.2s ease;
            }
            
            .nav-button:hover {
              transform: scale(1.1);
            }
          `}
        </style>

        <div className="calendar-container" style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
              }}>
                Habit Tracker
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#888',
                margin: 0,
                fontWeight: '400',
              }}>
                {formatMonthYear()}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}>
              <button
                className="nav-button"
                onClick={() => navigateWeek(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                }}
              >
                Today
              </button>

              <button
                className="nav-button"
                onClick={() => navigateWeek(1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day Cards in Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}>
            {daysOfWeek.map((day, dayIndex) => {
              const date = weekDates[dayIndex];
              const dateStr = formatDate(date);
              const today = isToday(date);
              const dayHabits = habits.filter(habit => habit.date === dateStr);
              
              return (
                <div
                  key={`${day}-${dateStr}`}
                  className="day-card"
                  style={{
                    background: today 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: today 
                      ? '1px solid rgba(102, 126, 234, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Card Header */}
                  <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: today ? 'rgba(102, 126, 234, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: today ? '#667eea' : '#666',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      {day}
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: today ? '#667eea' : '#fff',
                    }}>
                      {date.getDate()}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#888',
                      marginTop: '0.25rem',
                    }}>
                      {date.toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>

                  {/* Habits Container */}
                  <div style={{
                    padding: '1rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                    {dayHabits.length > 0 ? (
                      dayHabits.map(habit => (
                        <div
                          key={habit.id}
                          className="habit-card"
                          style={{
                            background: habit.completed 
                              ? `linear-gradient(135deg, ${habit.color}40 0%, ${habit.color}20 100%)`
                              : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${habit.completed ? habit.color + '60' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                        >
                          {/* Checkmark Circle */}
                          <div 
                            onClick={() => toggleHabit(habit.id)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: `2px solid ${habit.completed ? habit.color : '#666'}`,
                              background: habit.completed ? habit.color : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
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
                          
                          {/* Habit Title */}
                          <div 
                            onClick={() => toggleHabit(habit.id)}
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: habit.completed ? habit.color : '#fff',
                              textDecoration: habit.completed ? 'line-through' : 'none',
                              opacity: habit.completed ? 0.7 : 1,
                              flex: 1,
                              cursor: 'pointer',
                            }}
                          >
                            {habit.title}
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeHabit(habit.id);
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#888',
                              fontSize: '0.875rem',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(255, 59, 48, 0.2)';
                              e.target.style.borderColor = 'rgba(255, 59, 48, 0.4)';
                              e.target.style.color = '#ff3b30';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                              e.target.style.color = '#888';
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '0.875rem',
                        fontStyle: 'italic',
                      }}>
                        No habits yet
                      </div>
                    )}
                  </div>

                  {/* Add Habit Button */}
                  <div style={{
                    padding: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                    <button
                      onClick={() => openModal(date)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: '#888',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      <Plus size={16} />
                      Add Habit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {['#667eea', '#4ecdc4', '#ff6b6b', '#f7b731'].map((color, index) => (
              <div key={color} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: color,
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#888',
                }}>
                  {['Meditate', 'Read', 'Exercise', 'Journal'][index]}
                </span>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem',
              }}
              onClick={() => setShowModal(false)}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2rem',
                  maxWidth: '500px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#fff',
                    margin: 0,
                  }}>
                    Add Habit
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#888',
                      fontSize: '1.25rem',
                      transition: 'all 0.2s ease',
                    }}
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

                <div style={{
                  fontSize: '0.875rem',
                  color: '#888',
                  marginBottom: '1.5rem',
                }}>
                  Select a habit to add for {selectedDay && selectedDay.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1rem',
                }}>
                  {availableHabits.map((habit) => (
                    <button
                      key={habit.name}
                      onClick={() => addHabit(habit.name, habit.color, selectedDay)}
                      style={{
                        background: `linear-gradient(135deg, ${habit.color}20 0%, ${habit.color}10 100%)`,
                        border: `1px solid ${habit.color}40`,
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#fff',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
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
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: habit.color,
                      }}></div>
                      {habit.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}