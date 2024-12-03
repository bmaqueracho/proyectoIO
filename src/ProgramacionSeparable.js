import React, { useState } from 'react';

const ProgramacionSeparable = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [coeficientes, setCoeficientes] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  const generarFormulario = () => {
    const nuevosCoeficientes = Array.from({ length: numVariables }, (_, i) => ({
      variable: `x${i + 1}`,
      cuadratico: 0,
      lineal: 0,
    }));

    const nuevasRestricciones = [
      {
        coeficientes: Array(numVariables).fill(0),
        limite: 0,
        tipo: '<=',
      },
    ];

    setCoeficientes(nuevosCoeficientes);
    setRestricciones(nuevasRestricciones);
  };

  const actualizarCoeficiente = (index, campo, value) => {
    const nuevosCoeficientes = [...coeficientes];
    nuevosCoeficientes[index][campo] = parseFloat(value) || 0;
    setCoeficientes(nuevosCoeficientes);
  };

  const actualizarRestriccion = (index, campo, value) => {
    const nuevasRestricciones = [...restricciones];
    if (campo === 'coeficientes') {
      nuevasRestricciones[index].coeficientes = value.map((v) => parseFloat(v) || 0);
    } else {
      nuevasRestricciones[index][campo] = parseFloat(value) || 0;
    }
    setRestricciones(nuevasRestricciones);
  };

  const resolver = () => {
    try {
      const soluciones = coeficientes.map(({ cuadratico, lineal }, index) => {
        let xOpt = 0;
  
        if (cuadratico !== 0) {
          xOpt = -lineal / (2 * cuadratico); // Cálculo estándar para términos cuadráticos
        } else if (lineal < 0) {
          xOpt = 100; // Si no hay término cuadrático y lineal es negativo, maximiza x
        } else {
          xOpt = 0; // Si lineal es positivo o 0, minimiza x
        }
  
        // Aplicar restricciones al valor de xOpt
        restricciones.forEach(({ coeficientes, limite, tipo }) => {
          const coef = coeficientes[index];
          if (coef !== 0) {
            const valorRestriccion = limite / coef;
            if (tipo === '<=') {
              xOpt = Math.min(xOpt, valorRestriccion);
            } else if (tipo === '>=') {
              xOpt = Math.max(xOpt, valorRestriccion);
            }
          }
        });
  
        xOpt = Math.max(0, xOpt); // Asegurarse de que xOpt no sea negativo
  
        return {
          variable: `x${index + 1}`,
          valor: xOpt,
          resultado: cuadratico * xOpt ** 2 + lineal * xOpt,
        };
      });
  
      const restriccionesValidas = restricciones.every(({ coeficientes, limite, tipo }) => {
        const valorRestriccion = coeficientes.reduce(
          (acc, coef, index) => acc + coef * soluciones[index].valor,
          0
        );
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
  
      if (restriccionesValidas) {
        setResultado({
          soluciones,
          resultadoTotal: soluciones.reduce((acc, s) => acc + s.resultado, 0),
        });
      } else {
        alert('Las restricciones no se cumplen.');
      }
    } catch (error) {
      console.error('Error durante la resolución:', error);
      alert('Ocurrió un error al resolver el problema.');
    }
  };
  

  return (
    <div>
      <h1>Modelo de Programación Separable</h1>
      <label>
        Número de variables:
        <input
          type="number"
          value={numVariables}
          onChange={(e) => setNumVariables(Number(e.target.value))}
        />
      </label>
      <button onClick={generarFormulario}>Generar formulario</button>

      {coeficientes.length > 0 && (
        <div>
          <h2>Coeficientes</h2>
          {coeficientes.map(({ variable, cuadratico, lineal }, index) => (
            <div key={index}>
              <label>
                {variable}²:
                <input
                  type="number"
                  value={cuadratico}
                  onChange={(e) => actualizarCoeficiente(index, 'cuadratico', e.target.value)}
                />
              </label>
              <label>
                {variable}:
                <input
                  type="number"
                  value={lineal}
                  onChange={(e) => actualizarCoeficiente(index, 'lineal', e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {restricciones.length > 0 && (
        <div>
          <h2>Restricciones</h2>
          {restricciones.map((restriccion, index) => (
            <div key={index}>
              <label>
                Restricción {index + 1}:
                {coeficientes.map((_, i) => (
                  <input
                    key={`restriccion-${index}-${i}`}
                    type="number"
                    placeholder={`Coef x${i + 1}`}
                    onChange={(e) => {
                      const nuevosCoef = [...restriccion.coeficientes];
                      nuevosCoef[i] = Number(e.target.value);
                      actualizarRestriccion(index, 'coeficientes', nuevosCoef);
                    }}
                  />
                ))}
              </label>
              <select
                value={restriccion.tipo}
                onChange={(e) => actualizarRestriccion(index, 'tipo', e.target.value)}
              >
                <option value="<=">&le;</option>
                <option value=">=">&ge;</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                placeholder="Límite"
                onChange={(e) => actualizarRestriccion(index, 'limite', Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={resolver}>Resolver</button>

      {resultado && (
        <div>
          <h2>Resultados</h2>
          {resultado.soluciones.map(({ variable, valor, resultado }) => (
            <p key={variable}>
              {variable}: {valor.toFixed(2)} (f = {resultado.toFixed(2)})
            </p>
          ))}
          <p>Total: {resultado.resultadoTotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramacionSeparable;
