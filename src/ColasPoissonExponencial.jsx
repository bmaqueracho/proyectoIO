// ColasPoissonExponencial.jsx
import React, { useState } from 'react';

function ColasPoissonExponencial() {
  const [lambda, setLambda] = useState('');
  const [mu, setMu] = useState('');
  const [n, setN] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularColas = () => {
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const nNum = parseFloat(n);

    if (muNum > lambdaNum) {
      const Lq = (Math.pow(lambdaNum, 2)) / (muNum * (muNum - lambdaNum));
      const L = Lq + (lambdaNum / muNum);
      const Po = 1 - (lambdaNum / muNum);
      const Wq = (Lq / lambdaNum) * 60; // Convertir a minutos
      const W = Wq + (1 / muNum) * 60; // Convertir a minutos correctamente
      const Pw = lambdaNum / muNum;
      const Pn = Math.pow((lambdaNum / muNum), nNum) * Po;
      setResultado({ L, Lq, Po, Wq, W, Pw, Pn });
    } else {
      alert("El valor de μ debe ser mayor que λ.");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Modelo de Colas: Un Servidor / Llegadas Poisson / Servicios Exponenciales</h2>
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
          valor para n unidades (n):
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={calcularColas} style={{ display: 'block', margin: '20px auto' }}>Calcular</button>
      {resultado && (
        <div>
          <h3>Resultados</h3>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '60%' }}>
            <tbody>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Parámetro</th>
                <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Valor</th>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>L (N° promedio de unidades en el sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.L.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Lq (N° promedio de unidades en la línea de espera)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Lq.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Po (Probabilidad de que no haya unidades en el sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Po.toFixed(1)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Wq (Tiempo promedio en la línea de espera)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Wq} minutos</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>W (Tiempo promedio en el sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.W} minutos</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Pw (Probabilidad de que una unidad no espere para ser atendida)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Pw.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>Pn (Probabilidad de que haya n unidades en el sistema)</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{resultado.Pn.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ColasPoissonExponencial;
