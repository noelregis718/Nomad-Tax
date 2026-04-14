import React, { useState, useMemo } from 'react';
import { 
  Download, Upload, ShieldCheck, FileText, CheckCircle, 
  Clock, Calendar as CalendarIcon, AlertTriangle, History, Link2, Zap, Globe, FlaskConical, ChevronLeft, ChevronRight, X, PlusCircle,
  Briefcase, Heart, Plane, Check, ChevronDown, Plus, Milestone
} from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Audit = () => {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recordedStays, setRecordedStays] = useState({}); // Key: YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(null);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vaultFiles, setVaultFiles] = useState([]);
  const [dueDates, setDueDates] = useState({}); // Key: YYYY-MM-DD, Value: { title, type }
  const [entryType, setEntryType] = useState('stay'); // 'stay' or 'deadline'
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [taxTodos, setTaxTodos] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [quickEntry, setQuickEntry] = useState({ country: '', expense: '', category: 'Work' });

  // --- Calendar Logic ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    // Current month days
    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr });
    }
    return days;
  }, [currentDate]);

  const handleDayClick = (dateStr) => {
    if (!dateStr) return;
    setSelectedDate(dateStr);
    
    // Priority: If stay exists, default to 'stay' tab, else if deadline exists, default to 'deadline'
    const existingStay = recordedStays[dateStr];
    const existingDeadline = dueDates[dateStr];
    
    if (existingStay) {
      setEntryType('stay');
      setQuickEntry(existingStay);
      setMilestoneTitle(existingDeadline?.title || '');
    } else if (existingDeadline) {
      setEntryType('deadline');
      setMilestoneTitle(existingDeadline.title);
      setQuickEntry({ country: '', expense: '', category: 'Work' });
    } else {
      setEntryType('stay');
      setQuickEntry({ country: '', expense: '', category: 'Work' });
      setMilestoneTitle('');
    }
    
    setShowQuickModal(true);
  };

  const saveEntry = () => {
    if (entryType === 'stay') {
      setRecordedStays({
        ...recordedStays,
        [selectedDate]: quickEntry
      });
    } else {
      setDueDates({
        ...dueDates,
        [selectedDate]: { title: milestoneTitle, type: 'TAX' }
      });
    }
    setShowQuickModal(false);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // Stats Integration
  const monthlySpend = useMemo(() => {
    const monthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return Object.entries(recordedStays)
      .filter(([date]) => date.startsWith(monthPrefix))
      .reduce((acc, [_, data]) => acc + (parseInt(data.expense) || 0), 0);
  }, [recordedStays, currentDate]);

  const schengenUsed = useMemo(() => {
    return Object.values(recordedStays).length; // Simplified for demo
  }, [recordedStays]);

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: newTodoText,
      done: false
    };
    setTaxTodos([...taxTodos, newTodo]);
    setNewTodoText('');
    setShowTodoModal(false);
  };

  return (
    <Layout 
      title="Compliance Roadmap" 
      subtitle="Your step-by-step journey to global residency and audit safety."
    >
      <div className="audit-top-layout">
        <div className="calendar-main-section">
          {/* Calendar Section */}
          <div className="glass-card calendar-hero-card">
            <div className="calendar-header">
              <div className="month-display">
                <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <span className="monthly-ticker">Monthly Spend: ₹{monthlySpend.toLocaleString('en-IN')}</span>
              </div>
              <div className="calendar-nav">
                <button onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
                <button onClick={() => setCurrentDate(new Date())} className="today-btn">Today</button>
                <button onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="calendar-grid-labels">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((dateObj, i) => {
                const isRecorded = dateObj.date && recordedStays[dateObj.date];
                const isDeadline = dateObj.date && dueDates[dateObj.date];
                const isToday = dateObj.date === new Date().toISOString().split('T')[0];
                
                return (
                  <div 
                    key={i} 
                    className={`day-cell ${!dateObj.day ? 'empty' : ''} ${isRecorded ? 'has-data' : ''} ${isToday ? 'today' : ''} ${isDeadline ? 'has-deadline' : ''}`}
                    onClick={() => handleDayClick(dateObj.date)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="day-num">{dateObj.day}</span>
                      {isDeadline && <span className="day-due-badge">DUE</span>}
                    </div>
                    {isRecorded && (
                      <div className="day-data">
                        <span className="entry-loc">{recordedStays[dateObj.date].country}</span>
                        <span className="entry-amt">₹{recordedStays[dateObj.date].expense}</span>
                      </div>
                    )}
                    {isDeadline && !isRecorded && (
                      <div className="deadline-preview">
                        {dueDates[dateObj.date].title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="vault-sidebar-section">
          {/* Functional Document Vault */}
          <div className="glass-card sidebar-vault-card">
            <div className="vault-header">
              <h3>Document Vault</h3>
              <div className="vault-stats-mini">
                <span>{vaultFiles.length} {vaultFiles.length === 1 ? 'Doc' : 'Docs'}</span>
                {vaultFiles.length > 0 && <span className="dot safe"></span>}
              </div>
            </div>

            <div className="vault-search">
              <input type="text" placeholder="Search documents..." className="vault-mini-input" />
            </div>

            <div className="vault-file-list flex-1">
              {vaultFiles.length === 0 ? (
                <div className="empty-vault-state">
                  <p>Your vault is empty.</p>
                  <span>Upload documents for audit readiness.</span>
                </div>
              ) : (
                vaultFiles.map((file, idx) => (
                  <div key={idx} className="vault-file-item">
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-meta">{file.type} • {file.date}</span>
                    </div>
                    <span className="dot safe"></span>
                  </div>
                ))
              )}
            </div>

            <div className="vault-actions">
              <input 
                type="file" 
                id="vault-upload" 
                multiple 
                hidden 
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const newFiles = files.map(f => ({
                    name: f.name,
                    type: f.type.split('/')[1]?.toUpperCase() || 'FILE',
                    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  }));
                  setVaultFiles([...vaultFiles, ...newFiles]);
                }}
              />
              <button 
                className="btn btn-secondary btn-full" 
                onClick={() => document.getElementById('vault-upload').click()}
              >
                Upload Document
              </button>
            </div>

            <div className="vault-footer" style={{ marginTop: 'auto' }}>
              <button className="btn btn-primary btn-full-text" style={{ marginTop: '1rem' }}>
                Generate Auditor PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="audit-bottom-layout">
        {/* Tax Compliance Roadmap (Primary Focus) */}
        <div className="glass-card audit-task-card single-focus-card">
          <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div className="title-area">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0 }}>Personal Compliance Roadmap</h3>
              </div>
              <p className="subtitle-dim">Manage your personalized audit-readiness journey.</p>
            </div>
            <div className="actions-area">
              <span className="task-count">{taxTodos.filter(t => t.done).length}/{taxTodos.length} Completed</span>
              <button className="add-task-btn" onClick={() => setShowTodoModal(true)}>
                <Plus size={18} />
                <span>Add Task</span>
              </button>
            </div>
          </div>
          
          <div className="task-grid-view">
            {taxTodos.length === 0 ? (
              <div className="empty-tasks-state">
                <p>No tasks yet.</p>
                <span>Click "Add Task" to start building your audit defense.</span>
              </div>
            ) : (
              taxTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className={`task-item ${todo.done ? 'completed' : ''}`}
                  onClick={() => setTaxTodos(taxTodos.map(t => t.id === todo.id ? {...t, done: !t.done} : t))}
                >
                  <div className="task-check">
                    {todo.done ? <Check size={14} /> : null}
                  </div>
                  <span>{todo.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showTodoModal && (
          <div className="modal-overlay" onClick={() => setShowTodoModal(false)}>
            <motion.div 
              className="glass-card quick-modal" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header">
                <div className="header-text">
                  <h3>New Compliance Task</h3>
                  <p className="modal-date-subtitle">Define a new requirement for your audit vault.</p>
                </div>
                <button className="close-txt-btn" onClick={() => setShowTodoModal(false)}>Close</button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <label>Task Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Upload Q4 Bangalore Rental Agreement"
                    value={newTodoText}
                    onChange={e => setNewTodoText(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <button 
                className="btn btn-primary btn-full-text" 
                onClick={addTodo}
                disabled={!newTodoText.trim()}
              >
                Create Task
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Entry Modal */}
      <AnimatePresence>
        {showQuickModal && (
          <div className="modal-overlay" onClick={() => setShowQuickModal(false)}>
            <motion.div 
              className="glass-card quick-modal" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header">
                <div className="header-text">
                  <h3>Intelligence Entry</h3>
                  <p className="modal-date-subtitle">{selectedDate}</p>
                </div>
                <button className="close-txt-btn" onClick={() => setShowQuickModal(false)}>Close</button>
              </div>

              <div className="entry-type-tabs">
                <button 
                  className={`type-tab-btn ${entryType === 'stay' ? 'active' : ''}`}
                  onClick={() => setEntryType('stay')}
                >
                  <Plane size={16} />
                  <span>Presence</span>
                </button>
                <button 
                  className={`type-tab-btn ${entryType === 'deadline' ? 'active' : ''}`}
                  onClick={() => setEntryType('deadline')}
                >
                  <AlertTriangle size={16} />
                  <span>Tax Due Date</span>
                </button>
              </div>

              <div className="modal-body">
                {entryType === 'stay' ? (
                  <>
                    <div className="input-group">
                      <label>Country / City</label>
                      <input 
                        type="text" 
                        value={quickEntry.country} 
                        onChange={e => setQuickEntry({...quickEntry, country: e.target.value})} 
                        placeholder="e.g. Lisbon, Portugal"
                      />
                    </div>
                    <div className="input-group" style={{ marginTop: '1rem' }}>
                      <label>Expense (INR)</label>
                      <input 
                        type="number" 
                        value={quickEntry.expense} 
                        onChange={e => setQuickEntry({...quickEntry, expense: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="input-group" style={{ marginTop: '1rem' }}>
                      <label>Category</label>
                      <div className="modern-classic-dropdown">
                        <button 
                          className="dropdown-trigger" 
                          onClick={(e) => {
                            e.preventDefault();
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                        >
                          <span>{quickEntry.category || 'Select Category'}</span>
                          <ChevronDown size={16} className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div 
                              className="dropdown-menu"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {['Work', 'Personal', 'Transition'].map(opt => (
                                <div 
                                  key={opt} 
                                  className={`dropdown-item ${quickEntry.category === opt ? 'active' : ''}`}
                                  onClick={() => {
                                    setQuickEntry({...quickEntry, category: opt});
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {opt}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="input-group">
                    <label>Deadline Description</label>
                    <input 
                      type="text" 
                      value={milestoneTitle} 
                      onChange={e => setMilestoneTitle(e.target.value)} 
                      placeholder="e.g. VAT Filing Deadline"
                      autoFocus
                    />
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-full-text" onClick={saveEntry}>
                Save to Calendar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .audit-top-layout {
          display: grid; 
          grid-template-columns: 4fr 1fr; 
          gap: 2rem;
          align-items: stretch;
          margin-bottom: 2rem;
        }

        .calendar-main-section, .vault-sidebar-section { min-width: 0; }
        
        .calendar-hero-card { padding: 2.5rem; height: 100%; margin: 0; }
        .sidebar-vault-card { padding: 1.75rem; display: flex; flex-direction: column; gap: 1.5rem; height: 100%; }

        .vault-header { display: flex; justify-content: space-between; align-items: center; }
        .vault-header h3 { font-size: 1.15rem; font-weight: 800; margin: 0; color: #1e293b; }
        .vault-stats-mini { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); }

        .vault-mini-input { 
          width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 10px; 
          font-size: 0.85rem; font-weight: 600; background: #f8fafc;
        }

        .vault-file-list { 
          display: flex; 
          flex-direction: column; 
          gap: 0.5rem; 
          flex: 1; 
          overflow-y: auto; 
          min-height: 200px;
        }
        .empty-vault-state { 
          text-align: center; padding: 2rem 1rem; border: 1.5px dashed #f1f5f9; border-radius: 12px;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .empty-vault-state p { margin: 0; font-size: 0.9rem; font-weight: 800; color: #1e293b; }
        .empty-vault-state span { font-size: 0.75rem; color: #94a3b8; font-weight: 600; line-height: 1.4; }
        
        .vault-file-item { 
          display: flex; justify-content: space-between; align-items: center; padding: 0.825rem; 
          background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; transition: all 0.2s;
        }
        .vault-file-item:hover { background: white; border-color: var(--primary); transform: translateX(2px); }
        .file-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
        .file-name { font-size: 0.825rem; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-meta { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }

        .btn-full { width: 100%; text-align: center; padding: 0.85rem; font-size: 0.85rem; }

        .calendar-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .month-display h3 { font-size: 1.75rem; font-weight: 800; margin: 0; }
        .monthly-ticker { font-size: 0.9rem; color: var(--primary); font-weight: 700; }
        
        .calendar-nav { display: flex; gap: 0.5rem; align-items: center; }
        .calendar-nav button { background: #f1f5f9; border: none; padding: 0.5rem; border-radius: 8px; cursor: pointer; display: flex; }
        .calendar-nav .today-btn { font-size: 0.8rem; font-weight: 700; padding: 0.5rem 1rem; }

        .calendar-grid-labels { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 1rem; }
        .calendar-grid-labels span { text-align: center; color: var(--text-dim); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }

        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        .day-cell { 
          min-height: 100px; padding: 0.75rem; border: 0.5px solid #f1f5f9; background: white; 
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .day-cell:hover { background: #f8fafc; }
        .day-cell.empty { background: #fafafa; cursor: default; }
        .day-cell.has-data { background: #f0f9ff; border-color: #bae6fd; }
        .day-cell.today { border: 2px solid var(--primary); z-index: 10; }

        .day-num { font-size: 0.9rem; font-weight: 700; color: #64748b; }
        .day-due-badge { 
          background: #ffe4e6; color: #e11d48; font-size: 0.65rem; font-weight: 850; 
          padding: 2px 6px; border-radius: 4px; letter-spacing: 0.02em;
        }

        .day-data { display: flex; flex-direction: column; margin-top: 0.5rem; gap: 0.25rem; }
        .deadline-preview { 
          margin-top: 0.5rem; font-size: 0.65rem; font-weight: 750; color: #e11d48; 
          background: #fff1f2; padding: 4px 6px; border-radius: 6px; border-left: 2.5px solid #e11d48;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .entry-type-tabs { 
          display: flex; gap: 6px; background: #f1f5f9; padding: 6px; border-radius: 12px; margin-bottom: 1.5rem; 
        }
        .type-tab-btn { 
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; 
          padding: 0.75rem; border: none; border-radius: 9px; font-size: 0.85rem; font-weight: 750; 
          cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b;
        }
        .type-tab-btn.active { background: white; color: var(--primary); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

        .day-cell.has-deadline { border-top: 3px solid #fb7185; }
        .day-cell.has-data.has-deadline { background: linear-gradient(135deg, #f0f9ff 70%, #fff1f2 100%); }

        .entry-loc { font-size: 0.7rem; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .entry-amt { font-size: 0.65rem; color: var(--primary); font-weight: 700; }

        .audit-bottom-layout { width: 100%; margin-top: 2rem; }
        .single-focus-card { padding: 2.5rem; }
        
        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .title-area h3 { font-size: 1.35rem; font-weight: 800; color: #1e293b; margin: 0; }
        .subtitle-dim { font-size: 0.9rem; color: #64748b; font-weight: 600; margin: 0.25rem 0 0; }

        .actions-area { display: flex; align-items: center; gap: 1.5rem; }
        .task-count { font-size: 0.85rem; font-weight: 750; color: var(--primary); background: #f0fdf4; padding: 0.45rem 1rem; border-radius: 30px; }

        .add-task-btn { 
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; 
          background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; 
          font-weight: 750; color: #475569; cursor: pointer; transition: all 0.2s;
        }
        .add-task-btn:hover { background: var(--primary); border-color: var(--primary); color: white; transform: translateY(-2px); }

        .task-grid-view { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 1.25rem; 
        }

        .empty-tasks-state { 
          grid-column: span 2; text-align: center; padding: 4rem 2rem; 
          border: 1.5px dashed #f1f5f9; border-radius: 16px; display: flex; flex-direction: column; gap: 0.5rem;
        }
        .empty-tasks-state p { margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; }
        .empty-tasks-state span { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }

        .task-item { 
          display: flex; align-items: center; gap: 1rem; padding: 1.15rem; background: #f8fafc; 
          border-radius: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1.5px solid transparent;
        }
        .task-item:hover { background: white; border-color: #e2e8f0; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .task-item.completed span { color: #94a3b8; text-decoration: line-through; font-weight: 500; }
        .task-check { 
          width: 20px; height: 20px; border: 2.5px solid #e2e8f0; border-radius: 7px; 
          display: flex; align-items: center; justify-content: center; background: white; flex-shrink: 0;
        }
        .task-item.completed .task-check { background: var(--primary); border-color: var(--primary); color: white; }

        .info-card h3 { font-size: 1rem; margin-bottom: 1.25rem; }
        .budget-mini .val { font-size: 1.5rem; font-weight: 800; }
        .budget-mini .bar { height: 6px; background: #f1f5f9; border-radius: 3px; margin: 0.5rem 0; }
        .budget-mini .fill { height: 100%; background: var(--primary); border-radius: 3px; }
        .hint { font-size: 0.75rem; color: var(--text-dim); line-height: 1.4; }

        .mini-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .m-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 600; color: var(--text-dim); }

        /* Modal Styles */
        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); 
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .quick-modal { 
          width: 100%; max-width: 400px; padding: 2.5rem; 
          background: white !important; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: none !important;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .header-text h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .modal-date-subtitle { margin: 0.25rem 0 0; font-size: 0.9rem; color: #64748b; font-weight: 600; }
        .modal-header button { background: #f8fafc; border: none; color: #64748b; cursor: pointer; padding: 0.5rem; border-radius: 50%; display: flex; }
        .modal-header button:hover { background: #f1f5f9; color: #0f172a; }
        .modal-body { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
        .input-group label { font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.6rem; display: block; text-transform: uppercase; letter-spacing: 0.025em; }
        .input-group input, .input-group select { 
          width: 100%; padding: 0.8rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-weight: 600; color: #1e293b;
          transition: all 0.2s;
        }
        .input-group input:focus {
          outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modern-classic-dropdown {
          position: relative;
          width: 100%;
        }
        .dropdown-trigger {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 650;
          color: #1e293b;
          transition: all 0.2s;
        }
        .dropdown-trigger:hover { border-color: #cbd5e1; background: white; }
        .dropdown-trigger .chevron { color: #94a3b8; transition: transform 0.2s; }
        .dropdown-trigger .chevron.open { transform: rotate(180deg); }

        .dropdown-menu {
          position: absolute;
          top: 110%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.15);
          z-index: 110;
          overflow: hidden;
        }
        .dropdown-item {
          padding: 0.85rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dropdown-item:hover { background: #f8fafc; color: var(--primary); padding-left: 1.5rem; }
        .dropdown-item.active { background: #eff6ff; color: var(--primary); }

        .close-txt-btn {
          background: #f1f5f9; border: none; padding: 0.5rem 1rem; border-radius: 8px;
          font-size: 0.8rem; font-weight: 700; color: #64748b; cursor: pointer;
        }
        .close-txt-btn:hover { background: #e2e8f0; color: #1e293b; }

        .dot { 
          width: 8px; height: 8px; border-radius: 50%; display: inline-block;
        }
        .dot.safe { background: #22c55e; }
        .dot.dim { background: #cbd5e1; }

        .health-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 600; }
      `}</style>
    </Layout>
  );
};

export default Audit;
