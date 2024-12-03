import React, { useState } from 'react';

function CalculadoraEOQ() {
  const [demanda, setDemanda] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [costoPedido, setCostoPedido] = useState('');
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState('');
  const [interes, setInteres] = useState('');
  const [tiempoEspera, setTiempoEspera] = useState('');
  const [usarInteres, setUsarInteres] = useState(false); 
  const [diasAnio, setDiasAnio] = useState(365); // Para elegir entre 365 o 250 días
  const [eoq, setEoq] = useState(null);
  const [costoOrdenar, setCostoOrdenar] = useState(null);
  const [costoMantener, setCostoMantener] = useState(null);
  const [costoTotal, setCostoTotal] = useState(null);
  const [puntoReorden, setPuntoReorden] = useState(null);
  const [tiempoCiclo, setTiempoCiclo] = useState(null); // Estado para el tiempo de ciclo

  const calcularEOQ = () => {
    let ch;

    if (usarInteres && interes && costoUnitario) {
      ch = (interes / 100) * costoUnitario;
    } else if (costoAlmacenamiento) {
      ch = parseFloat(costoAlmacenamiento);
    } else {
      alert('Por favor, ingrese todos los valores.');
      return;
    }

    if (demanda && costoPedido && ch) {
      const valorEOQ = Math.sqrt((2 * demanda * costoPedido) / ch);
      setEoq(Math.round(valorEOQ));

      const costoOrdenarValue = (demanda / valorEOQ) * costoPedido;
      setCostoOrdenar(Math.round(costoOrdenarValue));

      const costoMantenerValue = (valorEOQ / 2) * ch;
      setCostoMantener(Math.round(costoMantenerValue));

      const costoTotalValue = costoOrdenarValue + costoMantenerValue;
      setCostoTotal(Math.round(costoTotalValue));

      if (tiempoEspera) {
        const demandaDiaria = demanda / diasAnio;
        const puntoReordenValue = demandaDiaria * tiempoEspera;
        setPuntoReorden(Math.round(puntoReordenValue));
      } else {
        alert('Por favor, ingrese el tiempo de espera en días.');
      }

      // Cálculo del número de órdenes y el tiempo de ciclo
      const numeroOrdenes = demanda / valorEOQ; // D/Q
      const tiempoCicloValue = diasAnio / numeroOrdenes; // (365 o 250) / número de órdenes
      setTiempoCiclo(Math.round(tiempoCicloValue)); // Redondear tiempo de ciclo
    } else {
      alert('Por favor, ingrese todos los valores.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Modelo EOQ (Cantidad Económica de Pedido)</h2>

      <div>
        <label>
          Demanda Anual (D): 
          <input
            type="number"
            value={demanda}
            onChange={(e) => setDemanda(e.target.value)}
            placeholder="Ingrese la demanda anual"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Costo Unitario (C): 
          <input
            type="number"
            value={costoUnitario}
            onChange={(e) => setCostoUnitario(e.target.value)}
            placeholder="Ingrese el costo unitario"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Costo por Pedido (Co): 
          <input
            type="number"
            value={costoPedido}
            onChange={(e) => setCostoPedido(e.target.value)}
            placeholder="Ingrese el costo por pedido"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Costo de Almacenamiento (Ch) o Interés (%): 
          <input
            type="number"
            value={costoAlmacenamiento}
            onChange={(e) => setCostoAlmacenamiento(e.target.value)}
            placeholder="Ingrese el costo de almacenamiento"
            style={{ margin: '10px' }}
            disabled={usarInteres}
          />
        </label>
      </div>

      <div>
        <label>
          Usar Interés (%):
          <input
            type="checkbox"
            checked={usarInteres}
            onChange={() => setUsarInteres(!usarInteres)}
            style={{ margin: '10px' }}
          />
        </label>
        {usarInteres && (
          <div>
            <label>
              Interés (I): 
              <input
                type="number"
                value={interes}
                onChange={(e) => setInteres(e.target.value)}
                placeholder="Ingrese el interés en porcentaje"
                style={{ margin: '10px' }}
              />
            </label>
          </div>
        )}
      </div>

      <div>
        <label>
          Tiempo de Espera (m) en días: 
          <input
            type="number"
            value={tiempoEspera}
            onChange={(e) => setTiempoEspera(e.target.value)}
            placeholder="Ingrese el tiempo de espera"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Número de días (365 o 250): 
          <input
            type="number"
            value={diasAnio}
            onChange={(e) => setDiasAnio(e.target.value)}
            placeholder="Ingrese 365 o 250 días"
            style={{ margin: '10px' }}
          />
        </label>
      </div>

      <button onClick={calcularEOQ} style={{ margin: '10px' }}>Calcular EOQ</button>

      {eoq && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultado EOQ: {eoq} unidades</h3>
          <h3>Costo Anual por Ordenar: {costoOrdenar} unidades monetarias</h3>
          <h3>Costo Anual por Mantener: {costoMantener} unidades monetarias</h3>
          <h3>Costo Total Anual: {costoTotal} unidades monetarias</h3>
          {puntoReorden && (
            <h3>Punto de Reorden: {puntoReorden} unidades</h3>
          )}
          {tiempoCiclo && (
            <h3>Tiempo de Ciclo: {tiempoCiclo} días</h3>
          )}

        </div>
      )}
    </div>
  );
}

export default CalculadoraEOQ;
