'use client';

import { useState, useEffect, useRef } from 'react';

interface ClimateZone {
  type: string;
  x: number;
  y: number;
  size: number;
  direction?: string;
}

interface ClimateSystemProps {
  boardData: string[];
}

export default function ClimateSystem({ boardData }: ClimateSystemProps) {
  const [activeClimate, setActiveClimate] = useState<string | null>(null);
  const [climateDuration, setClimateDuration] = useState(5);
  const [remainingTime, setRemainingTime] = useState(0);
  const [climateZone, setClimateZone] = useState<ClimateZone | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [moveInterval, setMoveInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoMove, setAutoMove] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const climateTypes = {
    rain: { name: '🌧️ Chuva', color: '#2196f3', size: 4 },
    fog: { name: '🌫️ Nevoeiro', color: '#b0bec5', size: 6 },
    hurricane: { name: '🌪️ Furacão', color: '#673ab7', size: 1 },
    lightning: { name: '⚡ Raio', color: '#ffeb3b', size: 1 },
  };

  const directions = [
    { name: '↑ Para cima', value: 'up', emoji: '⬆️' },
    { name: '↓ Para baixo', value: 'down', emoji: '⬇️' },
    { name: '← Para esquerda', value: 'left', emoji: '⬅️' },
    { name: '→ Para direita', value: 'right', emoji: '➡️' },
  ];

  // Aplicar efeito climático
  const applyClimateEffect = (climate: string, duration: number) => {
    if (activeClimate) {
      removeClimateEffect();
    }

    setActiveClimate(climate);
    setRemainingTime(duration * 60); // Converter minutos para segundos

    // Gerar zona climática aleatória
    generateClimateZone(climate);

    // Iniciar timer
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          removeClimateEffect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);

    // Os efeitos visuais serão aplicados automaticamente pelo useEffect
    // quando climateZone for atualizado
  };

  // Aplicar efeito climático aleatório
  const applyRandomClimateEffect = () => {
    const climateKeys = Object.keys(climateTypes);
    const randomClimate = climateKeys[Math.floor(Math.random() * climateKeys.length)];
    applyClimateEffect(randomClimate, climateDuration);
  };

  // Remover efeito climático
  const removeClimateEffect = () => {
    setActiveClimate(null);
    setRemainingTime(0);
    setClimateZone(null);
    setAutoMove(false);

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (moveInterval) {
      clearInterval(moveInterval);
      setMoveInterval(null);
    }

    // Remover efeitos visuais
    removeVisualEffects();
  };

  // Gerar zona climática
  const generateClimateZone = (climate: string) => {
    const climateConfig = climateTypes[climate as keyof typeof climateTypes];
    const boardSize = 26;

    const zone: ClimateZone = {
      type: climate,
      // Permitir posições em qualquer lugar, incluindo posições que saem das bordas
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
      size: climateConfig.size,
      direction: directions[Math.floor(Math.random() * directions.length)].value,
    };

    setClimateZone(zone);
  };



  // Remover efeitos visuais
  const removeVisualEffects = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.classList.remove(
        'climate-effect-rain',
        'climate-effect-fog',
        'climate-effect-hurricane',
        'climate-effect-lightning'
      );
    });
  };

  // Verificar se célula está na zona climática (com wrap)
  const isInClimateZone = (row: number, col: number, zone: ClimateZone): boolean => {
    const boardSize = 26;
    
    // Para cada célula da zona, verificar com wrap
    for (let r = 0; r < zone.size; r++) {
      for (let c = 0; c < zone.size; c++) {
        // Calcular posição com wrap
        const zoneRow = (zone.y + r + boardSize) % boardSize;
        const zoneCol = (zone.x + c + boardSize) % boardSize;
        
        if (row === zoneRow && col === zoneCol) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Mover zona climática (com wrap suave célula por célula)
  const moveClimateZone = () => {
    if (!climateZone) return;

    const newZone = { ...climateZone };

    // Mover apenas uma célula por vez em cada direção
    // O wrap será tratado automaticamente pela função isInClimateZone
    switch (newZone.direction) {
      case 'up':
        newZone.y = newZone.y - 1;
        break;
      case 'down':
        newZone.y = newZone.y + 1;
        break;
      case 'left':
        newZone.x = newZone.x - 1;
        break;
      case 'right':
        newZone.x = newZone.x + 1;
        break;
    }

    setClimateZone(newZone);
    // Os efeitos visuais serão aplicados automaticamente pelo useEffect
  };

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // useEffect para aplicar efeitos visuais quando a zona climática muda
  useEffect(() => {
    if (climateZone && activeClimate) {
      // Remover efeitos anteriores
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell) => {
        cell.classList.remove(
          'climate-effect-rain',
          'climate-effect-fog',
          'climate-effect-hurricane',
          'climate-effect-lightning'
        );
      });

      // Aplicar novos efeitos
      cells.forEach((cell, index) => {
        const row = Math.floor(index / 26);
        const col = index % 26;

        if (isInClimateZone(row, col, climateZone)) {
          cell.classList.add(`climate-effect-${activeClimate}`);
        }
      });
    }
  }, [climateZone, activeClimate]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (moveInterval) {
        clearInterval(moveInterval);
      }
    };
  }, [timerInterval, moveInterval]);

  return (
    <div className="climate-controls">
      <h3>🌦️ Sistema Climático Dinâmico</h3>
      
      <div className="climate-options">
        <button
          className="climate-btn random"
          onClick={applyRandomClimateEffect}
          disabled={!!activeClimate}
          style={{
            background: 'var(--color-dark)',
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '10px',
            width: '100%'
          }}
        >
          🎲 Evento Climático Aleatório
        </button>
        
        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {Object.entries(climateTypes).map(([key, climate]) => (
            <button
              key={key}
              className={`climate-btn ${key}`}
              onClick={() => applyClimateEffect(key, climateDuration)}
              disabled={activeClimate === key}
            >
              {climate.name}
            </button>
          ))}
        </div> */}
      </div>

      <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="climateDuration">Duração (minutos):</label>
        <input
          id="climateDuration"
          type="number"
          min="1"
          max="60"
          value={climateDuration}
          onChange={(e) => setClimateDuration(parseInt(e.target.value) || 1)}
          style={{ 
            padding: '5px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            width: '60px'
          }}
        />
        {activeClimate && (
          <button
            className="remove-climate"
            onClick={removeClimateEffect}
          >
            ❌ Remover Clima
          </button>
        )}
      </div>

      {activeClimate && (
        <div className="active-climate">
          <strong>Clima Ativo:</strong> {climateTypes[activeClimate as keyof typeof climateTypes].name}
          <div className="timer">
            ⏱️ Tempo Restante: {formatTime(remainingTime)}
          </div>
          {climateZone && (
            <div style={{ marginTop: '10px' }}>
              <strong>Zona Climática:</strong> Tamanho {climateZone.size}x{climateZone.size}, 
              Centro aproximado: Linha {((climateZone.y % 26) + 26) % 26 + 1}, 
              Coluna {String.fromCharCode(65 + (((climateZone.x % 26) + 26) % 26))}
              <br />
              <strong>Direção:</strong> {directions.find(d => d.value === climateZone.direction)?.emoji} {directions.find(d => d.value === climateZone.direction)?.name}
              <div style={{ marginLeft: '10px', display: 'flex', gap: '5px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={moveClimateZone}
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  🏃 Mover Zona
                </button>
                <button
                  className={`btn ${autoMove ? 'btn-warning' : 'btn-primary'}`}
                  onClick={() => {
                    if (autoMove) {
                      // Parar movimento automático
                      setAutoMove(false);
                      if (moveInterval) {
                        clearInterval(moveInterval);
                        setMoveInterval(null);
                      }
                    } else {
                      // Iniciar movimento automático
                      setAutoMove(true);
                      const interval = setInterval(() => {
                        moveClimateZone();
                      }, 3000); // Move a cada 3 segundos
                      setMoveInterval(interval);
                    }
                  }}
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  {autoMove ? '⏸️ Parar' : '▶️ Auto'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* <div style={{ marginTop: '15px', fontSize: '14px', color: 'var(--color-muted)' }}>
        <h4>📋 Efeitos Climáticos:</h4>
        <ul className="no-bullets">
          <li>🌧️ <strong>Chuva:</strong> Reduz visibilidade e movimento de cavaleiros</li>
          <li>🌫️ <strong>Nevoeiro:</strong> Limita alcance de arqueiros e espiões</li>
          <li>🌪️ <strong>Furacão:</strong> Causa dano aleatório e dispersa unidades</li>
          <li>⚡ <strong>Raio:</strong> Chance de ataque crítico automático</li>
        </ul>
      </div> */}
    </div>
  );
}