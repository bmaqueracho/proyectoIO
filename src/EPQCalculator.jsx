import React, { useState } from 'react';

function EPQCalculator() {
  const [demand, setDemand] = useState('');          // D: Demanda anual
  const [productionRate, setProductionRate] = useState('');  // P: Producción anual
  const [productionCost, setProductionCost] = useState('');  // C: Costo de producción
  const [orderingCost, setOrderingCost] = useState('');      // Co: Costo de preparación/pedido
  const [workingDays, setWorkingDays] = useState('');        // DH: Días hábiles
  const [holdingCost, setHoldingCost] = useState('');        // Ch: Costo de retención
  const [interestRate, setInterestRate] = useState('');      // I: Interés en porcentaje

  const [useInterest, setUseInterest] = useState(false);     // Opción entre usar Ch o I

  const [results, setResults] = useState(null);

  const calculateEPQ = () => {
    if (demand && productionRate && productionCost && orderingCost && workingDays) {
      // Validar si se ha ingresado el costo de retención (Ch) o el interés (I)
      let Ch = holdingCost;
      if (useInterest) {
        if (!interestRate) {
          alert('Debe ingresar el interés cuando se selecciona usar el interés.');
          return;
        }
        Ch = (interestRate / 100) * productionCost;  // Calcular Ch usando el interés (I)
      }

      if (!Ch) {
        alert('Debe ingresar el costo de retención (Ch) o seleccionar usar el interés.');
        return;
      }

      if (productionRate <= demand) {
        alert('La tasa de producción (P) debe ser mayor que la demanda (D).');
        return;
      }

      // Fórmula para EPQ (Q*)
      const Q = Math.sqrt((2 * demand * orderingCost) / (Ch * (1 - demand / productionRate)));

      // Cálculo del tiempo de ciclo (T)
      const T = workingDays / (demand / Q);

      // Producción diaria (p)
      const p = productionRate / workingDays;

      // Tiempo de duración de la fase de producción (t)
      const t = Q / p;

      // Costo anual de retención
      const holdingCostAnnual = 0.5 * (1 - demand / productionRate) * Q * Ch;

      // Costo anual de preparación
      const preparationCostAnnual = (demand / Q) * orderingCost;

      // Costo total anual (TC)
      const totalCost = preparationCostAnnual + holdingCostAnnual;

      setResults({
        Q: Q.toFixed(2),
        T: T.toFixed(2),
        p: p.toFixed(2),
        t: t.toFixed(2),
        holdingCostAnnual: holdingCostAnnual.toFixed(2),
        preparationCostAnnual: preparationCostAnnual.toFixed(2),
        totalCost: totalCost.toFixed(2),
      });
    } else {
      alert('Por favor, ingrese todos los valores requeridos.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Modelo de Lote de Producción (EPQ)</h2>
      <div>
        <label>
          Demanda Anual (D): 
          <input
            type="number"
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            placeholder="Ingrese la demanda anual"
            style={{ margin: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Producción Anual (P): 
          <input
            type="number"
            value={productionRate}
            onChange={(e) => setProductionRate(e.target.value)}
            placeholder="Ingrese la producción anual"
            style={{ margin: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Costo de Producción (C): 
          <input
            type="number"
            value={productionCost}
            onChange={(e) => setProductionCost(e.target.value)}
            placeholder="Ingrese el costo de producción"
            style={{ margin: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Costo de Preparación (Co): 
          <input
            type="number"
            value={orderingCost}
            onChange={(e) => setOrderingCost(e.target.value)}
            placeholder="Ingrese el costo de preparación"
            style={{ margin: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Días Hábiles (DH): 
          <input
            type="number"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            placeholder="Ingrese los días hábiles"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      {/* Selección entre Ch o Interés */}
      <div style={{ margin: '10px' }}>
        <label>
          <input
            type="radio"
            checked={!useInterest}
            onChange={() => setUseInterest(false)}
          />
          Ingresar Costo de Retención (Ch)
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            checked={useInterest}
            onChange={() => setUseInterest(true)}
          />
          Usar Interés (I)
        </label>
      </div>

      {!useInterest && (
        <div>
          <label>
            Costo de Retención (Ch): 
            <input
              type="number"
              value={holdingCost}
              onChange={(e) => setHoldingCost(e.target.value)}
              placeholder="Ingrese el costo de retención"
              style={{ margin: '10px' }}
            />
          </label>
        </div>
      )}

      {useInterest && (
        <div>
          <label>
            Interés (I) [%]: 
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Ingrese el interés (%)"
              style={{ margin: '10px' }}
            />
          </label>
        </div>
      )}

      <button onClick={calculateEPQ} style={{ margin: '10px' }}>Calcular</button>

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultados:</h3>
          <p>Tamaño del lote de producción (Q*): {results.Q} unidades</p>
          <p>Tiempo de ciclo (T): {results.T} días</p>
          <p>Producción diaria (p): {results.p} unidades</p>
          <p>Duración de la fase de producción (t): {results.t} días</p>
          <p>Costo anual de retención: {results.holdingCostAnnual}</p>
          <p>Costo anual de preparación: {results.preparationCostAnnual}</p>
          <p>Costo total anual (TC): {results.totalCost}</p>
        </div>
      )}
    </div>
  );
}

export default EPQCalculator;
