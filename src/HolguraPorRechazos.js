import React, { useState } from 'react';

const HolguraPorRechazos = () => {
  const [maxLotSize] = useState(5);
  const [maxRuns] = useState(3);
  const [successProb] = useState(0.5);
  const [fixedCost] = useState(300);
  const [variableCost] = useState(100);
  const [failureCost] = useState(1600);
  const [epsilon] = useState(0.01);
  const [results, setResults] = useState(null);

  const valueIteration = (states, actions, transitionProb, cost, gamma, epsilon, failureCost) => {
    let V = {};
    let policy = {};
    let iterations = [];

    states.forEach(s => {
      V[s] = s === 0 ? failureCost : 0;
      policy[s] = actions[0];
    });

    const calculateBestAction = (s, V) => {
      let minCost = Infinity;
      let bestAction = actions[0];

      actions.forEach(a => {
        let expectedCost = cost[s][a];
        states.forEach(nextS => {
          expectedCost += gamma * (transitionProb[s][a][nextS] || 0) * V[nextS];
        });

        if (expectedCost < minCost) {
          minCost = expectedCost;
          bestAction = a;
        }
      });

      return { minCost, bestAction };
    };

    while (true) {
      let delta = 0;
      let iterationV = { ...V };
      let iterationPolicy = { ...policy };

      states.forEach(s => {
        if (s === 0) return;

        let v = V[s];
        const { minCost, bestAction } = calculateBestAction(s, V);

        iterationV[s] = minCost;
        iterationPolicy[s] = bestAction;
        delta = Math.max(delta, Math.abs(v - iterationV[s]));
      });

      iterations.push({ V: { ...iterationV }, policy: { ...iterationPolicy } });
      V = iterationV;
      policy = iterationPolicy;

      if (delta < epsilon) break;
    }

    return [policy, V, iterations];
  };

  const calculateProbabilities = (lotSize, successProb) => {
    const pSuccess = 1 - Math.pow(1 - successProb, lotSize);
    return [pSuccess, 1 - pSuccess];
  };

  const generateTransitionProb = (states, actions, successProb) => {
    const transitionProb = {};
    states.forEach(s => {
      transitionProb[s] = {};
      actions.forEach(a => {
        const [pSuccess, pFailure] = calculateProbabilities(a, successProb);
        transitionProb[s][a] = {
          [Math.max(0, s - 1)]: pSuccess,
          [s - 1]: pFailure,
        };
      });
    });
    return transitionProb;
  };

  const generateCost = (states, actions, fixedCost, variableCost) => {
    const cost = {};
    states.forEach(s => {
      cost[s] = {};
      actions.forEach(a => {
        cost[s][a] = fixedCost + variableCost * a;
      });
    });
    return cost;
  };

  const handleCalculate = () => {
    const gamma = 1; // Discount factor
    const states = Array.from({ length: maxRuns + 1 }, (_, i) => maxRuns - i);
    const actions = Array.from({ length: maxLotSize }, (_, i) => i + 1);
    const transitionProb = generateTransitionProb(states, actions, successProb);
    const cost = generateCost(states, actions, fixedCost, variableCost);

    const [policy, expectedCosts, iterations] = valueIteration(
      states,
      actions,
      transitionProb,
      cost,
      gamma,
      epsilon,
      failureCost
    );

    setResults({ policy, expectedCosts, iterations });
  };

  return (
    <div className="container">
      <h1>Programación Dinámica Probabilística</h1>
      <div className="form-group">
        <label>Tamaño máximo del lote:</label>
        <input type="number" value={maxLotSize} readOnly />
      </div>
      <div className="form-group">
        <label>Máximo de corridas:</label>
        <input type="number" value={maxRuns} readOnly />
      </div>
      <div className="form-group">
        <label>Probabilidad de éxito por unidad:</label>
        <input type="number" value={successProb} step="0.01" readOnly />
      </div>
      <div className="form-group">
        <label>Costo fijo por corrida ($):</label>
        <input type="number" value={fixedCost} readOnly />
      </div>
      <div className="form-group">
        <label>Costo variable por unidad ($):</label>
        <input type="number" value={variableCost} readOnly />
      </div>
      <div className="form-group">
        <label>Costo por falla ($):</label>
        <input type="number" value={failureCost} readOnly />
      </div>
      <div className="form-group">
        <label>Tolerancia:</label>
        <input type="number" value={epsilon} step="0.001" readOnly />
      </div>
      <button onClick={handleCalculate}>Calcular</button>
      {results && (
        <div>
          <h2>Resultados</h2>
          <h3>Resultado Final:</h3>
          <table>
            <thead>
              <tr>
                <th>Corridas</th>
                <th>Tamaño del Lote</th>
                <th>Costo Esperado</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.policy).map(([state, action]) => (
                <tr key={state}>
                  <td>{state}</td>
                  <td>{action}</td>
                  <td>${results.expectedCosts[state].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HolguraPorRechazos;
