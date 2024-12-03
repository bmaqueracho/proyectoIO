import React, { useState } from 'react';

function MultiplesServidoresSinEspera() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [servidores, setServidores] = useState('');
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
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const servidoresNum = parseInt(servidores);

    if (!lambdaNum || !muNum || !servidoresNum || servidoresNum <= 0) {
      alert("Por favor, ingresa valores válidos para λ, μ y número de servidores.");
      return;
    }

    const rho = lambdaNum / (servidoresNum * muNum);
    if (rho > 1) {
      alert("El sistema es inestable (ρ > 1). Verifica los valores ingresados.");
      return;
    }
    let sumatoria = 0;
    for (let n = 0; n < servidoresNum-1; n++) {
      sumatoria += (Math.pow(lambdaNum / muNum, n) / calcularFactorial(n))+(Math.pow(lambdaNum / muNum, servidoresNum) / (calcularFactorial(servidoresNum)) *(1-rho));
    }
    const P0 = 1 / (sumatoria);

    const Ls = (lambdaNum / muNum) + (Math.pow(lambdaNum, servidoresNum) * P0) / (calcularFactorial(servidoresNum) * Math.pow(servidoresNum * (1 - rho), 2));
    const Lq = Ls - (lambdaNum / muNum);
    const Ws = Ls / lambdaNum;
    const Wq = Lq / lambdaNum;

    setResultado({ P0: P0 * 100, Ls, Lq, Ws, Wq });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Modelo M/G/s (sin espera)</h2>
      <div style={{ display: 'inline-block', textAlign: 'left', marginBottom: '20px' }}>
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
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                  Parámetro
                </th>
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                  Valor
                </th>
              </tr>
              {resultado.P0 !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>P₀ (Probabilidad de sistema vacío)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.P0.toFixed(2)}%
                  </td>
                </tr>
              )}
              {resultado.Prej !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>P_rej (Probabilidad de rechazo)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.Prej.toFixed(2)}%
                  </td>
                </tr>
              )}
              {resultado.Ls !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ls (Clientes promedio en sistema)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.Ls.toFixed(2)} clientes
                  </td>
                </tr>
              )}
              {resultado.Lq !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Lq (Clientes promedio en cola)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.Lq.toFixed(2)} clientes
                  </td>
                </tr>
              )}
              {resultado.Ws !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ws (Tiempo promedio en sistema)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.Ws.toFixed(2)} unidades de tiempo
                  </td>
                </tr>
              )}
              {resultado.Wq !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Wq (Tiempo promedio en cola)</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {resultado.Wq.toFixed(2)} unidades de tiempo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MultiplesServidoresSinEspera;
