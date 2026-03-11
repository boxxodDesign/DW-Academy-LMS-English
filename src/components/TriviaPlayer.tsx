import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Trophy, Timer, ArrowRight } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface TriviaPlayerProps {
  questions: QuizQuestion[];
  onComplete: (score: number, time: number) => void;
}

export const TriviaPlayer: React.FC<TriviaPlayerProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (showResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, showResult]);

  const handleNext = () => {
    if (selectedOption === questions[currentIndex].respuesta_correcta) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      onComplete(Math.round(((score + (selectedOption === questions[currentIndex].respuesta_correcta ? 1 : 0)) / questions.length) * 100), totalTime);
    }
  };

  const currentQ = questions[currentIndex];

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
        <Trophy size={64} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>¡Trivia Completada!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Has obtenido un puntaje de:</p>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1rem' }}>
          {finalScore}%
        </div>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Finalizar y Salir
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={{ maxWidth: '600px', margin: '4rem auto', border: '1px solid var(--bg-tertiary)', padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pregunta {currentIndex + 1} de {questions.length}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 5 ? 'var(--error)' : 'var(--accent-primary)' }}>
          <Timer size={18} />
          <span style={{ fontWeight: 800 }}>{timeLeft}S</span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.75rem', marginBottom: '2.5rem', lineHeight: 1.3, color: 'white' }}>{currentQ.pregunta}</h3>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
        {currentQ.opciones.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedOption(idx)}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              background: selectedOption === idx ? 'rgba(225, 29, 72, 0.1)' : 'var(--bg-primary)',
              border: `1px solid ${selectedOption === idx ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
              color: selectedOption === idx ? 'white' : 'var(--text-secondary)',
              fontWeight: selectedOption === idx ? 700 : 500,
              transition: 'all 0.2s',
              fontSize: '0.95rem'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <button 
        className="btn-primary" 
        onClick={handleNext} 
        disabled={selectedOption === null}
        style={{ width: '100%', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: selectedOption === null ? 0.3 : 1, fontSize: '0.9rem' }}
      >
        SIGUIENTE PREGUNTA <ArrowRight size={20} />
      </button>
    </GlassCard>
  );
};
