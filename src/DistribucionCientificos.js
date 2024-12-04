import React, { useState } from 'react';

const DistribucionCientificos = () => {
  const [scientists, setScientists] = useState(2);
  const [team1, setTeam1] = useState("0.4,0.2,0.15");
  const [team2, setTeam2] = useState("0.6,0.4,0.2");
  const [team3, setTeam3] = useState("0.8,0.5,0.3");
  const [resultados, setResultados] = useState(null);

  const calcular = () => {
    const scientistsNumber = parseInt(scientists, 10);
    const team1Array = team1.split(',').map(Number);
    const team2Array = team2.split(',').map(Number);
    const team3Array = team3.split(',').map(Number);
    
    const probabilidadesFracaso = { 1: team1Array, 2: team2Array, 3: team3Array };
    const f = {};
    const decision = {};
    
    let n = 3;
    f[n] = {};
    for (let s3 = 0; s3 <= scientistsNumber; s3++) {
      f[n][s3] = Math.min(...probabilidadesFracaso[n].slice(0, s3 + 1));
      decision[`${n},${s3}`] = probabilidadesFracaso[n].indexOf(f[n][s3]);
    }

    for (n = 2; n >= 1; n--) {
      f[n] = {};
      for (let s = 0; s <= scientistsNumber; s++) {
        f[n][s] = Infinity;
        for (let x = 0; x <= s; x++) {
          const siguiente = f[n + 1]?.[s - x] || 1;
          const costo = probabilidadesFracaso[n][x] * siguiente;
          if (costo < f[n][s]) {
            f[n][s] = costo;
            decision[`${n},${s}`] = x;
          }
        }
      }
    }

    const asignaciones = {};
    let s_actual = scientistsNumber;
    for (n = 1; n <= 3; n++) {
      asignaciones[n] = decision[`${n},${s_actual}`];
      s_actual -= asignaciones[n];
    }

    setResultados({
      asignaciones: {
        equipo1: asignaciones[1],
        equipo2: asignaciones[2],
        equipo3: asignaciones[3],
      },
      probabilidadMinima: f[1][scientistsNumber].toFixed(3),
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Distribución de Científicos</h1>
      <h2>Minimización de la Probabilidad de Fracaso</h2>
      <div className="input-group">
        <label htmlFor="scientists">Cantidad de científicos adicionales disponibles:</label>
        <input
          type="number"
          id="scientists"
          min="1"
          value={scientists}
          onChange={(e) => setScientists(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Probabilidades de fracaso para cada equipo según el número de científicos asignados:</label>
        <p>Equipo 1 (probabilidades separadas por comas, ej: 0.4,0.2,0.15):</p>
        <input
          type="text"
          id="team1"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
        />
        <p>Equipo 2:</p>
        <input
          type="text"
          id="team2"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
        />
        <p>Equipo 3:</p>
        <input
          type="text"
          id="team3"
          value={team3}
          onChange={(e) => setTeam3(e.target.value)}
        />
      </div>
      <button onClick={calcular}>Resolver Problema</button>

      {resultados && (
        <div className="result" style={{ marginTop: '20px', fontSize: '1.2em', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          <h3>Resultados</h3>
          <p>Asignaciones óptimas:</p>
          <p>Equipo 1: {resultados.asignaciones.equipo1} científicos</p>
          <p>Equipo 2: {resultados.asignaciones.equipo2} científicos</p>
          <p>Equipo 3: {resultados.asignaciones.equipo3} científicos</p>
          <p>Probabilidad mínima de fracaso combinada: {resultados.probabilidadMinima}</p>
        </div>
      )}
    </div>
  );
};

export default DistribucionCientificos;
