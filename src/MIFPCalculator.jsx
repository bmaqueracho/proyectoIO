import React, { useState } from 'react';

function MIFPCalculator() {
  // Definimos los estados para cada dato ingresado
  const [D, setD] = useState(); // Demanda anual
  const [C, setC] = useState(); // Costo unitario
  const [Ch, setCh] = useState(); // Costo de almacenamiento
  const [Co, setCo] = useState(); // Costo por pedido
  const [Cf, setCf] = useState(); // Costo por unidad faltante
  const [diasHabiles, setDiasHabiles] = useState(); // Días hábiles
 

  // Función para calcular la cantidad óptima de pedido (Q)
  const calcularQ = () => {
    return Math.sqrt(((2 * Co * D) / Ch)*(Ch + Cf)/Cf);
  };

  // Función para calcular los faltantes permitidos (S)
  const calcularS = (Q) => {
    return (Ch / (Ch + Cf)) * Q;
  };

  // Función para calcular el tiempo de ciclo entre pedidos (T)
  const calcularT = (Q) => {
    return (diasHabiles * Q) / D;
  };

  // Función para calcular el tiempo de duración de inventario (t1)
  const calcularT1 = (Q, S, T) => {
    return ((Q - S) / Q) * T;
  };

  // Función para calcular el tiempo de escasez (t2)
  const calcularT2 = (T, t1) => {
    return (T - t1);
  };

  // Función para calcular el inventario máximo (Imax)
  const calcularImax = (Q, S) => {
    return Q - S;
  };

  // Función para calcular el inventario promedio (Iprom)
  const calcularIprom = (Imax) => {
    return (Imax ** 2) / (2 * Q);
  };

  // Función para calcular el número de órdenes por año (N)
  const calcularN = (Q) => {
    return D / Q;
  };

  // Función para calcular el costo de inversión anual en inventario (Cinv)
  const calcularCinv = (C, D,CT) => {
    return (D * C )+CT;
  };

  // Función para calcular el costo total anual (CT)
  const calcularCT = (Q, S) => {
    return (D / Q) * Co + (Ch * (Q - S) ** 2) / (2 * Q) + (Cf * S ** 2) / (2 * Q);
  };

  // Calcular resultados basados en la cantidad óptima de pedido (Q)
  const Q = calcularQ();
  const S = calcularS(Q);
  const T = calcularT(Q);
  const t1 = calcularT1(Q, S, T);
  const t2 = calcularT2(T, t1);
  const Imax = calcularImax(Q, S);
  const Iprom = calcularIprom(Imax);
  const N = calcularN(Q);
  const CT = calcularCT(Q, S);
  const Cinv = calcularCinv(C, D, CT);
    

  return (
    <div>
      <h1>Calculadora de Modelo de Inventario con Faltantes Planeado (MIFP)</h1>
      <label>Cantidad anual requerida (D):</label>
      <input type="number" value={D} onChange={(e) => setD(Number(e.target.value))} />
      <label>Costo unitario (C):</label>
      <input type="number" value={C} onChange={(e) => setC(Number(e.target.value))} />
      <label>Costo por almacenamiento (Ch):</label>
      <input type="number" value={Ch} onChange={(e) => setCh(Number(e.target.value))} />
      <label>Costo por pedido (Co):</label>
      <input type="number" value={Co} onChange={(e) => setCo(Number(e.target.value))} />
      <label>Costo por unidad faltante (Cf):</label>
      <input type="number" value={Cf} onChange={(e) => setCf(Number(e.target.value))} />
      <label>Días hábiles:</label>
      <input type="number" value={diasHabiles} onChange={(e) => setDiasHabiles(Number(e.target.value))} />

      <h2>Resultados</h2>
      <h3>Cantidad óptima de pedido (Q): {Q.toFixed(2)}</h3>
<h3>Faltantes permitidos (S): {S.toFixed(2)}</h3>
<h3>Tiempo de ciclo entre pedidos (T): {T.toFixed(2)}</h3>
<h3>Tiempo de duración de inventario (t1): {t1.toFixed(2)}</h3>
<h3>Tiempo de escasez (t2): {t2.toFixed(2)}</h3>
<h3>Inventario máximo (Imax): {Imax.toFixed(2)}</h3>
<h3>Inventario promedio (Iprom): {Iprom.toFixed(2)}</h3>
<h3>Número de órdenes por año (N): {N.toFixed(2)}</h3>
<h3>Costo de inversión anual en inventario (Cinv): {Cinv.toFixed(2)}</h3>
<h3>Costo total anual (CT): {CT.toFixed(2)}</h3>

    </div>
  );
}

export default MIFPCalculator;
