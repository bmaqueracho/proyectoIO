import React, { useState } from 'react';

const JuegoApuestas = () => {
  const [fichasIniciales, setFichasIniciales] = useState(3);
  const [jugadas, setJugadas] = useState(3);
  const [probGanar, setProbGanar] = useState(0.67);
  const [resultado, setResultado] = useState('');

  const politicaOptima = (fichasIniciales, jugadas, probGanar) => {
    const dp = Array.from({ length: 9 }, () => Array(4).fill(0));

    // Condición base: Si tienes 5 o más fichas, ganas automáticamente.
    for (let i = 5; i < 9; i++) {
      dp[i][0] = 1;
    }

    // Calcular tabla dp (dinámica)
    for (let jugada = 1; jugada <= jugadas; jugada++) {
      for (let fichas = 0; fichas <= 8; fichas++) {
        let mejorProb = 0;

        // Evaluar apuestas en orden descendente para priorizar apuestas más grandes primero
        for (let apuesta = fichas; apuesta >= 0; apuesta--) {
          const probGanarJugada =
            probGanar * dp[Math.min(fichas + apuesta, 8)][jugada - 1] +
            (1 - probGanar) * dp[Math.max(fichas - apuesta, 0)][jugada - 1];
          mejorProb = Math.max(mejorProb, probGanarJugada);
        }
        dp[fichas][jugada] = mejorProb;
      }
    }

    // Obtener la política óptima
    const politica = [];
    let fichas = fichasIniciales;

    // Evaluar la política para obtener apuestas priorizando las mayores
    for (let jugada = jugadas; jugada > 0; jugada--) {
      let mejorApuesta = 0;
      for (let apuesta = fichas; apuesta >= 0; apuesta--) {
        const probGanarJugada =
          probGanar * dp[Math.min(fichas + apuesta, 8)][jugada - 1] +
          (1 - probGanar) * dp[Math.max(fichas - apuesta, 0)][jugada - 1];
        if (dp[fichas][jugada] === probGanarJugada) {
          mejorApuesta = apuesta;
          break;
        }
      }
      politica.push(mejorApuesta);
      fichas -= mejorApuesta;
    }

    return [dp[fichasIniciales][jugadas], politica.reverse()];
  };

  const calcular = () => {
    if (
      fichasIniciales > 0 &&
      jugadas > 0 &&
      probGanar >= 0 &&
      probGanar <= 1 &&
      !isNaN(fichasIniciales) &&
      !isNaN(jugadas) &&
      !isNaN(probGanar)
    ) {
      const [probOptima, politica] = politicaOptima(fichasIniciales, jugadas, probGanar);
      setResultado(
        `Probabilidad óptima de ganar: ${probOptima.toFixed(4)}\nPolítica óptima de apuestas: ${politica.join(', ')}`
      );
    } else {
      setResultado('Por favor, ingrese valores válidos.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Juego de Apuestas</h1>
      <label>
        Fichas iniciales:
        <input
          type="number"
          min="1"
          value={fichasIniciales}
          onChange={(e) => setFichasIniciales(parseInt(e.target.value) || 0)}
        />
      </label>
      <br />
      <label>
        Número de jugadas:
        <input
          type="number"
          min="1"
          value={jugadas}
          onChange={(e) => setJugadas(parseInt(e.target.value) || 0)}
        />
      </label>
      <br />
      <label>
        Probabilidad de ganar:
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={probGanar}
          onChange={(e) => setProbGanar(parseFloat(e.target.value) || 0)}
        />
      </label>
      <br />
      <button onClick={calcular}>Calcular</button>

      {resultado && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3fe', borderLeft: '6px solid #2196F3' }}>
          <pre>{resultado}</pre>
        </div>
      )}
    </div>
  );
};

export default JuegoApuestas;