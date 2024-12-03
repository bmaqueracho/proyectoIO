import React, { useState } from 'react';

function ModeloLineaEsperaMG1() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [varianza, setVarianza] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularResultados = () => {
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const sigma2 = parseFloat(varianza);

    if (!lambdaNum || !muNum || !sigma2 || lambdaNum <= 0 || muNum <= 0 || sigma2 < 0) {
      alert("Por favor, ingresa valores válidos para λ, μ y la varianza.");
      return;
    }

    const rho = lambdaNum / muNum;

    if (rho >= 1) {
      alert("El sistema no es estable (ρ ≥ 1). Verifica los valores de λ y μ.");
      return;
    }

    // Probabilidad de que el sistema esté vacío (P₀)
    const P0 = 1 - rho;

    // Clientes promedio en la cola (Lq)
    const Lq = (Math.pow(lambdaNum, 2) * sigma2 + Math.pow(rho, 2)) / (2 * (1 - rho));

    // Clientes promedio en el sistema (Ls)
    const Ls = Lq + lambdaNum / muNum;

    // Tiempo promedio en cola (Wq)
    const Wq = Lq / lambdaNum;

    // Tiempo promedio en el sistema (Ws)
    const Ws = Wq + 1 / muNum;

    setResultado({
      P0: P0 * 100,
      rho: rho * 100,
      Ls,
      Lq,
      Wq: Wq * 60, // Convertir a minutos
      Ws: Ws * 60, // Convertir a minutos
    });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Modelo M/G/1</h2>
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
          Varianza del tiempo de servicio (σ²):
          <input
            type="number"
            value={varianza}
            onChange={(e) => setVarianza(e.target.value)}
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
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>P₀ (Probabilidad de sistema vacío)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.P0.toFixed(2)}%</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>ρ (Utilización promedio)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.rho.toFixed(2)}%</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ls (Clientes promedio en sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Ls.toFixed(2)} clientes</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Lq (Clientes promedio en cola)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Lq.toFixed(2)} clientes</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Wq (Tiempo promedio en cola)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Wq.toFixed(2)} minutos</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Ws (Tiempo promedio en sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Ws.toFixed(2)} minutos</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ModeloLineaEsperaMG1;
