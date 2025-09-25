'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export default function SobrePage() {
  const [showSecretMissions, setShowSecretMissions] = useState(false);
  const [activeSection, setActiveSection] = useState('regras-basicas');
  const [showSidebar, setShowSidebar] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Inicializar Fancybox quando o componente montar
  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Opções básicas do Fancybox
    });

    // Cleanup
    return () => {
      Fancybox.destroy();
    };
  }, []);

  useEffect(() => {
    if (showSecretMissions) {
      // Pequeno timeout para garantir que a seção esteja renderizada
      setTimeout(() => {
        const secretMissionsSection = document.getElementById('secretMissionsSection');
        if (secretMissionsSection) {
          secretMissionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showSecretMissions]);

  // Observador de interseção para destacar seção ativa
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          // Adicionar classe para destacar seção ativa
          element.classList.add('active-section');
        } else {
          // Remover classe quando não está mais visível
          element.classList.remove('active-section');
        }
      });
    }, observerOptions);

    // Observar todas as seções
    const sections = [
      'regras-basicas',
      'estrutura-jogo',
      'unidades-disponiveis',
      'combate-floresta',
      'regras-especiais',
      'galeria',
      'mecanicas-especiais',
      'sistema-terrenos'
    ];

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Calcular progresso de leitura 
  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress(); // Calcular na inicialização

    return () => {
      window.removeEventListener('scroll', calculateProgress);
    };
  }, []);

  // Função para scroll suave para a seção
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowSidebar(false); // Fechar sidebar no mobile após navegação
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const units = [
    {
      name: "🛡️ Guerreiros",
      image: "/imagens/classe-guerreiros.jpg",
      movement: "2 espaços",
      attack: "Adjacente, 3+ para acertar",
      defense: "4+",
      special: "Formação Defensiva (+1 defesa coletiva)"
    },
    {
      name: "🏹 Arqueiros",
      image: "/imagens/classe-arqueiros.jpg",
      movement: "2 espaços",
      attack: "3 espaços de distância, 3+ para acertar",
      defense: "6",
      special: "Chuva de Flechas (ataque conjunto)"
    },
    {
      name: "🐎 Cavaleiros",
      image: "/imagens/classe-cavaleiros.jpg",
      movement: "2 espaços (incluindo diagonal)",
      attack: "Adjacente, 3+ para acertar",
      defense: "5+",
      special: "Investida (+1 dano no primeiro ataque)"
    },
    {
      name: "🔱 Lanceiros",
      image: "/imagens/classe-lanceiros.jpg",
      movement: "2 espaços",
      attack: "Adjacente, 4+ para acertar",
      defense: "2+",
      special: "Cobertura (protege unidades atrás)"
    },
    {
      name: "🏰 Catapulta",
      image: "/imagens/classe-catapulta.jpg",
      movement: "1 espaço",
      attack: "5 espaços de distância, 2+ para acertar",
      defense: "-",
      special: "Artilharia de longo alcance"
    },
    {
      name: "🕵️ Espião",
      image: "/imagens/classe-espiao.jpg",
      movement: "1 espaço (furtivo)",
      attack: "Adjacente, 3+ para acertar",
      defense: "5+",
      special: "Ataque furtivo (não pode ser defendido)"
    },
    {
      name: "⛺ Acampamento",
      image: "/imagens/classe-acampamento.jpg",
      movement: "-",
      attack: "-",
      defense: "-",
      special: "Base móvel de apoio - A cada turno estacionado, cure uma unidade do esquadrão em troca de um ataque do turno. Sua posição só pode ficar a até 6 espaços do castelo"
    }
  ];

  const secretMissions = [
    { name: "Roubo de Ouro", image: "/imagens/roubo-de-ouro.jpg" },
    { name: "Roubar Mapas", image: "/imagens/roubar-mapas.jpg" },
    { name: "Roubar Suprimentos", image: "/imagens/roubar-suprimentos.jpg" },
    { name: "Assassinato de Oficial", image: "/imagens/assassinato-de-oficial.jpg" },
    { name: "Sabotar Catapulta", image: "/imagens/sabotar-catapulta.jpg" },
    { name: "Caos no Campo", image: "/imagens/caos-no-campo.jpg" },
    { name: "Infiltração Total", image: "/imagens/infiltracao-total.jpg" },
    { name: "Interceptar", image: "/imagens/interceptar.jpg" }
  ];

  const specialRules = [
    {
      title: "🕵️ Captura de Espião",
      description: "Ao capturar o espião inimigo, o jogador pode escolher pagar em ouro a quantidade de PVs ganhados pelo espião e adicionar aos seus próprios PVs.",
      image: "/imagens/captura-espiao.jpg"
    },
    {
      title: "🛡️ Escolta",
      description: "Se uma catapulta estiver adjacente a algum esquadrão, ela ganha a defesa do esquadrão em questão.",
      image: "/imagens/escolta.jpg"
    },
    {
      title: "⚔️ Duelo",
      description: "O jogador atacante propõe um duelo entre dois esquadrões. Para que a ação se cumpra, o jogador defensivo precisa concordar com a ação de duelo. A resolução segue: ambos os jogadores jogam um D10. O jogador com resultado maior vence o duelo. O perdedor perde uma unidade do esquadrão. A ação representa o duelo entre dois campeões do esquadrão.",
      image: "/imagens/duelo.jpg"
    }
  ];

  const galleryImages = [
    { name: "Torre", src: "/imagens/classe-torre.jpg" },
    { name: "Base", src: "/imagens/classe-base.jpg" }
  ];

  const mechanics = [
    {
      name: "Ataque Crítico",
      description: "Resultados de 6 em dados de ataque não podem ser defendidos",
      image: "/imagens/ataque-critico.jpg"
    },
    {
      name: "Formação Defensiva",
      description: "Guerreiros lado a lado ganham +1 defesa coletiva",
      image: "/imagens/classe-guerreiros.jpg"
    },
    {
      name: "Investida",
      description: "Cavaleiros que atacarem um esquadrao que nao estava adjacente antes do ataque terao seu dano em +1.",
      image: "/imagens/classe-cavaleiros.jpg"
    },
    {
      name: "Cobertura",
      description: "Lanceiros protegem unidades adjacentes atrás deles contra ataques à distância",
      image: "/imagens/cobertura.jpg"
    },
    {
      name: "Chuva de Flechas",
      description: "Até 3 Arqueiros adjacentes podem atacar juntos como 1 ataque",
      image: "/imagens/chuva-de-flecha.jpg"
    },
    {
      name: "Furtividade",
      description: "Espiões podem permanecer invisíveis após ataques bem-sucedidos",
      image: "/imagens/classe-espiao.jpg"
    },
    {
      name: "Ataque furtivo",
      description: "Ao atacar estando furtivo o espiao alcanca o requisito para critico tirando 5+, se atingir essa condicao, ele permanece furtivo apos o ataque e nao pode ser atacado.",
      image: "/imagens/classe-espiao.jpg"
    }
  ];

  const terrainTypes = [
    {
      name: "Campos/Planícies",
      description: "Movimento livre, combate equilibrado",
      class: "fields"
    },
    {
      name: "Florestas",
      description: "Cobertura para unidades furtivas",
      class: "forests"
    },
    {
      name: "Montanhas",
      description: "Posições defensivas elevadas",
      class: "mountains"
    }
  ];

  const summaryItems = [
    { id: 'regras-basicas', title: '📜 Regras Básicas', icon: '📜' },
    { id: 'estrutura-jogo', title: '⚙️ Estrutura de Jogo', icon: '⚙️' },
    { id: 'unidades-disponiveis', title: '⚔️ Unidades Disponíveis', icon: '⚔️' },
    { id: 'combate-floresta', title: '🌲 Regras para Combate em Floresta', icon: '🌲' },
    { id: 'regras-especiais', title: '⚡ Regras Especiais', icon: '⚡' },
    { id: 'galeria', title: '🖼️ Galeria de Tropas e Cartas', icon: '🖼️' },
    { id: 'mecanicas-especiais', title: '🎲 Mecânicas Especiais', icon: '🎲' },
    { id: 'sistema-terrenos', title: '🌍 Sistema de Terrenos', icon: '🌍' },
  ];

  return (
    <div className="page-container">
      {/* Botão toggle para mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        📚 Sumário
      </button>

      {/* Overlay para fechar sidebar no mobile */}
      {showSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar navegável */}
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="header-top">
            <h3>📖 Navegação</h3>
            <button
              className="sidebar-close"
              onClick={() => setShowSidebar(false)}
            >
              ✕
            </button>
          </div>
          <div className="reading-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(readingProgress)}% lido</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {summaryItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.title.replace(/^[^\s]+\s/, '')}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content">
        <div className="about-content">
          <h2 className="title-center">📖 Sobre Dominus</h2>

          <div className="game-description" style={{ marginBottom: '40px' }}>
            <h3 className="title-dark">🎯 O Jogo</h3>
            <p className="paragraph-large">
              Dominus é um jogo de estratégia medieval onde você comanda poderosos esquadrões em batalhas táticas.
              Cada unidade possui habilidades únicas e mecânicas especiais que exigem estratégia e planejamento para vencer.
            </p>
          </div>

          <div id="regras-basicas" className="game-rules-section" style={{ marginBottom: '40px' }}>
            <h3 className="title-dark">📜 Regras Básicas</h3>

            <div className="special-rules-section" style={{ marginBottom: '30px' }}>
              <h4 className="subtitle-dark">🏰 Organização e Jogabilidade</h4>
              <div className="paragraph-normal">
                <p>
                  Jogadores terão seus castelos que fornecem <strong>ouro</strong> a cada rodada para adquirir unidades para seu exército.
                  O ouro pode também ser adquirido ao derrotar tropas inimigas ou através de acampamentos.
                </p>
                <p>
                  Será possível construir torres de vigilância que abrigam certas unidades, concedendo benefícios específicos.
                  Cada torre fornece <strong>Pontos de Vitória (P.V.)</strong>, que são cruciais para uma das formas de vencer o jogo.
                </p>
              </div>
            </div>

            <div className="rules-grid" style={{ marginBottom: '30px' }}>
              <div className="rule-item">
                <h4 className="subtitle-dark">🏆 Pontos de Vitória</h4>
                <p className="paragraph-normal">
                  Seu reino já inicia com uma quantidade de P.V., mas cuidado: se seus pontos forem baixos, seu castelo pode ser atacado por unidades comuns.
                  Ganhe pontos construindo torres ou através de missões secretas com o espião. Com P.V. altos, seu castelo só poderá sofrer dano através de armas de cerco.
                </p>
              </div>

              <div className="rule-item">
                <h4 className="subtitle-dark">🎲 Sistema de Combate</h4>
                <p className="paragraph-normal">
                  O combate entre unidades é realizado com dados d6. Cada unidade do esquadrão é representada por um dado.
                  Após ataques bem-sucedidos, a tropa inimiga terá a chance de se defender, com cada classe tendo diferentes valores de ataque e defesa.
                </p>
              </div>
            </div>

            <div id="estrutura-jogo" className="forest-combat-section" style={{ marginBottom: '30px' }}>
              <div className="flex-1">
                <h4 className="title-green">⚙️ Estrutura de Jogo</h4>
                <ul className="list-large">
                  <li><strong>Tabuleiro:</strong> 26 x 26 casas quadradas com áreas de campo, florestas e rochedos gerados aleatoriamente.</li>
                  <li><strong>Esquadrões:</strong> Cada esquadrão conta com 5 unidades da classe escolhida.</li>
                  <li><strong>Treinamento:</strong> É possível adquirir habilidades permanentes para suas tropas, adaptando-as à sua estratégia.</li>
                  <li><strong>Movimentos por turno:</strong> Cada jogador pode movimentar até 3 esquadrões e realizar 3 ataques por turno.</li>
                </ul>
              </div>
              <div className="flex-1">
                <h4 className="title-green">🏅 Condições de Vitória</h4>
                <ul className="list-large">
                  <li><strong>Destruição do Castelo:</strong> Use armas de cerco (ou tropas comuns se o inimigo tiver P.V. baixo) para destruir o castelo adversário.</li>
                  <li><strong>Acúmulo de Pontos:</strong> Atinja a quantidade de Pontos de Vitória estabelecida para vencer a partida.</li>
                  <li><strong>Pontos de Ação:</strong> Use-os para contratar tropas, realizar patrulhas e outras ações importantes.</li>
                </ul>
              </div>
            </div>
          </div>

          <div id="unidades-disponiveis" className="units-section" style={{ marginBottom: '40px' }}>
            <h3 className="title-dark">⚔️ Unidades Disponíveis</h3>
            <div className="units-grid">
              {units.map((unit, index) => (
                <div key={index} className="unit-card">
                  <a href={unit.image} data-fancybox="gallery" data-caption={`${unit.name} - Unidade de combate especializada`}>
                    <Image
                      src={unit.image}
                      alt={unit.name}
                      width={150}
                      height={150}
                      className="unit-img"
                    />
                  </a>
                  <h4 className="title-dark">{unit.name}</h4>
                  <ul className="list-line-height">
                    <li><strong>Movimento:</strong> {unit.movement}</li>
                    <li><strong>Ataque:</strong> {unit.attack}</li>
                    <li><strong>Defesa:</strong> {unit.defense}</li>
                    <li><strong>Habilidade:</strong> {unit.special}</li>
                  </ul>
                  {unit.name === "🕵️ Espião" && (
                    <button
                      className="btn-show-missions"
                      onClick={() => setShowSecretMissions(true)}
                    >
                      🔍 Ver Missões Secretas
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showSecretMissions && (
            <div id="secretMissionsSection" className="secret-missions">
              <h3 className="title-dark text-center margin-bottom-20">🕵️ Missões Secretas do Espião</h3>
              <p className="paragraph-center">Cartas especiais que o Espião pode executar para sabotar o inimigo</p>
              <div className="missions-grid">
                {secretMissions.map((mission, index) => (
                  <div key={index} className="mission-card">
                    <a href={mission.image} data-fancybox="gallery" data-caption={`${mission.name} - Missão secreta do espião`}>
                      <Image
                        src={mission.image}
                        alt={mission.name}
                        width={150}
                        height={150}
                        className="mission-img"
                      />
                    </a>
                    <p className="margin-top-10" style={{ fontWeight: 'bold' }}>{mission.name}</p>
                  </div>
                ))}
              </div>
              <div className="text-center margin-top-20">
                <button
                  className="btn-hide-missions"
                  onClick={() => setShowSecretMissions(false)}
                >
                  ❌ Ocultar Missões
                </button>
              </div>
            </div>
          )}

          <div id="combate-floresta" className="forest-combat-section">
            <div className="flex-1">
              <h3 className="title-green">🌲 Regras para Combate em Floresta</h3>
              <ol className="list-large">
                <li><strong>Ocultação:</strong>
                  <ul>
                    <li>Unidades dentro da floresta <strong>não podem ser alvo de ataques à distância</strong>.</li>
                    <li>No tabuleiro, elas ainda ocupam espaço, mas apenas unidades <strong>adjacentes</strong> podem atacá-las.</li>
                  </ul>
                </li>
                <li><strong>Teste de Emboscada (Dado D10):</strong>
                  <ul>
                    <li>Antes do combate, a tropa que <strong>ataca dentro da floresta</strong> rola um D10.</li>
                    <li>Resultado <strong>1–4</strong>: a tropa se perde no terreno e o ataque falha (não ocorre).</li>
                    <li>Resultado <strong>5–10</strong>: o combate ocorre normalmente.</li>
                  </ul>
                </li>
              </ol>
            </div>
            <div className="flex-1 text-center">
              <a href="/imagens/floresta.jpg" data-fancybox="gallery" data-caption="🌲 Combate em Floresta - Regras especiais para batalhas na floresta">
                <Image
                  src="/imagens/floresta.jpg"
                  alt="Combate em Floresta"
                  width={300}
                  height={200}
                  className="forest-img"
                />
              </a>
            </div>
          </div>

          <div id="regras-especiais" className="special-rules-section">
            <h3 className="title-dark text-center margin-bottom-30">⚡ Regras Especiais</h3>
            <div className="rules-grid">
              {specialRules.map((rule, index) => (
                <div key={index} className="rule-item">
                  <h4 className="subtitle-dark">{rule.title}</h4>
                  <p className="paragraph-normal">{rule.description}</p>
                  <a href={rule.image} data-fancybox="gallery" data-caption={rule.title}>
                    <Image
                      src={rule.image}
                      alt={rule.title}
                      width={250}
                      height={150}
                      className="rule-img"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div id="galeria" className="gallery-section">
            <h3 className="title-dark">🖼️ Galeria de Tropas e Cartas</h3>
            <p className="paragraph-normal">
              Explore as imagens das tropas e cartas disponíveis no jogo Dominus. Cada imagem representa uma unidade ou ação estratégica.
            </p>
            <div className="gallery-grid">
              {galleryImages.map((item, index) => (
                <div key={index} className="gallery-item">
                  <a href={item.src} data-fancybox="gallery" data-caption={`${item.name} - Estrutura do jogo Dominus`}>
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={180}
                      height={180}
                      className="gallery-img"
                    />
                  </a>
                  <p className="margin-top-10" style={{ fontWeight: 'bold' }}>{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="mecanicas-especiais" className="mechanics-section">
            <h3 className="title-dark">🎲 Mecânicas Especiais</h3>
            <div className="mechanics-list">
              <ul className="list-mechanics">
                {mechanics.map((mechanic, index) => (
                  <li key={index}>
                    <a href={mechanic.image} data-fancybox="gallery" data-caption={`${mechanic.name} - ${mechanic.description}`}>
                      <Image
                        src={mechanic.image}
                        alt={mechanic.name}
                        width={30}
                        height={30}
                        className="mechanic-icon"
                      />
                    </a>
                    <strong> {mechanic.name}:</strong> {mechanic.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="sistema-terrenos" className="terrain-section">
            <h3 className="title-dark">🌍 Sistema de Terrenos</h3>
            <p className="paragraph-normal">
              Use nosso gerador de terrenos para criar mapas estratégicos personalizados. Cada tipo de terreno oferece vantagens e desvantagens táticas:
            </p>
            <div className="terrain-types">
              {terrainTypes.map((terrain, index) => (
                <div key={index} className="terrain-type">
                  <div className={`terrain-sample ${terrain.class}`}></div>
                  <strong>{terrain.name}</strong><br />
                  <small>{terrain.description}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}