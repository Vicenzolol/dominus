import Image from 'next/image';

export default function Banner() {
  return (
    <>
      <div className="banner">
        <Image 
          src="/imagens/banner.jpg" 
          alt="Banner do Dominus"
          width={800}
          height={300}
          className="banner-image"
        />
      </div>

      <header>
        <div className="logo-container">
          <Image 
            src="/imagens/logo-do-jogo.jpg" 
            alt="Logo Dominus" 
            width={200}
            height={200}
            className="logo"
          />
        </div>
        <h1>⚔️ Dominus - Jogo de Estratégia Medieval</h1>
        <p>Comande unidades táticas como Guerreiros, Arqueiros, Cavaleiros e Espiões em batalhas estratégicas. Use o gerador de terrenos para criar mapas personalizados para suas campanhas épicas.</p>
      </header>
    </>
  );
}