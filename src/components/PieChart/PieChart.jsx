import React, { useState, useEffect } from 'react';

const PieChart = ({habits}) => {
  const [animate, setAnimate] = useState(false);
  
  // Calculate completion counts
  const stats = habits.map(habit => ({
    title: habit.title,
    color: habit.color,
    completed: habit.dates.filter(d => d.completed).length,
    total: habit.dates.length
  }));

  const totalCompleted = stats.reduce((sum, stat) => sum + stat.completed, 0);

  // Calculate pie chart segments
  let currentAngle = 0;
  const segments = stats.map(stat => {
    const percentage = (stat.completed / totalCompleted) * 100;
    const angle = (stat.completed / totalCompleted) * 360;
    const segment = {
      ...stat,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const createPieSlice = (startAngle, endAngle, color, index) => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const animatedAngle = animate ? endAngle : startAngle;
    const animatedEndRad = (animatedAngle - 90) * Math.PI / 180;
    const animatedX2 = centerX + radius * Math.cos(animatedEndRad);
    const animatedY2 = centerY + radius * Math.sin(animatedEndRad);
    const animatedLargeArc = animatedAngle - startAngle > 180 ? 1 : 0;

    const animatedPath = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${animatedLargeArc} 1 ${animatedX2} ${animatedY2}`,
      'Z'
    ].join(' ');

    return (
      <path
        key={index}
        d={animatedPath}
        fill={color}
        stroke="#fff"
        strokeWidth="2"
        style={{
          transition: 'all 1.5s ease-out',
          transitionDelay: `${index * 0.1}s`
        }}
      />
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // minHeight: '100vh',
      // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      // fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // padding: '20px'
    }} className='pie-chart'>
      <div style={{
        background: '#173632',
        borderRadius: '15px',
        // padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        // maxWidth: '600px',
        width: '100%'
      }}>
        {/* <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Habit Completion Stats
        </h1> */}
        {/* <p style={{
          fontSize: '16px',
          color: '#718096',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Total completed: {totalCompleted} tasks
        </p> */}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            {segments.map((segment, index) => 
              createPieSlice(segment.startAngle, segment.endAngle, segment.color, index)
            )}
            
            {/* Center circle for donut effect */}
            <circle
              cx="150"
              cy="150"
              r="60"
              fill="white"
            />
            
            {/* Center text */}
            <text
              x="150"
              y="145"
              textAnchor="middle"
              style={{
                fontSize: '32px',
                fontWeight: '700',
                fill: '#2d3748'
              }}
            >
              {totalCompleted}
            </text>
            <text
              x="150"
              y="165"
              textAnchor="middle"
              style={{
                fontSize: '14px',
                fill: '#718096'
              }}
            >
              completed
            </text>
          </svg>
        </div>

        <div style={{
          // display: 'grid',
          display: 'none',
          gap: '16px'
        }}>
          {segments.map((segment, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#f7fafc',
                borderRadius: '12px',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease-out',
                transitionDelay: `${0.8 + index * 0.1}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: segment.color
                }} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {segment.title}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  {segment.completed}/{segment.total}
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: segment.color
                }}>
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;