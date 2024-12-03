import React, { useState } from 'react';

const ProgramacionNoConvexa = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [coeficientes, setCoeficientes] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  // Generar formulario
  const generarFormulario = () => {
    setCoeficientes(
      Array.from({ length: numVariables }, (_, i) => ({
        variable: `x${i + 1}`,
        cubico: 0,
        cuadratico: 0,
        lineal: 0,
      }))
    );
    setRestricciones([
      {
        coeficientes: Array(numVariables).fill(0),
        limite: 0,
        tipo: '<=',
      },
    ]);
  };

  // Actualizar coeficientes
  const actualizarCoeficiente = (index, campo, value) => {
    const nuevosCoeficientes = [...coeficientes];
    nuevosCoeficientes[index][campo] = parseFloat(value) || 0;
    setCoeficientes(nuevosCoeficientes);
  };

  // Actualizar restricciones
  const actualizarRestriccion = (index, campo, value, subIndex = null) => {
    const nuevasRestricciones = [...restricciones];
    if (campo === 'coeficientes' && subIndex !== null) {
      nuevasRestricciones[index].coeficientes[subIndex] = parseFloat(value) || 0;
    } else {
      nuevasRestricciones[index][campo] = campo === 'tipo' ? value : parseFloat(value) || 0;
    }
    setRestricciones(nuevasRestricciones);
  };

  // Agregar restricción
  const agregarRestriccion = () => {
    setRestricciones([
      ...restricciones,
      {
        coeficientes: Array(numVariables).fill(0),
        limite: 0,
        tipo: '<=',
      },
    ]);
  };

  // Resolver programación no convexa
  const resolver = () => {
    try {
      const soluciones = coeficientes.map(({ cubico, cuadratico, lineal }, index) => {
        let xOpt = 0;
        if (cubico !== 0) {
          xOpt = -lineal / (3 * cubico);
        } else if (cuadratico !== 0) {
          xOpt = -lineal / (2 * cuadratico);
        } else {
          xOpt = lineal < 0 ? 100 : 0;
        }
        xOpt = Math.max(0, Math.min(100, xOpt));
        const resultado = cubico * xOpt ** 3 + cuadratico * xOpt ** 2 + lineal * xOpt;
        return { variable: `x${index + 1}`, valor: xOpt, resultado };
      });

      const restriccionesCumplidas = restricciones.every(({ coeficientes, limite, tipo }) => {
        const valorRestriccion = coeficientes.reduce((sum, coef, i) => sum + coef * soluciones[i].valor, 0);
        switch (tipo) {
          case '<=':
            return valorRestriccion <= limite;
          case '>=':
            return valorRestriccion >= limite;
          case '=':
            return Math.abs(valorRestriccion - limite) < 1e-6;
          default:
            return false;
        }
      });

      if (restriccionesCumplidas) {
        const resultadoTotal = soluciones.reduce((sum, sol) => sum + sol.resultado, 0);
        setResultado({ soluciones, resultadoTotal });
      } else {
        alert('Las soluciones no cumplen con las restricciones.');
      }
    } catch (error) {
      console.error("Error al resolver:", error);
      alert('Error en la resolución. Revisa los datos.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Programación No Convexa</h1>
      <label>
        Número de variables:
        <input
          type="number"
          min="1"
          value={numVariables}
          onChange={(e) => setNumVariables(parseInt(e.target.value))}
        />
      </label>
      <button onClick={generarFormulario}>Generar Formulario</button>

      {coeficientes.length > 0 && (
        <div>
          <h2>Coeficientes</h2>
          {coeficientes.map(({ variable, cubico, cuadratico, lineal }, index) => (
            <div key={index}>
              <label>{variable}³:</label>
              <input
                type="number"
                value={cubico}
                onChange={(e) => actualizarCoeficiente(index, 'cubico', e.target.value)}
              />
              <label>{variable}²:</label>
              <input
                type="number"
                value={cuadratico}
                onChange={(e) => actualizarCoeficiente(index, 'cuadratico', e.target.value)}
              />
              <label>{variable}:</label>
              <input
                type="number"
                value={lineal}
                onChange={(e) => actualizarCoeficiente(index, 'lineal', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {restricciones.length > 0 && (
        <div>
          <h2>Restricciones</h2>
          {restricciones.map((restriccion, index) => (
            <div key={index}>
              {restriccion.coeficientes.map((coef, subIndex) => (
                <input
                  key={subIndex}
                  type="number"
                  placeholder={`Coef x${subIndex + 1}`}
                  value={coef}
                  onChange={(e) =>
                    actualizarRestriccion(index, 'coeficientes', e.target.value, subIndex)
                  }
                />
              ))}
              <select
                value={restriccion.tipo}
                onChange={(e) => actualizarRestriccion(index, 'tipo', e.target.value)}
              >
                <option value="<=">≤</option>
                <option value=">=">≥</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                placeholder="Límite"
                value={restriccion.limite}
                onChange={(e) => actualizarRestriccion(index, 'limite', e.target.value)}
              />
            </div>
          ))}
          <button onClick={agregarRestriccion}>Agregar Restricción</button>
        </div>
      )}

      <button onClick={resolver}>Resolver</button>

      {resultado && (
        <div>
          <h2>Resultado</h2>
          {resultado.soluciones.map(({ variable, valor, resultado }) => (
            <p key={variable}>
              {variable} = {valor.toFixed(2)} (f({variable}) = {resultado.toFixed(2)})
            </p>
          ))}
          <h3>Total: {resultado.resultadoTotal.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default ProgramacionNoConvexa;
