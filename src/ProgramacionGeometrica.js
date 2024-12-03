import React, { useState } from 'react';

const ProgramacionGeometricaOptimizada = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [coeficientesObjetivo, setCoeficientesObjetivo] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  const inicializarFormulario = () => {
    const nuevosCoeficientes = Array(numVariables).fill(0).map(() => ({
      c: 1,
      exponentes: Array(numVariables).fill(0),
    }));
    setCoeficientesObjetivo(nuevosCoeficientes);

    const nuevasRestricciones = Array.from({ length: 2 }, () => ({
      coeficientes: Array(numVariables).fill(1),
      exponentes: Array(numVariables).fill(0),
      limite: 1,
      tipo: '≤',
    }));
    setRestricciones(nuevasRestricciones);
  };

  const actualizarObjetivo = (index, campo, valor, expIndex) => {
    const nuevosCoeficientes = [...coeficientesObjetivo];
    if (campo === 'c') {
      nuevosCoeficientes[index].c = parseFloat(valor) || 1;
    } else {
      nuevosCoeficientes[index].exponentes[expIndex] = parseFloat(valor) || 0;
    }
    setCoeficientesObjetivo(nuevosCoeficientes);
  };

  const actualizarRestriccion = (index, campo, valor, expIndex) => {
    const nuevasRestricciones = [...restricciones];
    if (campo === 'coeficientes') {
      nuevasRestricciones[index].coeficientes[expIndex] = parseFloat(valor) || 0;
    } else if (campo === 'exponentes') {
      nuevasRestricciones[index].exponentes[expIndex] = parseFloat(valor) || 0;
    } else if (campo === 'tipo') {
      nuevasRestricciones[index][campo] = valor;
    } else {
      nuevasRestricciones[index][campo] = parseFloat(valor) || 1;
    }
    setRestricciones(nuevasRestricciones);
  };

  const gradienteDescendente = (variablesIniciales, iteraciones = 1000, tasaAprendizaje = 0.01) => {
    let variables = [...variablesIniciales];
    for (let iter = 0; iter < iteraciones; iter++) {
      const gradientes = variables.map((_, i) => {
        const delta = 0.0001;
        const variablesDelta = [...variables];
        variablesDelta[i] += delta;

        const f1 = calcularObjetivo(variables);
        const f2 = calcularObjetivo(variablesDelta);

        return (f2 - f1) / delta;
      });

      variables = variables.map((v, i) => v - tasaAprendizaje * gradientes[i]);

      if (restriccionesValidas(variables)) break;
    }
    return variables;
  };

  const calcularObjetivo = (variables) =>
    coeficientesObjetivo.reduce(
      (prod, { c, exponentes }) =>
        prod *
        c *
        variables.reduce((p, xi, j) => p * Math.pow(xi, exponentes[j]), 1),
      1
    );

  const restriccionesValidas = (variables) =>
    restricciones.every(({ coeficientes, exponentes, limite, tipo }) => {
      const valor = coeficientes.reduce(
        (prod, coef, i) => prod * coef * Math.pow(variables[i], exponentes[i]),
        1
      );
      if (tipo === '≤') return valor <= limite;
      if (tipo === '≥') return valor >= limite;
      return Math.abs(valor - limite) < 1e-6;
    });

  const resolver = () => {
    const variablesIniciales = Array(numVariables).fill(1); // Inicialización
    const solucion = gradienteDescendente(variablesIniciales);
    const valorObjetivo = calcularObjetivo(solucion);
    setResultado({ variables: solucion, objetivo: valorObjetivo });
  };

  return (
    <div>
      <h1>Programación Geométrica Optimizada</h1>

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
          {coeficientesObjetivo.map(({ c, exponentes }, index) => (
            <div key={`obj-${index}`}>
              <label>
                Coeficiente c:
                <input
                  type="number"
                  value={c}
                  onChange={(e) => actualizarObjetivo(index, 'c', e.target.value)}
                />
              </label>
              {exponentes.map((exp, expIndex) => (
                <label key={`exp-${index}-${expIndex}`}>
                  Exponente x{expIndex + 1}:
                  <input
                    type="number"
                    value={exp}
                    onChange={(e) =>
                      actualizarObjetivo(index, 'exponentes', e.target.value, expIndex)
                    }
                  />
                </label>
              ))}
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
              {restriccion.exponentes.map((exp, expIndex) => (
                <input
                  key={`exp-${index}-${expIndex}`}
                  type="number"
                  placeholder={`Exp x${expIndex + 1}`}
                  value={exp}
                  onChange={(e) =>
                    actualizarRestriccion(index, 'exponentes', e.target.value, expIndex)
                  }
                />
              ))}
              <select
                value={restriccion.tipo}
                onChange={(e) => actualizarRestriccion(index, 'tipo', e.target.value)}
              >
                <option value="≤">≤</option>
                <option value="≥">≥</option>
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

export default ProgramacionGeometricaOptimizada;
