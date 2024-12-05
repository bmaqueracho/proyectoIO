import { factorial } from 'mathjs';
import React, { useState } from 'react';

function FuentesFinitas() {
  const [N, setN] = useState(''); // Número total de fuentes
  const [lambda, setLambda] = useState(''); // Tasa de llegada inicial
  const [mu, setMu] = useState(''); // Tasa de servicio
  const [servidores, setServidores] = useState(''); // Número de servidores
  const [resultado, setResultado] = useState(null);

  const calcularFactorial = (n) => {
    if (n < 0) {
      throw new Error("El factorial no está definido para números negativos.");
    }
    let resultado = 1;
    for (let i = 1; i <= n; i++) {
      resultado *= i;
    }
    return resultado;
  };

  const calcularResultados = () => {
    const Nnum = parseInt(N);
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const servidoresNum = parseInt(servidores);

    if (!Nnum || !lambdaNum || !muNum || !servidoresNum || Nnum <= 0 || servidoresNum <= 0) {
      alert("Por favor, ingresa valores válidos para N, λ, μ y número de servidores.");
      return;
    }

    const lambdaEfectiva = lambdaNum * (Nnum - 1) / Nnum;
    const rho = lambdaEfectiva / (servidoresNum * muNum);

    let sumatoria = 0;
    for (let n = 0; n <= Nnum; n++) {
        sumatoria += (factorial(Nnum) / factorial(Nnum - n)) * Math.pow((lambdaNum / muNum), n);
    }
    const P0 = 1 / sumatoria;

    const Ls = lambdaEfectiva / muNum + 
               (Math.pow(lambdaEfectiva / muNum, servidoresNum) * P0) /
               (calcularFactorial(servidoresNum) * Math.pow(servidoresNum * (1 - rho), 2));

    const Lq = Ls - (lambdaEfectiva / muNum);
    const Ws = Ls / lambdaEfectiva;
    const Wq = Lq / lambdaEfectiva;

    setResultado({ lambdaEfectiva, P0: P0 * 100, Ls, Lq, Ws, Wq });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Modelo de Línea de Espera con Fuentes Finitas</h2>
      <div style={{ display: 'inline-block', textAlign: 'left', marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Número total de fuentes (N):
          <input
            type="number"
            value={N}
            onChange={(e) => setN(e.target.value)}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Tasa de llegada (λ):
          <input
            type="number"
            value={lambda}
            onChange={(e) => setLambda(e.target.value)}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Tasa de servicio (μ):
          <input
            type="number"
            value={mu}
            onChange={(e) => setMu(e.target.value)}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Número de servidores (s):
          <input
            type="number"
            value={servidores}
            onChange={(e) => setServidores(e.target.value)}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={calcularResultados} style={{ display: 'block', margin: '20px auto' }}>
        Calcular
      </button>
      {resultado && (
        <div>
          <h3>Resultados</h3>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <tbody>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Parámetro</th>
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Valor</th>
              </tr>
              {resultado.lambdaEfectiva !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>λe (Tasa efectiva de llegada)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.lambdaEfectiva.toFixed(2)}</td>
                </tr>
              )}
              {resultado.P0 !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>P₀ (Probabilidad de sistema vacío)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.P0.toFixed(2)}%</td>
                </tr>
              )}
              {resultado.Ls !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ls (Clientes promedio en sistema)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Ls.toFixed(2)} clientes</td>
                </tr>
              )}
              {resultado.Lq !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Lq (Clientes promedio en cola)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Lq.toFixed(2)} clientes</td>
                </tr>
              )}
              {resultado.Ws !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ws (Tiempo promedio en sistema)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Ws.toFixed(2)} horas</td>
                </tr>
              )}
              {resultado.Wq !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Wq (Tiempo promedio en cola)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Wq.toFixed(2)} horas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FuentesFinitas;
