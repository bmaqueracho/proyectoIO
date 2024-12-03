import React, { useState } from 'react';

function QuantityDiscountCalculator() {
  const [demand, setDemand] = useState(''); // D: Demanda anual
  const [orderingCost, setOrderingCost] = useState(''); // Co: Costo por pedido
  const [interestRate, setInterestRate] = useState(''); // I: Tasa de interés (Almacenamiento)
  const [discountLevels, setDiscountLevels] = useState([{ minQty: '', maxQty: '', price: '' }]);
  const [optimalQuantity, setOptimalQuantity] = useState(null);
  const [minTotalCost, setMinTotalCost] = useState(null);
  const [results, setResults] = useState([]); // Para mostrar los resultados intermedios de cada nivel

  // Manejo de cambios en los niveles de descuento
  const handleDiscountChange = (index, field, value) => {
    const newDiscountLevels = [...discountLevels];
    newDiscountLevels[index][field] = value;
    setDiscountLevels(newDiscountLevels);
  };

  // Agregar nuevo nivel de descuento
  const addDiscountLevel = () => {
    setDiscountLevels([...discountLevels, { minQty: '', maxQty: '', price: '' }]);
  };

  // Fórmula para calcular el EOQ
  const calculateEOQ = (D, Co, I, P) => {
    return Math.sqrt((2 * D * Co) / (I * P));
  };

  // Cálculo de Costo Total (TC) por cada nivel de descuento
  const calculateCost = (Q, Co, I, P, D) => {
    const H = I * P; // Costo de almacenamiento H = I * P
    const totalCost = (D / Q) * Co + (Q / 2) * H + D * P;
    return totalCost;
  };

  // Cálculo del pedido óptimo
  const calculateOptimalOrder = () => {
    if (demand && orderingCost && interestRate && discountLevels.every(level => level.minQty && level.price)) {
      let minCost = Infinity;
      let optimalQ = null;
      const resultDetails = [];

      discountLevels.forEach(level => {
        const D = parseFloat(demand);
        const Co = parseFloat(orderingCost);
        const I = parseFloat(interestRate) / 100; // Convertir a porcentaje
        const P = parseFloat(level.price);
        const minQty = parseFloat(level.minQty);
        const maxQty = parseFloat(level.maxQty) || Infinity; // Si no hay un máximo, es infinito

        // Cálculo del EOQ para el nivel de descuento actual
        let QStar = calculateEOQ(D, Co, I, P);

        // Ajuste de EOQ si no está dentro del rango de descuento
        if (QStar < minQty) {
          QStar = minQty;
        } else if (QStar > maxQty) {
          QStar = maxQty;
        }

        // Cálculo del Costo Total para el EOQ ajustado
        const totalCost = calculateCost(QStar, Co, I, P, D);

        // Guardar los resultados intermedios para mostrar al usuario
        resultDetails.push({
          minQty,
          maxQty: maxQty === Infinity ? '∞' : maxQty,
          price: P,
          EOQ: QStar.toFixed(2),
          totalCost: totalCost.toFixed(2),
        });

        // Comparamos los costos totales para encontrar el mínimo
        if (totalCost < minCost) {
          minCost = totalCost;
          optimalQ = QStar;
        }
      });

      setResults(resultDetails);
      setOptimalQuantity(optimalQ.toFixed(2)); // Redondeamos a 2 decimales
      setMinTotalCost(minCost.toFixed(2));
    } else {
      alert('Por favor, complete todos los campos y niveles de descuento.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Modelo de Descuentos por Cantidad (EOQ)</h2>

      {/* Inputs para los valores principales */}
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
          Costo por Pedido (Co): 
          <input
            type="number"
            value={orderingCost}
            onChange={(e) => setOrderingCost(e.target.value)}
            placeholder="Ingrese el costo por pedido"
            style={{ margin: '10px' }}
          />
        </label>
      </div>
      <div>
        <label>
          Tasa de Interés (%): 
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Ingrese la tasa de interés (%)"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <h3>Niveles de Descuento</h3>
      {discountLevels.map((level, index) => (
        <div key={index}>
          <label>
            Cantidad Mínima ({index + 1}): 
            <input
              type="number"
              value={level.minQty}
              onChange={(e) => handleDiscountChange(index, 'minQty', e.target.value)}
              placeholder="Cantidad mínima para descuento"
              style={{ margin: '10px' }}
            />
          </label>
          <label>
            Cantidad Máxima ({index + 1}): 
            <input
              type="number"
              value={level.maxQty}
              onChange={(e) => handleDiscountChange(index, 'maxQty', e.target.value)}
              placeholder="Cantidad máxima para descuento (opcional)"
              style={{ margin: '10px' }}
            />
          </label>
          <label>
            Precio Unitario ({index + 1}): 
            <input
              type="number"
              value={level.price}
              onChange={(e) => handleDiscountChange(index, 'price', e.target.value)}
              placeholder="Precio por unidad"
              style={{ margin: '10px' }}
            />
          </label>
        </div>
      ))}

      <button onClick={addDiscountLevel} style={{ margin: '10px' }}>Agregar Nivel de Descuento</button>
      <button onClick={calculateOptimalOrder} style={{ margin: '10px' }}>Calcular Pedido Óptimo</button>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultados Intermedios</h3>
          <table style={{ margin: '0 auto', border: '1px solid black' }}>
            <thead>
              <tr>
                <th>Cantidad Mínima</th>
                <th>Cantidad Máxima</th>
                <th>Precio Unitario</th>
                <th>EOQ Calculado</th>
                <th>Costo Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.minQty}</td>
                  <td>{result.maxQty}</td>
                  <td>{result.price}</td>
                  <td>{result.EOQ}</td>
                  <td>{result.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {optimalQuantity && minTotalCost && (
        <div style={{ marginTop: '20px' }}>
          <h3>Cantidad Óptima de Pedido: {optimalQuantity} unidades</h3>
          <h3>Costo Total Mínimo: {minTotalCost} </h3>
        </div>
      )}
    </div>
  );
}

export default QuantityDiscountCalculator;
