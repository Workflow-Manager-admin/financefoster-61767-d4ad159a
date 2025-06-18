import React, { useState } from 'react';
import './App.css';

// THEME COLORS
const COLORS = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  accent: '#2196F3',
  background: '#F4F6FA',
  card: '#FFFFFF',
  text: '#222222',
  textSecondary: '#4a4a4a',
  border: '#E0E5ED',
  progressBg: '#E6E6E6',
};

// PUBLIC_INTERFACE
function App() {
  // State: array of goal objects
  const [goals, setGoals] = useState([
    // DEMO DATA for initial view
    {
      id: 1,
      name: 'New Laptop',
      target: 800,
      current: 260,
      deadline: '2024-12-31',
    },
    {
      id: 2,
      name: 'Holiday Trip',
      target: 500,
      current: 75,
      deadline: '2025-05-01',
    },
  ]);
  // State: input for new goal
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
  });
  // State: reminders (simulate)
  const [reminders, setReminders] = useState([
    {
      id: 1,
      text: 'Weekly reminder: Save ₹100 towards Holiday Trip',
      time: 'Today, 8pm'
    }
  ]);
  // State: selected goal for details & habit builder
  const [selectedGoal, setSelectedGoal] = useState(null);

  // PUBLIC_INTERFACE
  function handleCreateGoal(e) {
    e.preventDefault();
    // Minor input validation
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) return;
    setGoals([
      ...goals,
      {
        id: Date.now(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
      }
    ]);
    setNewGoal({ name: '', target: '', deadline: '' });
  }

  // PUBLIC_INTERFACE
  function handleDeleteGoal(id) {
    setGoals(goals.filter(goal => goal.id !== id));
    if (selectedGoal && selectedGoal.id === id) setSelectedGoal(null);
  }

  // PUBLIC_INTERFACE
  function handleAddSavings(goalId, amount) {
    setGoals(goals.map(goal => goal.id === goalId
      ? { ...goal, current: Math.min(goal.target, goal.current + Number(amount)) }
      : goal
    ));
  }

  // PUBLIC_INTERFACE
  function handleSelectGoal(goal) {
    setSelectedGoal(goal);
  }

  // PUBLIC_INTERFACE
  function handleCloseGoalDetail() {
    setSelectedGoal(null);
  }

  // PUBLIC_INTERFACE
  function handleHabitAction(goalId, suggested) {
    handleAddSavings(goalId, suggested);
    setReminders([
      ...reminders,
      {
        id: Date.now(),
        text: `Great! You just micro-saved ₹${suggested} towards your goal!`,
        time: 'Just now'
      }
    ]);
  }

  // Helper: Calculate progress percentage
  function getProgress(goal) {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        color: COLORS.text,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: COLORS.primary,
          padding: 18,
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.2rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 0 8px rgba(76,175,80,0.07)',
          display: 'flex',
          alignItems: 'center'
        }}>
        <span style={{letterSpacing: 1, display: 'flex', alignItems: 'center'}}>
          <span style={{
                marginRight: 12,
                color: COLORS.accent,
                fontWeight: 900,
                fontSize: '1.4em'
              }}>₹</span>
          <span>FinanceFoster</span>
        </span>
        <span style={{marginLeft: 'auto', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.85)'}}>
          Personal Finance Companion
        </span>
      </nav>

      {/* Main Dashboard */}
      <main style={{
        flex: 1,
        maxWidth: 1080,
        width: '100%',
        margin: '0 auto',
        padding: '32px 18px 28px 18px',
        marginTop: 18,
        boxSizing: 'border-box'
      }}>
        {/* Hero Section */}
        <section style={{marginBottom: 32}}>
          <h1 style={{
            fontWeight: 700,
            fontSize: "2.2em",
            margin: 0,
            letterSpacing: 0.6,
            color: COLORS.primary
          }}>
            Student-friendly goal planner & savings tracker
          </h1>
          <div style={{color: COLORS.textSecondary, maxWidth: 700, margin: '16px 0', fontSize: "1.1em"}}>
            Set financial goals, track progress visually, build healthy money-saving habits with reminders, and enjoy total privacy—no bank/UPI link required!
          </div>
        </section>

        {/* Goal Creation & Goals List - Layout */}
        <div style={{
          display: 'flex',
          gap: 36,
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>

          {/* Goals List / Cards */}
          <div style={{flex: 2, minWidth: 340}}>
            <h2 style={{fontWeight: 600, color: COLORS.accent, marginBottom: 12}}>
              Your Goals
            </h2>
            {goals.length === 0 &&
              <div style={{margin: '32px 0', color: COLORS.textSecondary, fontStyle: 'italic'}}>
                No active goals yet. Start by adding one!
              </div>
            }
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20
            }}>
              {goals.map(goal =>
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={getProgress(goal)}
                  onAddSavings={handleAddSavings}
                  onDelete={() => handleDeleteGoal(goal.id)}
                  onViewDetails={() => handleSelectGoal(goal)}
                  accent={COLORS.accent}
                  primary={COLORS.primary}
                  secondary={COLORS.secondary}
                  cardColor={COLORS.card}
                />
              )}
            </div>
          </div>
          {/* Goal Creator */}
          <div style={{
            flex: 1,
            minWidth: 290,
            background: COLORS.card,
            borderRadius: 13,
            padding: '24px 22px',
            boxShadow: '0 2px 16px 0 rgba(68,68,68,0.06)',
            border: `1px solid ${COLORS.border}`
          }}>
            <h3 style={{
              color: COLORS.primary, marginTop: 0, marginBottom: 12
            }}>Add New Goal</h3>
            <form onSubmit={handleCreateGoal} style={{display: 'flex', flexDirection: 'column', gap:10}}>
              <label style={{fontWeight:500, marginBottom:2}}>Goal Name
                <input
                  style={inputStyle}
                  type="text"
                  required
                  value={newGoal.name}
                  onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g. New Phone"
                  maxLength={26}
                 />
              </label>
              <label style={{fontWeight:500, marginBottom:2}}>Target Amount (₹)
                <input
                  style={inputStyle}
                  type="number"
                  required
                  min={50}
                  value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="e.g. 15000"
                  step="10"
                />
              </label>
              <label style={{fontWeight:500, marginBottom:2}}>Target Date
                <input
                  style={inputStyle}
                  type="date"
                  required
                  value={newGoal.deadline}
                  onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </label>
              <button
                type="submit"
                style={{
                  ...btnStyle,
                  background: COLORS.primary,
                  color: "#fff",
                  marginTop: 9
                }}
              >Create Goal</button>
            </form>
          </div>
        </div>

        {/* Reminders & Habit Section */}
        <div style={{marginTop: 48}}>
          <div style={{display:'flex', alignItems:'flex-start', gap:40, flexWrap:'wrap'}}>
            {/* Reminders List */}
            <div style={{
              flex: 2, minWidth:220, background: COLORS.card,
              borderRadius: 11, boxShadow: '0 2px 14px 0 rgba(66,66,65,0.05)',
              border: `1px solid ${COLORS.border}`, padding: '22px 18px'
            }}>
              <h3 style={{color: COLORS.accent, fontWeight:600, marginTop:0, marginBottom:8}}>
                Reminders & Nudges
              </h3>
              <ul style={{listStyle:'none', padding:0, margin:0}}>
                {reminders.length === 0 &&
                  <li style={{color:COLORS.textSecondary}}>No reminders scheduled.</li>}
                {reminders.map(r =>
                  <li key={r.id} style={{
                    marginBottom: 10, padding: '9px 0',
                    borderBottom: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    fontSize: 15.5
                  }}>
                    <span style={{fontWeight:500}}>{r.text}</span>
                    <span style={{marginLeft:8, color:'#666', fontSize:13}}> &middot; {r.time}</span>
                  </li>
                )}
              </ul>
            </div>
            {/* Habit Builder: Suggest small amounts to save */}
            {selectedGoal &&
            <HabitBuilder
              goal={selectedGoal}
              onHabitSave={suggested => handleHabitAction(selectedGoal.id, suggested)}
              onClose={handleCloseGoalDetail}
              primary={COLORS.primary}
              accent={COLORS.accent}
              secondary={COLORS.secondary}
              cardColor={COLORS.card}
            />}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer style={{
        padding: 18,
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: '1em'
      }}>
        FinanceFoster &middot; No bank/UPI link required &middot; Designed for students &amp; young professionals
      </footer>
    </div>
  );
}

// GOAL CARD COMPONENT
// PUBLIC_INTERFACE
function GoalCard({ goal, progress, onAddSavings, onDelete, onViewDetails, accent, primary, secondary, cardColor }) {
  const [amount, setAmount] = useState('');

  // Estimate monthly contribution via "smart calculator"
  function getSuggestedContribution(goal) {
    const now = new Date();
    const end = new Date(goal.deadline);
    const months = Math.ceil((end - now) / (1000*60*60*24*30));
    const left = Math.max(0, goal.target - goal.current);
    if (months <= 0) return left;
    return Math.ceil(left / months);
  }

  return (
    <div
      style={{
        background: cardColor,
        borderRadius: 12,
        boxShadow: '0 2px 15px 0 rgba(38,50,56,0.05)',
        border: `1px solid #e4eaff`,
        minWidth: 250,
        maxWidth: 320,
        width: "100%",
        marginBottom: 8,
        padding: '22px 18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }}
    >
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:7}}>
        <div style={{fontWeight:600, fontSize:'1.15em', color:primary}}>{goal.name}</div>
        <button
          onClick={onDelete}
          title="Delete goal"
          style={{
            border:'none', background:'none', color:accent, fontWeight:900, cursor:'pointer', fontSize:17
          }}>✕</button>
      </div>
      <div style={{
        margin:'8px 0', color:'#5e5e5e', fontSize:14, fontWeight:400
      }}>
        Target: <b>₹{goal.target}</b> &nbsp;&nbsp; | &nbsp;&nbsp;
        Deadline: <span style={{color:accent}}>{goal.deadline}</span>
      </div>
      <ProgressBar percentage={progress} primary={primary} />
      <div style={{
        color:'#247', fontWeight:600, margin: '7px 0', fontSize:15.3
      }}>Saved: ₹{goal.current} / {goal.target}
      </div>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="Add amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            flex:1, border:`1px solid #dde`, borderRadius:5, fontSize:15,
            padding:'4px 10px', outline:'none'
          }}
        />
        <button
          style={{
            ...btnStyle,
            background: accent,
            color: "#fff",
            fontSize:15,
            padding:'8px 12px'
          }}
          onClick={() => {
            if (!amount || isNaN(amount) || amount <= 0) return;
            onAddSavings(goal.id, parseFloat(amount));
            setAmount('');
          }}
        >Add</button>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:7, fontSize:13.8, marginTop:7}}>
        <span style={{color:secondary}}>Est. per month: ₹{getSuggestedContribution(goal)}</span>
        <button
          onClick={onViewDetails}
          style={{
            marginLeft: 'auto',
            padding:'3px 10px',
            background: secondary,
            border: 'none',
            borderRadius: 5,
            color: cardColor,
            fontWeight: 600,
            cursor: 'pointer'
          }}>Habit/Nudge</button>
      </div>
    </div>
  );
}

// PROGRESS BAR COMPONENT
// PUBLIC_INTERFACE
function ProgressBar({ percentage, primary }) {
  return (
    <div style={{width:'100%', background:'#F1F4F8', borderRadius:5, height: 9, marginBottom: 5}}>
      <div style={{
        width: `${percentage}%`,
        background: `linear-gradient(90deg, ${primary} 60%, #B2DFDB 100%)`,
        height: '100%',
        borderRadius: 5,
        transition:'width .5s'
      }}/>
    </div>
  );
}

// HABIT BUILDER COMPONENT (micro-saving suggestion + nudge)
// PUBLIC_INTERFACE
function HabitBuilder({ goal, onHabitSave, onClose, primary, accent, secondary, cardColor }) {
  // Micro-saving random suggestion (simulate basis balance)
  function getMicroSuggestion(goal) {
    const left = Math.max(0, goal.target - goal.current);
    if (left < 20) return 5;
    return Math.max(10, Math.round(left/15));
  }
  const micro = getMicroSuggestion(goal);

  return (
    <div style={{
      flex: 1, minWidth:210,
      background: cardColor,
      borderRadius: 13,
      boxShadow: '0 1px 13px 0 rgba(50,70,60,0.07)',
      border: `1px solid #e5eaf7`,
      padding: '22px 16px',
      position: 'relative'
    }}>
      <button
        style={{
          position: 'absolute', top: 7, right: 9,
          border: 'none', background: 'none', color: secondary,
          fontWeight: 900, fontSize: 18, cursor: 'pointer'
        }}
        title="Close"
        onClick={onClose}
      >✕</button>
      <h4 style={{margin:'0 0 10px 0', color: accent}}>Habit Builder</h4>
      <div style={{color:"#555", marginBottom:11}}>
        Save <span style={{color:primary, fontWeight:600}}>₹{micro}</span> today for "<b>{goal.name}</b>"?
      </div>
      <button
        style={{
          ...btnStyle,
          background: accent,
          color: "#fff",
          padding: '10px 20px'
        }}
        onClick={() => onHabitSave(micro)}
      >
        Yes! Quick Save
      </button>
      <div style={{fontSize:13.2, color:'#888', marginTop:12}}>
        Micro-savings make big dreams<br/>Start your habit today 🚀
      </div>
    </div>
  );
}

// --- COMMON STYLES ---
const inputStyle = {
  width:'100%',
  fontSize: '1em',
  padding: '7px 10px',
  margin: '3px 0 8px 0',
  border: '1px solid #c5d9e8',
  borderRadius: 6,
  background: '#fff',
  color:'#222'
};

const btnStyle = {
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: 15.5,
  letterSpacing: 0.1,
  boxShadow: "0 1px 3px 0 rgba(74,170,158,0.07)"
};

export default App;
