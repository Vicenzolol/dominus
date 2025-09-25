'use client';

import { useState, useEffect, useRef } from 'react';

// Configurações do tabuleiro
const BOARD_SIZE = 26;
const TERRAIN_DISTRIBUTION = {
  "light-green": 0.84,
  "dark-green": 0.08,
  "gray": 0.08,
};

export default function TerrainGenerator() {
  const [boardData, setBoardData] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const [coordInfo, setCoordInfo] = useState<{
    visible: boolean;
    coordinate: string;
    terrain: string;
  }>({
    visible: false,
    coordinate: '',
    terrain: ''
  });

  // Gerar rótulos de coluna (A-Z)
  const generateColumnLabels = () => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  };

  // Gerar rótulos de linha (1-26)
  const generateRowLabels = () => {
    return Array.from({ length: 26 }, (_, i) => (i + 1).toString());
  };

  // Função auxiliar para verificar se está dentro dos limites do tabuleiro
  const isValid = (row: number, col: number) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  // Função para obter o índice no array a partir das coordenadas
  const getIndex = (row: number, col: number) => {
    return row * BOARD_SIZE + col;
  };

  // Gerar terreno com várias florestas menores distribuídas
  const generateRandomTerrain = () => {
    const totalCells = BOARD_SIZE * BOARD_SIZE;
    const terrain: string[] = new Array(totalCells).fill("light-green"); // Inicializa tudo como verde claro

    // Calcular quantidades de cada tipo
    const targetDarkGreen = Math.round(totalCells * TERRAIN_DISTRIBUTION["dark-green"]);
    const targetGray = Math.round(totalCells * TERRAIN_DISTRIBUTION["gray"]);

    // Adicionar montanhas (terreno cinza) aleatoriamente
    let grayAdded = 0;
    while (grayAdded < targetGray) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      if (terrain[randomIndex] === "light-green") {
        terrain[randomIndex] = "gray";
        grayAdded++;
      }
    }

    // Adicionar florestas (verde escuro) em vários grupos pequenos
    let darkGreenAdded = 0;
    const MIN_FOREST_GROUPS = 16; // Mínimo de grupos para garantir distribuição
    const MAX_CELLS_PER_GROUP = 2; // Máximo de 4 células adjacentes por grupo
    let forestGroupsCreated = 0;

    // Dividir o tabuleiro em regiões para garantir distribuição
    const regionSize = Math.floor(BOARD_SIZE / 3); // Divide em 3x3 regiões

    // Direções para células adjacentes (cima, baixo, esquerda, direita)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Primeira tentativa: tentar espalhar florestas pelas regiões do tabuleiro
    for (let regionRow = 0; regionRow < 3 && darkGreenAdded < targetDarkGreen; regionRow++) {
      for (let regionCol = 0; regionCol < 3 && darkGreenAdded < targetDarkGreen; regionCol++) {
        // Tentativas para encontrar ponto válido na região
        let attempts = 0;
        while (attempts < 10) {
          // Selecionar um ponto aleatório dentro desta região
          const startRow = regionRow * regionSize + Math.floor(Math.random() * regionSize);
          const startCol = regionCol * regionSize + Math.floor(Math.random() * regionSize);
          const startIndex = getIndex(startRow, startCol);

          // Verificar se o ponto é válido
          if (terrain[startIndex] === "light-green") {
            // Criar um grupo de floresta pequeno
            terrain[startIndex] = "dark-green";
            darkGreenAdded++;
            forestGroupsCreated++;

            // Lista de células deste grupo de floresta
            let forestCells = [{ row: startRow, col: startCol }];
            let growthQueue = [...forestCells];

            // Crescer até no máximo 4 células
            const groupSize = Math.min(1 + Math.floor(Math.random() * MAX_CELLS_PER_GROUP), MAX_CELLS_PER_GROUP);

            // Expandir o grupo
            while (growthQueue.length > 0 && forestCells.length < groupSize && darkGreenAdded < targetDarkGreen) {
              const randomIdx = Math.floor(Math.random() * growthQueue.length);
              const currentCell = growthQueue[randomIdx];
              growthQueue.splice(randomIdx, 1);

              // Shuffle directions
              const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

              // Tentar expandir
              for (const [dx, dy] of shuffledDirs) {
                if (forestCells.length >= groupSize) break;

                const newRow = currentCell.row + dx;
                const newCol = currentCell.col + dy;

                if (isValid(newRow, newCol)) {
                  const newIndex = getIndex(newRow, newCol);
                  if (terrain[newIndex] === "light-green") {
                    terrain[newIndex] = "dark-green";
                    const newCell = { row: newRow, col: newCol };
                    forestCells.push(newCell);
                    growthQueue.push(newCell);
                    darkGreenAdded++;
                  }
                }
              }
            }

            break; // Saiu do loop de tentativas
          }

          attempts++;
        }
      }
    }

    // Segunda passagem: adicionar mais grupos até atingir a meta
    while (darkGreenAdded < targetDarkGreen && forestGroupsCreated < MIN_FOREST_GROUPS) {
      // Escolher um ponto inicial aleatório
      let startIndex = Math.floor(Math.random() * totalCells);

      // Verificar se o ponto é válido
      if (terrain[startIndex] === "light-green") {
        const startRow = Math.floor(startIndex / BOARD_SIZE);
        const startCol = startIndex % BOARD_SIZE;

        // Verificar se está distante o suficiente de outras florestas
        let tooClose = false;
        for (let dr = -3; dr <= 3; dr++) {
          for (let dc = -3; dc <= 3; dc++) {
            const checkRow = startRow + dr;
            const checkCol = startCol + dc;
            if (isValid(checkRow, checkCol)) {
              const idx = getIndex(checkRow, checkCol);
              if (terrain[idx] === "dark-green") {
                tooClose = true;
                break;
              }
            }
          }
          if (tooClose) break;
        }

        if (!tooClose) {
          // Criar um grupo de floresta
          terrain[startIndex] = "dark-green";
          darkGreenAdded++;
          forestGroupsCreated++;

          // Lista de células deste grupo de floresta
          let forestCells = [{ row: startRow, col: startCol }];
          let growthQueue = [...forestCells];

          // Tamanho deste grupo
          const groupSize = Math.min(1 + Math.floor(Math.random() * MAX_CELLS_PER_GROUP), MAX_CELLS_PER_GROUP);

          // Expandir o grupo
          while (growthQueue.length > 0 && forestCells.length < groupSize && darkGreenAdded < targetDarkGreen) {
            const randomIdx = Math.floor(Math.random() * growthQueue.length);
            const currentCell = growthQueue[randomIdx];
            growthQueue.splice(randomIdx, 1);

            // Shuffle directions
            const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

            // Tentar expandir
            for (const [dx, dy] of shuffledDirs) {
              if (forestCells.length >= groupSize) break;

              const newRow = currentCell.row + dx;
              const newCol = currentCell.col + dy;

              if (isValid(newRow, newCol)) {
                const newIndex = getIndex(newRow, newCol);
                if (terrain[newIndex] === "light-green") {
                  terrain[newIndex] = "dark-green";
                  const newCell = { row: newRow, col: newCol };
                  forestCells.push(newCell);
                  growthQueue.push(newCell);
                  darkGreenAdded++;
                }
              }
            }
          }
        }
      }
    }

    // Terceira passagem: preencher células restantes para atingir a meta
    if (darkGreenAdded < targetDarkGreen) {
      // Identificar todas as células de floresta existentes
      const forestCells: { row: number, col: number }[] = [];
      for (let i = 0; i < totalCells; i++) {
        if (terrain[i] === "dark-green") {
          const row = Math.floor(i / BOARD_SIZE);
          const col = i % BOARD_SIZE;
          forestCells.push({ row, col });
        }
      }

      // Tentar expandir as florestas existentes até atingir o alvo
      while (forestCells.length > 0 && darkGreenAdded < targetDarkGreen) {
        const randomIndex = Math.floor(Math.random() * forestCells.length);
        const currentCell = forestCells[randomIndex];
        forestCells.splice(randomIndex, 1);

        // Tentar expandir em direções aleatórias
        const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

        for (const [dx, dy] of shuffledDirs) {
          if (darkGreenAdded >= targetDarkGreen) break;

          const newRow = currentCell.row + dx;
          const newCol = currentCell.col + dy;

          if (isValid(newRow, newCol)) {
            const newIndex = getIndex(newRow, newCol);

            if (terrain[newIndex] === "light-green") {
              terrain[newIndex] = "dark-green";
              darkGreenAdded++;
              break;
            }
          }
        }
      }
    }

    // Verificação final para garantir que não há florestas isoladas
    const grid: string[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        grid[i][j] = terrain[i * BOARD_SIZE + j];
      }
    }

    // Verificar se há florestas isoladas e corrigi-las
    let modified = true;
    while (modified) {
      modified = false;

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (grid[row][col] === "dark-green") {
            // Verificar se tem pelo menos uma floresta adjacente
            if (!hasDarkGreenNeighbor(grid, row, col)) {
              // Floresta isolada encontrada, converter para verde claro
              grid[row][col] = "light-green";
              modified = true;
            }
          }
        }
      }
    }

    // Converter grid de volta para array linear
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        terrain[i * BOARD_SIZE + j] = grid[i][j];
      }
    }

    return terrain;
  };

  // Verifica se uma célula tem pelo menos um vizinho dark-green
  const hasDarkGreenNeighbor = (grid: string[][], row: number, col: number) => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE &&
        grid[newRow][newCol] === "dark-green"
      ) {
        return true;
      }
    }

    return false;
  };

  // Converte um vizinho não-dark-green para dark-green
  const convertNeighborToDarkGreen = (grid: string[][], row: number, col: number) => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Embaralhar direções para escolher aleatoriamente
    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of shuffledDirs) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE &&
        grid[newRow][newCol] === "light-green"
      ) {
        grid[newRow][newCol] = "dark-green";
        return true;
      }
    }

    return false;
  };

  // Gerar terreno aleatório
  const generateTerrain = () => {
    const newTerrain = generateRandomTerrain();
    setBoardData(newTerrain);
    updateTerrainStats(newTerrain);
  };

  // Atualizar estatísticas do terreno
  const updateTerrainStats = (terrain: string[]) => {
    const stats = {
      'light-green': 0,
      'dark-green': 0,
      'gray': 0,
    };

    terrain.forEach(type => {
      stats[type as keyof typeof stats]++;
    });

    const total = terrain.length;
    const statsElement = document.getElementById('terrainStats');
    if (statsElement) {
      statsElement.innerHTML = `
        <h3>📊 Estatísticas do Terreno:</h3>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <div>🟢 Verde Claro: ${stats['light-green']} (${((stats['light-green'] / total) * 100).toFixed(1)}%)</div>
          <div>🌲 Verde Escuro: ${stats['dark-green']} (${((stats['dark-green'] / total) * 100).toFixed(1)}%)</div>
          <div>⬜ Cinza: ${stats['gray']} (${((stats['gray'] / total) * 100).toFixed(1)}%)</div>
        </div>
      `;
    }
  };

  // Baixar imagem do tabuleiro
  const downloadBoard = async () => {
    if (!boardRef.current) return;

    try {
      // @ts-expect-error - html2canvas será carregado dinamicamente
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: '#F5F3F0',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `dominus-tabuleiro-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };

  // Gerar tabuleiro inicial
  useEffect(() => {
    generateTerrain();
  }, []);

  // Manipular clique na célula
  const handleCellClick = (row: number, col: number, terrainType: string) => {
    const columnLabel = String.fromCharCode(65 + col);
    const rowLabel = (row + 1).toString();
    const coordinate = `${columnLabel}${rowLabel}`;

    const terrainNames = {
      'light-green': 'Campo aberto',
      'dark-green': 'Floresta densa',
      'gray': 'Montanha/Rochedo'
    };

    // Mostrar o card de informações
    setCoordInfo({
      visible: true,
      coordinate: coordinate,
      terrain: terrainNames[terrainType as keyof typeof terrainNames]
    });

    // Configurar timer para esconder após 3 segundos
    setTimeout(() => {
      setCoordInfo(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  return (
    <div className="terrain-generator">
      {/* Card de informação da coordenada */}
      {coordInfo.visible && (
        <div className="coord-info-card">
          <div className="coord-info-content">
            <div className="coord-badge">{coordInfo.coordinate}</div>
            <div className="terrain-type">{coordInfo.terrain}</div>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={generateTerrain}
        >
          🔄 Reordenar Terreno
        </button>
        <button
          className="btn btn-secondary"
          onClick={downloadBoard}
        >
          📥 Baixar Imagem
        </button>
      </div>

      <div className="board-container" ref={boardRef}>
        {/* Célula do canto superior esquerdo */}
        <div className="corner-cell"></div>

        {/* Coordenadas das colunas (A-Z) */}
        <div className="column-headers">
          <div className="column-labels">
            {generateColumnLabels().map((label) => (
              <div key={label} className="column-label">
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Tabuleiro principal */}
        <div className="board-wrapper">
          {/* Headers das linhas */}
          <div className="row-headers">
            {generateRowLabels().map((label) => (
              <div key={label} className="row-label">
                {label}
              </div>
            ))}
          </div>

          {/* Tabuleiro */}
          <div className="board">
            {boardData.map((terrainType, index) => {
              const row = Math.floor(index / BOARD_SIZE);
              const col = index % BOARD_SIZE;
              const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;

              return (
                <div
                  key={index}
                  className={`cell ${terrainType}`}
                  onClick={() => handleCellClick(row, col, terrainType)}
                  title={`${coordinate} - ${terrainType}`}
                >
                  {/* Mostrar coordenadas apenas nas florestas e rochas */}
                  {(terrainType === 'dark-green' || terrainType === 'gray') && (
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: terrainType === 'dark-green' ? 'white' : 'black',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      pointerEvents: 'none'
                    }}>
                      {coordinate}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="legend">
        <h3>📋 Legenda:</h3>
        <div className="generation-info">
          <strong>Tipo:</strong> 🎯 Geração Aleatória
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-sample light-green"></div>
            <span>🟢 Verde Claro (84% - Campo aberto)</span>
          </div>
          <div className="legend-item">
            <div className="color-sample dark-green"></div>
            <span>🌲 Verde Escuro (8% - Floresta densa)</span>
          </div>
          <div className="legend-item">
            <div className="color-sample gray"></div>
            <span>⬜ Cinza (8% - Montanha/Rochedo)</span>
          </div>
        </div>
      </div>
    </div>
  );
}