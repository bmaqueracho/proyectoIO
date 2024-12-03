import React, { useState } from 'react';

function Incertidumbre() {
  const [matriz, setMatriz] = useState([['', '']]); // Inicia con 1 fila y 2 columnas
  const [filas, setFilas] = useState(1);
  const [columnas, setColumnas] = useState(2);
  const [criterio, setCriterio] = useState('Laplace');
  const [resultado, setResultado] = useState(null);
  const [alpha, setAlpha] = useState(0.5); // Usado para el criterio de Hurwicz

  const agregarFila = () => {
    const nuevaFila = Array(columnas).fill('');
    setMatriz([...matriz, nuevaFila]);
    setFilas(filas + 1);
  };

  const agregarColumna = () => {
    const nuevaMatriz = matriz.map(fila => [...fila, '']);
    setMatriz(nuevaMatriz);
    setColumnas(columnas + 1);
  };

  const manejarCambio = (i, j, valor) => {
    const nuevaMatriz = [...matriz];
    nuevaMatriz[i][j] = valor;
    setMatriz(nuevaMatriz);
  };

  // Funciones para calcular los criterios de decisión
  const calcularLaplace = () => {
    const sumas = matriz.map(fila => fila.reduce((acc, val) => acc + parseFloat(val || 0), 0) / columnas);
    const mejorAlternativa = sumas.indexOf(Math.max(...sumas)) + 1;
    setResultado(`La mejor alternativa según Laplace es la alternativa ${mejorAlternativa}`);
  };

  const calcularOptimista = () => {
    const mejoresValores = matriz.map(fila => Math.max(...fila.map(val => parseFloat(val || 0))));
    const mejorAlternativa = mejoresValores.indexOf(Math.max(...mejoresValores)) + 1;
    setResultado(`La mejor alternativa según el criterio Optimista es la alternativa ${mejorAlternativa}`);
  };

  const calcularPesimista = () => {
    const peoresValores = matriz.map(fila => Math.min(...fila.map(val => parseFloat(val || 0))));
    const mejorAlternativa = peoresValores.indexOf(Math.max(...peoresValores)) + 1;
    setResultado(`La mejor alternativa según el criterio Pesimista es la alternativa ${mejorAlternativa}`);
  };

  const calcularHurwicz = () => {
    const valoresHurwicz = matriz.map(fila => {
      const maxVal = Math.max(...fila.map(val => parseFloat(val || 0)));
      const minVal = Math.min(...fila.map(val => parseFloat(val || 0)));
      return alpha * maxVal + (1 - alpha) * minVal;
    });
    const mejorAlternativa = valoresHurwicz.indexOf(Math.max(...valoresHurwicz)) + 1;
    setResultado(`La mejor alternativa según Hurwicz con α=${alpha} es la alternativa ${mejorAlternativa}`);
  };

  const calcularSavage = () => {
    const maximosColumna = Array(columnas).fill(0).map((_, j) => Math.max(...matriz.map(fila => parseFloat(fila[j] || 0))));
    const matrizOportunidad = matriz.map(fila => fila.map((val, j) => maximosColumna[j] - parseFloat(val || 0)));
    const peoresOportunidades = matrizOportunidad.map(fila => Math.max(...fila));
    const mejorAlternativa = peoresOportunidades.indexOf(Math.min(...peoresOportunidades)) + 1;
    setResultado(`La mejor alternativa según el criterio de Savage es la alternativa ${mejorAlternativa}`);
  };

  const calcularResultado = () => {
    switch (criterio) {
      case 'Laplace':
        calcularLaplace();
        break;
      case 'Optimista':
        calcularOptimista();
        break;
      case 'Pesimista':
        calcularPesimista();
        break;
      case 'Hurwicz':
        calcularHurwicz();
        break;
      case 'Savage':
        calcularSavage();
        break;
      default:
        setResultado('Selecciona un criterio válido');
    }
  };

  return (
    <div>
      <h1>Decisiones bajo Incertidumbre</h1>

      <table>
        <thead>
          <tr>
            <th>Alternativas / Sucesos</th>
            {Array.from({ length: columnas }, (_, i) => <th key={i}>Suceso {i + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          {matriz.map((fila, i) => (
            <tr key={i}>
              <td>Alternativa {i + 1}</td>
              {fila.map((valor, j) => (
                <td key={j}>
                  <input
                    type="number"
                    value={valor}
                    onChange={e => manejarCambio(i, j, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={agregarFila}>Agregar Fila (Alternativa)</button>
      <button onClick={agregarColumna}>Agregar Columna (Suceso)</button>

      <div>
        <label>Selecciona el criterio:</label>
        <select value={criterio} onChange={e => setCriterio(e.target.value)}>
          <option value="Laplace">Laplace</option>
          <option value="Optimista">Optimista</option>
          <option value="Pesimista">Pesimista</option>
          <option value="Hurwicz">Hurwicz</option>
          <option value="Savage">Savage</option>
        </select>
      </div>

      {criterio === 'Hurwicz' && (
        <div>
          <label>Coeficiente de optimismo (α):</label>
          <input
            type="number"
            value={alpha}
            step="0.1"
            min="0"
            max="1"
            onChange={e => setAlpha(parseFloat(e.target.value))}
          />
        </div>
      )}

      <button onClick={calcularResultado}>Calcular Resultado</button>

      {resultado && <h2>{resultado}</h2>}
    </div>
  );
}

export default Incertidumbre;
