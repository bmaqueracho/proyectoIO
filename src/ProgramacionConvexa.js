import React, { useState } from 'react';

const ProgramacionConvexa = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [coeficientesObjetivo, setCoeficientesObjetivo] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  const inicializarFormulario = () => {
    const nuevosCoeficientes = Array(numVariables).fill(0).map(() => ({
      cuadratico: 1,
      lineal: 0,
    }));
    setCoeficientesObjetivo(nuevosCoeficientes);

    const nuevasRestricciones = Array.from({ length: 2 }, () => ({
      coeficientes: Array(numVariables).fill(1),
      limite: 10,
      tipo: '≤',
    }));
    setRestricciones(nuevasRestricciones);
  };

  const actualizarObjetivo = (index, campo, valor) => {
    const nuevosCoeficientes = [...coeficientesObjetivo];
    nuevosCoeficientes[index][campo] = parseFloat(valor) || 0;
    setCoeficientesObjetivo(nuevosCoeficientes);
  };

  const actualizarRestriccion = (index, campo, valor, coefIndex) => {
    const nuevasRestricciones = [...restricciones];
    if (campo === 'coeficientes') {
      nuevasRestricciones[index].coeficientes[coefIndex] = parseFloat(valor) || 0;
    } else if (campo === 'tipo') {
      nuevasRestricciones[index].tipo = valor;
    } else {
      nuevasRestricciones[index].limite = parseFloat(valor) || 0;
    }
    setRestricciones(nuevasRestricciones);
  };

  const gradienteProyectado = (variablesIniciales, iteraciones = 1000, tasaAprendizaje = 0.01) => {
    let variables = [...variablesIniciales];

    for (let iter = 0; iter < iteraciones; iter++) {
      const gradiente = variables.map((_, i) => {
        const { cuadratico, lineal } = coeficientesObjetivo[i];
        return 2 * cuadratico * variables[i] + lineal;
      });

      let nuevasVariables = variables.map((v, i) => v - tasaAprendizaje * gradiente[i]);

      nuevasVariables = proyectarRestricciones(nuevasVariables);

      if (norma(gradiente) < 1e-6) break;

      variables = [...nuevasVariables];
    }

    return variables;
  };

  const proyectarRestricciones = (variables) => {
    return restricciones.reduce((vars, { coeficientes, limite, tipo }) => {
      const valorRestriccion = coeficientes.reduce((sum, coef, i) => sum + coef * vars[i], 0);
      if (tipo === '≤' && valorRestriccion > limite) {
        const factor = limite / valorRestriccion;
        return vars.map((v) => v * factor);
      }
      return vars;
    }, variables);
  };

  const norma = (vector) => Math.sqrt(vector.reduce((sum, v) => sum + v ** 2, 0));

  const calcularObjetivo = (variables) =>
    variables.reduce(
      (sum, x, i) =>
        sum +
        coeficientesObjetivo[i].cuadratico * x ** 2 +
        coeficientesObjetivo[i].lineal * x,
      0
    );

  const resolver = () => {
    const variablesIniciales = Array(numVariables).fill(1);
    const solucion = gradienteProyectado(variablesIniciales);
    const valorObjetivo = calcularObjetivo(solucion);
    setResultado({ variables: solucion, objetivo: valorObjetivo });
  };

  return (
    <div>
      <h1>Programación Convexa Optimizada</h1>

      <label>Número de variables:</label>
      <input
        type="number"
        min="2"
        value={numVariables}
        onChange={(e) => setNumVariables(parseInt(e.target.value, 10) || 2)}
      />
      <button onClick={inicializarFormulario}>Inicializar Formulario</button>

      {coeficientesObjetivo.length > 0 && (
        <div>
          <h2>Función Objetivo</h2>
          {coeficientesObjetivo.map(({ cuadratico, lineal }, index) => (
            <div key={`obj-${index}`}>
              <label>
                Coef. Cuadrático (x{index + 1}²):
                <input
                  type="number"
                  value={cuadratico}
                  onChange={(e) => actualizarObjetivo(index, 'cuadratico', e.target.value)}
                />
              </label>
              <label>
                Coef. Lineal (x{index + 1}):
                <input
                  type="number"
                  value={lineal}
                  onChange={(e) => actualizarObjetivo(index, 'lineal', e.target.value)}
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
            <div key={`res-${index}`}>
              {restriccion.coeficientes.map((coef, coefIndex) => (
                <input
                  key={`coef-${index}-${coefIndex}`}
                  type="number"
                  placeholder={`Coef x${coefIndex + 1}`}
                  value={coef}
                  onChange={(e) =>
                    actualizarRestriccion(index, 'coeficientes', e.target.value, coefIndex)
                  }
                />
              ))}
              <select
                value={restriccion.tipo}
                onChange={(e) => actualizarRestriccion(index, 'tipo', e.target.value)}
              >
                <option value="≤">≤</option>
                <option value="≥">≥</option>
              </select>
              <input
                type="number"
                placeholder="Límite"
                value={restriccion.limite}
                onChange={(e) => actualizarRestriccion(index, 'limite', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={resolver}>Resolver</button>

      {resultado && (
        <div>
          <h2>Resultado</h2>
          {resultado.variables.map((val, i) => (
            <p key={`res-${i}`}>x{i + 1} = {val.toFixed(4)}</p>
          ))}
          <p>Valor Óptimo: {resultado.objetivo.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramacionConvexa;
