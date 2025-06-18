import React, { useState, useEffect } from 'react';
import './App.css';

// THEME COLORS (light blue palette for Goalie)
const COLORS = {
  primary: '#4094e6',       // Soothing blue
  secondary: '#7ddfff',     // Cyan accent
  accent: '#1155d4',        // Deep blue for highlights
  background: '#f4f9ff',    // Offwhite/blue background
  card: '#ffffff',
  text: '#263047',
  textSecondary: '#6c7aa0',
  border: '#c3d1e6',
  progressBg: '#e0eeff',
};

// Frequency types
const FREQUENCIES = [
  { label: 'Daily', value: 'day', plural: 'days' },
  { label: 'Weekly', value: 'week', plural: 'weeks' },
  { label: 'Monthly', value: 'month', plural: 'months' },
];

/**
 * Modal prompting for initial user setup: monthly income and spending
 * On submit, passes {income, spending} to setUserFinance
 */
function IncomeSpendingModal({ show, onSave, incomeDefault, spendingDefault }) {
  const [income, setIncome] = useState(incomeDefault || '');
  const [spending, setSpending] = useState(spendingDefault || '');

  useEffect(() => { setIncome(incomeDefault || ''); }, [incomeDefault]);
  useEffect(() => { setSpending(spendingDefault || ''); }, [spendingDefault]);
  if (!show) return null;
  return (
    <div className="modal-backdrop" style={{
      zIndex: 200
    }}>
      <div className="modal-content" style={{
        boxShadow: "0 12px 49px 0 rgba(36,62,88,0.17)",
        border: "2.3px solid var(--base-light)",
        background: "linear-gradient(110deg, #fff 85%, #eaf6ff 100%)"
      }}>
        <h2 style={{
          color: "var(--base-dark)",
          fontWeight: 700, 
          margin: "0 0 19px 0",
          fontFamily: '"Quicksand","Inter",sans-serif'
        }}>Get started with Goalie</h2>
        <div style={{
          fontSize: 16.6,
          color: "var(--text-secondary)",
          marginBottom: 18
        }}>
          Enter your monthly income and typical spending.<br/>
          <span style={{ fontWeight: 600 }}>We'll help you set a smart, realistic savings plan!</span>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          if (Number(income) > 0 && Number(spending) >= 0 && Number(income) >= Number(spending)) {
            onSave(Number(income), Number(spending));
          }
        }} style={{display: "flex", flexDirection: "column", gap: 15, alignItems: "center"}}>
          <div style={{width:"100%", textAlign:"left"}}>
            <label style={{fontWeight:600, fontFamily:'inherit'}}>Monthly Income (₹)<br/>
              <input
                className="input-rounded"
                type="number"
                required
                min={0}
                value={income}
                style={{
                  width:'100%',
                  fontSize: '1em',
                  padding: '9px 13px',
                  margin: '4px 0 9px 0',
                  border: '1.25px solid var(--border-color)',
                  borderRadius: 10,
                  background: '#f7fbff',
                  color:'#232540'
                }}
                onChange={e => setIncome(e.target.value)}
                placeholder="e.g. 20000"
              />
            </label>
          </div>
          <div style={{width:"100%", textAlign:"left"}}>
            <label style={{fontWeight:600, fontFamily:'inherit'}}>Monthly Spending (₹)<br/>
              <input
                className="input-rounded"
                type="number"
                required
                min={0}
                value={spending}
                style={{
                  width:'100%',
                  fontSize: '1em',
                  padding: '9px 13px',
                  margin: '4px 0 9px 0',
                  border: '1.25px solid var(--border-color)',
                  borderRadius: 10,
                  background: '#f7fbff',
                  color:'#232540'
                }}
                onChange={e => setSpending(e.target.value)}
                placeholder="e.g. 16000"
              />
            </label>
          </div>
          <button type="submit"
            className="btn"
            style={{
              marginTop: 12,
              boxShadow: "0 1px 12px 0 #b4f2ff22",
              minWidth: 110,
              fontSize: "1.11em",
              borderRadius: 26
            }}
          >Save & Continue</button>
        </form>
        <div style={{
          fontSize: 12.5,
          color: "#98a4ab",
          marginTop: 15
        }}>
          Data is stored locally. You can change it anytime in the dashboard.
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // --- USER FINANCE STATE ---
  // Holds: income, spending, savings
  const [userFinance, setUserFinance] = useState(() => {
    // From localStorage for persistence
    const stored = localStorage.getItem('goalie-user-finance');
    if (stored) try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object" && parsed.income != null && parsed.spending != null) {
        return { income: Number(parsed.income), spending: Number(parsed.spending) };
      }
    } catch {}
    return null;
  });

  // On set: update localStorage
  useEffect(() => {
    if (userFinance) localStorage.setItem('goalie-user-finance', JSON.stringify(userFinance));
  }, [userFinance]);

  // =========== EXISTING STATE BELOW ===========
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

  // State: savings frequency (user preference, default unset)
  const [frequency, setFrequency] = useState(null);
  // Persist frequency to localStorage (single device memory)
  useEffect(() => {
    const savedFreq = localStorage.getItem('goalie-user-frequency');
    if (savedFreq && FREQUENCIES.some(f => f.value === savedFreq)) {
      setFrequency(savedFreq);
    }
  }, []);
  useEffect(() => {
    if (frequency) {
      localStorage.setItem('goalie-user-frequency', frequency);
    }
  }, [frequency]);
  // State: trigger frequency modal on start or on user request
  const [showFreqModal, setShowFreqModal] = useState(false);
  useEffect(() => {
    if (!frequency) setShowFreqModal(true);
  }, [frequency]);
  const startEditFrequency = () => setShowFreqModal(true);

  // --- Income & Available Savings Logic ---

  // Display modal until both userFinance and frequency selected
  const needsUserFinance = !userFinance || userFinance.income === 0;

  // If either unset, block app with modal
  if (needsUserFinance) {
    return (
      <IncomeSpendingModal
        show={true}
        onSave={(income, spending) => setUserFinance({ income, spending })}
        incomeDefault={userFinance?.income}
        spendingDefault={userFinance?.spending}
        colors={COLORS}
      />
    );
  }

  // Derived: available savings per month
  const availableSavings = Math.max(0, (userFinance.income || 0) - (userFinance.spending || 0));

  // Helper: frequency multiplier (converts 'per month' to per frequency)
  // For splitting monthly available savings into per-frequency intervals
  function frequencyToPeriodsPerMonth(type) {
    switch (type) {
      case "day":   return 30;
      case "week":  return 4.345; // avg weeks per month
      case "month": return 1;
      default: return 1;
    }
  }

  // -- Distribute available savings equally across all "active" goals
  // (If prioritization: TODO, for now treat all as active, equally)
  const activeGoals = goals.length === 0 ? [] : goals.filter(g => (g.target > g.current));
  const perGoalMonthly = activeGoals.length > 0 ? availableSavings / activeGoals.length : 0;

  // For each goal: convert per-goal monthly savings to per period, per frequency
  function getPerGoalPerPeriodAmount(goal) {
    if (!frequency) return null;
    // Amount left to save for this goal
    const goalLeft = Math.max(0, goal.target - goal.current);
    // Split monthly available *equally* across all active goals
    const periodsInMonth = frequencyToPeriodsPerMonth(frequency);
    // If perGoalMonthly > what's needed for this goal, limit by target (prefer not to over-allocate)
    const perPeriodBase = perGoalMonthly / periodsInMonth;

    // For this period, choose the min needed so not to "over-save" when close to goal
    // But don't go below 0. (per period should never be more than what's left for the goal)
    const remainingPeriods = calculatePeriodsLeft(goal);

    // Projected remaining per-period needed to complete goal in time
    const projectedPerPeriod = goalLeft / remainingPeriods;
    // We recommend the smaller: what user can afford (based on income/other goals), or what is needed to stay on target for the deadline
    return Math.round(Math.min(perPeriodBase, projectedPerPeriod)*100)/100;
  }

  // --- Core Handlers ---
  function handleCreateGoal(e) {
    e.preventDefault();
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

  function handleDeleteGoal(id) {
    setGoals(goals.filter(goal => goal.id !== id));
    if (selectedGoal && selectedGoal.id === id) setSelectedGoal(null);
  }

  function handleAddSavings(goalId, amount) {
    setGoals(goals.map(goal => goal.id === goalId
      ? { ...goal, current: Math.min(goal.target, goal.current + Number(amount)) }
      : goal
    ));
  }

  function handleSelectGoal(goal) {
    setSelectedGoal(goal);
  }
  function handleCloseGoalDetail() {
    setSelectedGoal(null);
  }
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
  // Calculate number of periods left for a goal
  function calculatePeriodsLeft(goal) {
    const now = new Date();
    const end = new Date(goal.deadline);
    if (isNaN(end.getTime()) || now > end) return 1;
    // Calculate the difference in selected frequency
    const ms = end - now;
    switch (frequency) {
      case 'day':
        return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
      case 'week':
        return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24 * 7)));
      case 'month':
        return Math.max(1, Math.ceil(
          (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth())
          + (end.getDate() >= now.getDate() ? 0 : -1)
        ) + 1);
      default:
        return 1;
    }
  }
  // Frequency display label
  function getPeriodLabel() {
    const freq = FREQUENCIES.find(f => f.value === frequency);
    return freq ? freq.label.toLowerCase() : '';
  }

  // --- Modal for Frequency Selection ---
  function FrequencyModal({ show, frequency, setFrequency, onClose }) {
    if (!show) return null;
    return (
      <div className="modal-backdrop" style={{zIndex: 199}}>
        <div className="modal-content" style={{
          boxShadow: "0 12px 49px 0 rgba(17,54,120,0.19)",
          border: "2.2px solid var(--base-light)",
          background: "linear-gradient(120deg,#fff 87%,#e9f8fb 100%)",
          minWidth: 210,
          maxWidth: 355,
          padding: "39px 30px 24px 29px"
        }}>
          <h2 style={{
            margin:"0 0 17px 0",
            color: "var(--base-dark)",
            fontWeight: 700,
            fontFamily: '"Quicksand","Inter",sans-serif'
          }}>
            Choose your savings frequency
          </h2>
          <div style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 17
          }}>
            How often do you want to track your savings towards your goals?
            <br />
            <span style={{
              fontSize:13, color: "var(--text-secondary)", fontWeight: 400
            }}>
              (You can change this anytime in the dashboard)
            </span>
          </div>
          <div style={{display: 'flex', justifyContent:'center', gap: 14, marginBottom: 20}}>
            {FREQUENCIES.map(opt => (
              <button
                key={opt.value}
                className="btn"
                style={{
                  background: frequency === opt.value
                    ? "linear-gradient(100deg, var(--base-dark) 70%, var(--base-light) 120%)"
                    : "linear-gradient(95deg,var(--base-light) 75%,#d2ecfa 110%)",
                  color: frequency === opt.value ? "#fff" : "#336",
                  fontWeight: frequency === opt.value ? 800 : 600,
                  padding: "13px 23px",
                  fontSize: "1.08rem",
                  borderRadius: 26,
                  outline: frequency === opt.value ? "2.5px solid var(--base-dark)" : "",
                  border: "none",
                  boxShadow: frequency === opt.value ? "0 0 0 2px #c2e4fc73" : "0 1px 10px #c6ddfa12",
                  transition: "background 0.17s, box-shadow 0.18s"
                }}
                onClick={() => setFrequency(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{margin: "6px 0"}}>
            <button
              className="btn"
              style={{
                background: "linear-gradient(94deg, #bad5fc 55%, var(--base-dark) 130%)",
                color: "#fff",
                fontSize: 15,
                marginTop: 6,
                padding: '10px 26px',
                borderRadius: 26,
                fontWeight: 700,
                opacity: frequency ? 1 : 0.7
              }}
              onClick={frequency ? onClose : undefined}
              disabled={!frequency}
            >Start Tracking</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main ---
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
      {/* Frequency Modal */}
      <FrequencyModal
        show={showFreqModal}
        frequency={frequency}
        setFrequency={(freq) => {
          setFrequency(freq);
        }}
        onClose={() => setShowFreqModal(false)}
      />

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
          boxShadow: '0 0 8px rgba(64,148,230,0.07)',
          display: 'flex',
          alignItems: 'center'
        }}>
        <span style={{letterSpacing: 1, display: 'flex', alignItems: 'center'}}>
          <span style={{
                marginRight: 12,
                color: COLORS.secondary,
                fontWeight: 900,
                fontSize: '1.4em'
              }}>🥅</span>
          <span>Goalie</span>
        </span>
        <span style={{
          marginLeft: 'auto',
          fontWeight: 400,
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.90)'
        }}>
          Savings Goal Companion
        </span>
        <button
          style={{
            ...btnStyle,
            marginLeft: 22,
            background: COLORS.secondary,
            color: "#fff",
            fontSize: 14,
            padding: "7px 14px"
          }}
          onClick={startEditFrequency}
        >Change Frequency</button>
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
            color: COLORS.accent
          }}>
            Goalie: Personal savings goals, made visual & fun
          </h1>
          <div style={{color: COLORS.textSecondary, maxWidth: 700, margin: '16px 0', fontSize: "1.1em"}}>
            Set your dreams, track savings progress with visual pie charts, build great habits—no bank details required!
          </div>
        </section>

        {/* Available Savings Summary */}
        <div style={{
          marginBottom: 32, display:"flex", alignItems:"center", gap:22, flexWrap:"wrap"
        }}>
          <div style={{
            background:COLORS.card, color: COLORS.text, borderRadius: 9,
            border: `1.5px solid ${COLORS.secondary}`,
            padding: "16px 34px 14px 20px", fontWeight:500, fontSize: 16,
            boxShadow:"0 1px 10px 0 rgba(60,180,215,0.07)"
          }}>
            <span style={{color:COLORS.secondary, fontWeight: 800}}>₹{userFinance.income}</span> income / 
            <span style={{color:"#c45252", fontWeight: 600}}>₹{userFinance.spending}</span> spending. 
            <span style={{
              color: availableSavings > 0 ? COLORS.primary : "#a88",
              fontWeight: availableSavings > 0 ? 700 : 500,
              marginLeft: 18
            }}>
              You can save: <b>₹{availableSavings}</b> /month
            </span>
          </div>
          <button
            style={{
              ...btnStyle, background:COLORS.secondary, color:"#fff", padding:"9px 17px", fontSize:15
            }}
            onClick={() => {
              // Reset for re-prompt
              setUserFinance(null);
            }}
          >Edit income/spending</button>
        </div>
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
              {frequency &&
                <span style={{
                  marginLeft: 12,
                  color: COLORS.textSecondary,
                  fontWeight: 400,
                  fontSize: 17
                }}>
                  (Showing suggested <b>{getPeriodLabel()}</b> savings per goal)
                </span>}
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
                  perPeriod={frequency ? getPerGoalPerPeriodAmount(goal) : null}
                  periodLabel={getPeriodLabel()}
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
        color: COLORS.accent,
        background: "#eaf4ff",
        fontSize: '1em',
        borderTop: `1.5px solid ${COLORS.border}`,
        marginTop: 30
      }}>
        Goalie &middot; Track savings visually &middot; No bank account needed &middot; For students & dreamers
      </footer>
    </div>
  );
}

/**
 * GoalCard: Shows progress and dynamic per-period suggestions
 */
function GoalCard({ goal, progress, perPeriod, periodLabel, onAddSavings, onDelete, onViewDetails, accent, primary, secondary, cardColor }) {
  const [amount, setAmount] = useState('');

  // PieChart always active/visible for all goals
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
      <div style={{display:"flex", alignItems: "center", gap: 12, marginBottom: 4, marginTop: 2}}>
        <ProgressBar percentage={progress} primary={primary} />
        {/* PieChart is ALWAYS visible, and updates live */}
        <PieChart
          percentage={progress}
          size={36}
          primary={primary}
          secondary={secondary}
        />
      </div>
      <div style={{
        color:'#247', fontWeight:600, margin: '7px 0', fontSize:15.3
      }}>
        Saved: ₹{goal.current} / {goal.target}
      </div>
      {/* Per-period savings, improved explanation */}
      <div style={{
        color: secondary,
        background: "#f3faff",
        border: `1px solid ${secondary}44`,
        fontWeight: 500,
        fontSize: 14.4,
        borderRadius: 7,
        margin: "5px 0 2px 0",
        padding: "6px 12px",
        textAlign: "left",
        display: "inline-block",
        width: "fit-content"
      }}>
        {perPeriod != null
          ? <>Recommended per {periodLabel} saving: <b>₹{perPeriod}</b></>
          : <>Set a frequency to get per-period amount!</>
        }
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
        <button
          onClick={onViewDetails}
          style={{
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
    <div className="progress-bar-bg" style={{
      width: '100%',
      height: 12,
      background: "#e9f4fc",
      borderRadius: 9,
      marginBottom: 7,
      position: "relative",
      boxShadow: "0 1px 6px #b6d6ea2c"
    }}>
      <div className="progress-bar-fill"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(95deg, ${primary} 60%, #bfeeff 98%)`,
          height: "100%",
          borderRadius: 9,
          transition: "width 0.46s cubic-bezier(.53,1.32,.33,.87),background 0.20s"
        }}
      />
    </div>
  );
}

// PIE CHART COMPONENT (SVG)
// PUBLIC_INTERFACE
function PieChart({ percentage, size = 44, primary, secondary }) {
  // Modern pastel+highlight donut visualization
  const r = size / 2 - 7;
  const circ = 2 * Math.PI * r;
  const prog = Math.max(0, Math.min(percentage, 100));
  const offset = circ * (1 - prog / 100);

  return (
    <div
      className="pie-chart"
      style={{
        width: size + 12,
        height: size + 12,
        display: "inline-block",
        background: "linear-gradient(120deg,#f7fbfe 65%,#b3eafd 100%)",
        borderRadius: "50%",
        boxShadow: "0 1px 8px 0 #8ed9f112"
      }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track circle background */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke="#e3f2fa"
          strokeWidth="8"
          opacity={0.53}
        />
        {/* Progress ring */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke={`url(#pie-gradient)`}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{
            filter: "drop-shadow(0 1px 7px #b9eaff30)"
          }}
        />
        <defs>
          <linearGradient id="pie-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          fontSize={size * 0.31}
          fill={primary}
          fontWeight="700"
          style={{
            fontFamily: '"Quicksand","Inter",sans-serif',
            textShadow: "0 2px 8px #b7e0fa26"
          }}
        >
          {`${prog}%`}
        </text>
      </svg>
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
