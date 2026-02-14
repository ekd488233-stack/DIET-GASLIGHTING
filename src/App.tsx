import { useState, useEffect } from 'react';
import { Upload, Calendar as CalendarIcon, Flame, User, PlayCircle, X, Zap, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeMealImages, MealAnalysis } from './lib/openai';

interface DailyLog {
    date: string;
    mealType: string;
    analysis: MealAnalysis;
}

const MEAL_TYPES = ['아침', '점심', '저녁', '간식', '야식'];

export default function App() {
    const [images, setImages] = useState<string[]>([]);
    const [mealType, setMealType] = useState('아침');
    const [profile, setProfile] = useState({ age: '20대', gender: '여성' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MealAnalysis | null>(null);
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState<'calendar' | 'details'>('calendar');

    useEffect(() => {
        const saved = localStorage.getItem('diet_logs');
        if (saved) setLogs(JSON.parse(saved));
    }, []);

    const getDaysInMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFormattedDate = (day: number) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-${String(day).padStart(2, '0')}`;
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, 3 - images.length);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const startAnalysis = async () => {
        if (images.length === 0) return;
        setLoading(true);
        try {
            const base64s = images.map(img => img.split(',')[1]);
            const data = await analyzeMealImages(base64s, profile, mealType);
            setResult(data);

            const newLog = {
                date: new Date().toISOString().split('T')[0],
                mealType,
                analysis: data
            };
            const updatedLogs = [...logs, newLog];
            setLogs(updatedLogs);
            localStorage.setItem('diet_logs', JSON.stringify(updatedLogs));
        } catch (err) {
            console.error(err);
            alert('분석 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const updateItemName = (idx: number, newName: string) => {
        if (!result) return;
        const newItems = [...result.items];
        newItems[idx].name = newName;
        setResult({ ...result, items: newItems });
    };

    const filteredLogs = logs.filter(log => log.date === selectedDate);

    const resetApp = () => {
        setImages([]);
        setMealType('아침');
        setResult(null);
        setShowCalendar(false);
        setEditingIdx(null);
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setViewMode('calendar');
    };

    return (
        <div className="premium-container">
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1
                        onClick={resetApp}
                        style={{ fontSize: '4.5rem', fontWeight: 900, margin: '1rem 0', background: 'linear-gradient(to right, #ff9aa2, #fdfd96, #b2e2f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-4px', fontFamily: "'Playfair Display', serif", cursor: 'pointer' }}
                    >
                        DIET GASLIGHTING
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', fontWeight: 700 }}>파스텔 속에서 당신의 영혼을 털어버릴 달콤한 악마 😈</p>
                </motion.div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Left Side: Input & Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section className="glass-card">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', color: '#ff9aa2' }}>
                            <User size={24} /> PROFILE CHECK
                        </h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>지금 뭘 드시려고요? (혹은 드셨나요?)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {MEAL_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setMealType(type);
                                            setImages([]);
                                            setResult(null);
                                        }}
                                        style={{
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '16px',
                                            border: '3px solid',
                                            borderColor: mealType === type ? '#ff9aa2' : '#f0f0f0',
                                            background: mealType === type ? '#ff9aa2' : 'white',
                                            color: mealType === type ? 'white' : '#888',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 600 }}>연령대</label>
                                <select
                                    value={profile.age}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                    className="select-custom"
                                >
                                    {['10대', '20대', '30대', '40대', '50대 이상'].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 600 }}>성별</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    className="select-custom"
                                >
                                    <option value="남성">남성</option>
                                    <option value="여성">여성</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card" style={{ border: '4px solid #fdfd96' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#ff9aa2', fontSize: '1.2rem' }}>식단 증거 확보 (최대 3장)</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            {images.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: '2px solid #ffe5e5' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,154,162,0.8)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {images.length < 3 && (
                                <label style={{ cursor: 'pointer', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px dashed #ffe5e5', borderRadius: '16px', color: '#ffb7b2' }}>
                                    <input type="file" hidden multiple onChange={handleUpload} accept="image/*" />
                                    <Upload size={24} />
                                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>추가하기</span>
                                </label>
                            )}
                        </div>

                        {images.length > 0 && !loading && !result && (
                            <button className="btn-primary" style={{ width: '100%', background: 'var(--secondary)' }} onClick={startAnalysis}>
                                준엄한 팩폭 듣기 🔥
                            </button>
                        )}

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                                    <Zap size={40} color="#ff9aa2" />
                                </motion.div>
                                <p style={{ marginTop: '1rem', fontWeight: 700, color: '#ff9aa2' }}>AI가 독설을 장전하고 있습니다...</p>
                            </div>
                        )}
                    </section>

                    <button
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer', border: showCalendar ? '4px solid #ff9aa2' : '4px solid white', fontSize: '1.1rem', fontWeight: 800, color: showCalendar ? '#ff85a1' : '#ffb7b2' }}
                        onClick={() => {
                            setShowCalendar(!showCalendar);
                            setViewMode('calendar');
                        }}
                    >
                        <CalendarIcon size={24} />
                        GASLIGHTING LOG 📖
                    </button>
                </div>

                {/* Right Side: Results or Calendar */}
                <div style={{ position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {showCalendar ? (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-card"
                            >
                                {viewMode === 'calendar' ? (
                                    <>
                                        <h2 style={{ marginBottom: '2rem', color: '#b2e2f2' }}>HISTORY ({new Date().getMonth() + 1}월)</h2>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div className="calendar-grid" style={{ maxWidth: '300px', width: '100%' }}>
                                                {Array.from({ length: getDaysInMonth() }).map((_, i) => {
                                                    const d = i + 1;
                                                    const dateStr = getFormattedDate(d);
                                                    const hasLog = logs.some(l => l.date === dateStr);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="calendar-day"
                                                            onClick={() => {
                                                                setSelectedDate(dateStr);
                                                                setViewMode('details');
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                border: hasLog ? '2px solid #ffb7b2' : '2px solid #f0f0f0',
                                                                background: hasLog ? '#fff9f9' : 'white',
                                                                width: '40px',
                                                                height: '40px'
                                                            }}
                                                        >
                                                            {d}
                                                            {hasLog && <div style={{ position: 'absolute', bottom: '2px', width: '4px', height: '4px', background: '#ff9aa2', borderRadius: '50%' }} />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#ccc' }}>날짜를 클릭해 기록을 확인하세요.</p>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setViewMode('calendar')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#ff9aa2', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
                                        >
                                            <ChevronLeft size={20} /> 돌아가기
                                        </button>
                                        <h2 style={{ marginBottom: '1.5rem', color: '#ff9aa2' }}>{selectedDate}의 증거</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                            {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => (
                                                <div key={idx} style={{ padding: '1.2rem', background: 'white', borderRadius: '24px', border: '2px solid #f0f8ff' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                                        <span style={{ fontWeight: 900, color: '#ff9aa2', fontSize: '1.1rem' }}>{log.mealType}</span>
                                                        <span style={{ background: '#fdfd96', padding: '4px 12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900 }}>{log.analysis.total_kcal} kcal</span>
                                                    </div>
                                                    <div style={{ background: '#fff9f9', padding: '1rem', borderRadius: '16px', border: '1px solid #ffe5e5', marginBottom: '0.8rem' }}>
                                                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5a4a4a', lineHeight: 1.5 }}>"{log.analysis.fact_attack}"</p>
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {log.analysis.items.map((item, i) => (
                                                            <span key={i} style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '2px 8px', borderRadius: '8px', color: '#888' }}>
                                                                {item.name} ({item.kcal}k)
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                                    <p style={{ color: '#ccc', fontWeight: 800, fontSize: '1.1rem' }}>기록이 없습니다.<br />굶고 계신 건 아니죠? 😈</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                            >
                                {/* FACT ATTACK CARD */}
                                <div className="glass-card" style={{ background: '#ff9aa2', border: 'none', color: 'white', boxShadow: '0 20px 40px rgba(255, 154, 162, 0.4)', borderRadius: '32px' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                        <Zap size={28} /> 오늘의 팩트 폭격
                                    </h3>
                                    <p style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.6 }}>"{result.fact_attack}"</p>
                                </div>

                                <div className="glass-card" style={{ border: '4px solid #fff0f0' }}>
                                    <h2 style={{ color: '#ff85a1', marginBottom: '1.5rem', fontWeight: 900 }}>분석 리포트 ✨</h2>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>* 품명을 더블클릭하여 이름을 수정할 수 있습니다.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {result.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.7)', borderRadius: '20px', border: '2px solid #fff5f5' }}>
                                                {editingIdx === idx ? (
                                                    <input
                                                        autoFocus
                                                        value={item.name}
                                                        onChange={(e) => updateItemName(idx, e.target.value)}
                                                        onBlur={() => setEditingIdx(null)}
                                                        onKeyDown={(e) => e.key === 'Enter' && setEditingIdx(null)}
                                                        style={{
                                                            background: '#fff',
                                                            border: '2px solid #ff9aa2',
                                                            borderRadius: '8px',
                                                            padding: '4px 8px',
                                                            fontWeight: 600,
                                                            fontSize: '1rem',
                                                            width: '60%'
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        onDoubleClick={() => setEditingIdx(idx)}
                                                        style={{ fontWeight: 700, cursor: 'pointer', color: '#5a4a4a' }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                )}
                                                <span style={{ fontWeight: 800, color: '#ff9aa2', fontSize: '1.1rem' }}>{item.kcal} kcal</span>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255, 154, 162, 0.1)', borderRadius: '24px', marginTop: '1rem', border: '4px solid #ffb7b2' }}>
                                            <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>총 칼로리</span>
                                            <span style={{ fontWeight: 900, fontSize: '1.6rem', color: '#ff85a1' }}>{result.total_kcal} kcal</span>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '4px solid #fff0f0', marginTop: '2rem', paddingTop: '2rem' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#b2e2f2' }}>
                                            <Flame size={24} /> 반성하고 운동하세요
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {result.exercise_plan.map((ex, idx) => (
                                                <div key={idx} style={{ padding: '1.5rem', background: '#fdfd96', borderRadius: '24px', border: '2px solid white' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                                        <strong style={{ fontSize: '1.2rem', color: '#3a2a2a' }}>{ex.name}</strong>
                                                        <span style={{ color: '#ff85a1', fontWeight: 900 }}>{ex.duration} / {ex.sets}</span>
                                                    </div>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.video_search_term)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3a2a2a', textDecoration: 'none', fontSize: '1rem', marginTop: '1rem', fontWeight: 800, background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', textAlign: 'center', justifyContent: 'center' }}
                                                    >
                                                        <PlayCircle size={20} /> 영상으로 속죄하기
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-card" style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffb7b2', border: '4px dashed #ffe5e5', borderRadius: '40px' }}>
                                <Zap size={60} style={{ marginBottom: '2rem', opacity: 0.3 }} />
                                <p style={{ fontWeight: 800, fontSize: '1.2rem', textAlign: 'center' }}>당신이 먹어치운 것들의<br />잔혹한 증거가 이곳에 출력됩니다.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .select-custom {
          width: 100%;
          padding: 1rem;
          background: #fff;
          border: 3px solid #ffe5e5;
          border-radius: 16px;
          color: #555;
          outline: none;
          font-weight: 700;
          font-size: 1rem;
        }
      `}</style>
        </div>
    );
}
