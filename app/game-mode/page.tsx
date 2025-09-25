'use client';

import { useState, useEffect } from 'react';
import TerrainGenerator from '../components/TerrainGenerator';
import ClimateSystem from '../components/ClimateSystem';

export default function GameModePage() {
  const [boardData, setBoardData] = useState<string[]>([]);

  useEffect(() => {
    // Carregar o tabuleiro do localStorage se existir
    const savedBoard = localStorage.getItem('boardState');
    if (savedBoard) {
      try {
        setBoardData(JSON.parse(savedBoard));
      } catch (error) {
        console.error('Erro ao carregar tabuleiro salvo:', error);
      }
    }
  }, []);

  return (
    <>
      <header>
        <h2 className="title-center">🎮 Modo de Jogo - Dominus</h2>
        <p>Use o tabuleiro salvo ou gere um novo para sua batalha épica com efeitos climáticos dinâmicos!</p>
      </header>

      <ClimateSystem boardData={boardData} />

      {boardData.length === 0 && (
        <div className="controls">
          <div className="generation-type">
            <h3>🎲 Gere um Tabuleiro para Começar:</h3>
            <TerrainGenerator />
          </div>
        </div>
      )}

      {/* <div className="action-buttons" style={{ marginTop: '20px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            // Salvar estado atual no localStorage
            localStorage.setItem('boardState', JSON.stringify(boardData));
            alert('Estado do jogo salvo!');
          }}
        >
          💾 Salvar Estado do Jogo
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => {
            // Limpar estado salvo
            localStorage.removeItem('boardState');
            setBoardData([]);
            alert('Estado do jogo limpo!');
          }}
        >
          🗑️ Limpar Estado
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            window.location.href = '/';
          }}
        >
          🏠 Voltar ao Editor
        </button>
      </div> */}
    </>
  );
}