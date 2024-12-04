import React, { useState } from 'react';
import * as math from 'mathjs';

const OptimizacionSinRestricciones = () => {
  const [method, setMethod] = useState('');
  const [result, setResult] = useState('');
  
  const [bisectionInputs, setBisectionInputs] = useState({
    func: '',
    a: '',
    b: '',
    tolerance: '',
  });
  
  const [newtonInputs, setNewtonInputs] = useState({
    func: '',
    x0: '',
    tolerance: '',
  });

  const handleBisectionChange = (e) => {
    setBisectionInputs({
      ...bisectionInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewtonChange = (e) => {
    setNewtonInputs({
      ...newtonInputs,
      [e.target.name]: e.target.value,
    });
  };

  const bisection = (f, df, a, b, tolerance) => {
    let x = (a + b) / 2;
    while (b - a > 2 * tolerance) {
      if (df(x) > 0) {
        a = x;
      } else {
        b = x;
      }
      x = (a + b) / 2;
    }
    return x;
  };

  const newton = (f, df, x0, tolerance) => {
    let x = x0;
    let iterations = 0;
    const maxIterations = 100;

    while (iterations < maxIterations) {
      const firstDerivative = df(x);
      const secondDerivative = math.derivative(math.derivative(f, 'x'), 'x').evaluate({ x });

      if (Math.abs(secondDerivative) < 1e-10) {
        throw new Error('La segunda derivada está cerca de cero. El método puede no converger.');
      }

      const dx = firstDerivative / secondDerivative;
      const xNew = x - dx;

      if (Math.abs(xNew - x) < tolerance) {
        return xNew;
      }

      x = xNew;
      iterations++;
    }

    throw new Error('El método no convergió después del máximo de iteraciones.');
  };

  const handleBisectionSubmit = (e) => {
    e.preventDefault();
    const { func, a, b, tolerance } = bisectionInputs;

    try {
      const f = (x) => math.evaluate(func, { x });
      const df = (x) => math.derivative(func, 'x').evaluate({ x });
      const x = bisection(f, df, parseFloat(a), parseFloat(b), parseFloat(tolerance));
      setResult(`Método de Bisección: x* ≈ ${x.toFixed(6)}, f(x*) ≈ ${f(x).toFixed(6)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleNewtonSubmit = (e) => {
    e.preventDefault();
    const { func, x0, tolerance } = newtonInputs;

    try {
      const f = (x) => math.evaluate(func, { x });
      const df = (x) => math.derivative(func, 'x').evaluate({ x });
      const x = newton(f, df, parseFloat(x0), parseFloat(tolerance));
      setResult(`Método de Newton: x* ≈ ${x.toFixed(6)}, f(x*) ≈ ${f(x).toFixed(6)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Optimización sin Restricciones</h1>
      <button onClick={() => setMethod('bisection')}>Método de Bisección</button>
      <button onClick={() => setMethod('newton')}>Método de Newton</button>

      {method === 'bisection' && (
        <form onSubmit={handleBisectionSubmit}>
          <h2>Método de Bisección</h2>
          <label>Función a optimizar:</label>
          <input type="text" name="func" value={bisectionInputs.func} onChange={handleBisectionChange} required />
          <label>Límite inferior (a):</label>
          <input type="number" name="a" value={bisectionInputs.a} onChange={handleBisectionChange} required />
          <label>Límite superior (b):</label>
          <input type="number" name="b" value={bisectionInputs.b} onChange={handleBisectionChange} required />
          <label>Tolerancia:</label>
          <input type="number" name="tolerance" value={bisectionInputs.tolerance} onChange={handleBisectionChange} required />
          <button type="submit">Calcular</button>
        </form>
      )}

      {method === 'newton' && (
        <form onSubmit={handleNewtonSubmit}>
          <h2>Método de Newton</h2>
          <label>Función a optimizar:</label>
          <input type="text" name="func" value={newtonInputs.func} onChange={handleNewtonChange} required />
          <label>Punto inicial (x0):</label>
          <input type="number" name="x0" value={newtonInputs.x0} onChange={handleNewtonChange} required />
          <label>Tolerancia:</label>
          <input type="number" name="tolerance" value={newtonInputs.tolerance} onChange={handleNewtonChange} required />
          <button type="submit">Calcular</button>
        </form>
      )}

      {result && <div id="result">{result}</div>}
    </div>
  );
};

export default OptimizacionSinRestricciones;
