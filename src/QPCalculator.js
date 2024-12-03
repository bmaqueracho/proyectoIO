import React, { useState } from "react";

const ProgramacionCuadratica = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [numRestricciones, setNumRestricciones] = useState(2);
  const [formularioGenerado, setFormularioGenerado] = useState([]);
  const [resultado, setResultado] = useState(null);

  const generarFormulario = () => {
    const formularioHTML = [];

    // Función objetivo
    formularioHTML.push(
      <div key="objetivo">
        <h2>Función Objetivo</h2>
        {[...Array(numVariables)].map((_, i) => (
          <div key={`var${i + 1}`}>
            <input
              type="number"
              placeholder={`Coeficiente lineal de x${i + 1}`}
              name={`coefLinearVar${i + 1}`}
              required
            />
            <input
              type="number"
              placeholder={`Coeficiente cuadrático de x${i + 1}^2`}
              name={`coefCuadVar${i + 1}`}
              required
            />
          </div>
        ))}
        <h3>Términos de interacción:</h3>
        {[...Array(numVariables)].map((_, i) =>
          [...Array(numVariables)].map((_, j) =>
            i < j ? (
              <input
                key={`coefInterVar${i + 1}${j + 1}`}
                type="number"
                placeholder={`Coef x${i + 1}x${j + 1}`}
                name={`coefInterVar${i + 1}${j + 1}`}
                required
              />
            ) : null
          )
        )}
      </div>
    );

    // Restricciones
    formularioHTML.push(
      <div key="restricciones">
        <h2>Restricciones</h2>
        {[...Array(numRestricciones)].map((_, j) => (
          <div key={`restriccion${j + 1}`}>
            <h3>Restricción {j + 1}</h3>
            <h4>Lado Izquierdo:</h4>
            {[...Array(numVariables)].map((_, i) => (
              <input
                key={`coefRestIzq${j + 1}Var${i + 1}`}
                type="number"
                placeholder={`Coef Variable x${i + 1}`}
                name={`coefRestIzq${j + 1}Var${i + 1}`}
                required
              />
            ))}
            <select name={`simboloRest${j + 1}`} key={`simboloRest${j + 1}`}>
              <option value="<=">&le;</option>
              <option value=">=">&ge;</option>
              <option value="=">=</option>
            </select>
            <input
              key={`montoRestDer${j + 1}`}
              type="number"
              placeholder="Límite"
              name={`montoRestDer${j + 1}`}
              required
            />
          </div>
        ))}
      </div>
    );

    setFormularioGenerado(formularioHTML);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const coefLineales = [];
    const coefCuadraticos = [];
    const coefInteracciones = Array(numVariables)
      .fill(null)
      .map(() => Array(numVariables).fill(0));
    const restricciones = [];

    // Obtener coeficientes lineales y cuadráticos
    for (let i = 1; i <= numVariables; i++) {
      coefLineales.push(parseFloat(event.target[`coefLinearVar${i}`].value));
      coefCuadraticos.push(parseFloat(event.target[`coefCuadVar${i}`].value));
    }

    // Obtener coeficientes de interacción
    for (let i = 1; i <= numVariables; i++) {
      for (let j = i + 1; j <= numVariables; j++) {
        coefInteracciones[i - 1][j - 1] = parseFloat(
          event.target[`coefInterVar${i}${j}`]?.value || 0
        );
        coefInteracciones[j - 1][i - 1] =
          coefInteracciones[i - 1][j - 1]; // Simetría
      }
    }

    // Obtener restricciones
    for (let j = 1; j <= numRestricciones; j++) {
      const restriccion = {
        coeficientes: [],
        simbolo: event.target[`simboloRest${j}`].value,
        limite: parseFloat(event.target[`montoRestDer${j}`].value),
      };

      for (let i = 1; i <= numVariables; i++) {
        restriccion.coeficientes.push(
          parseFloat(event.target[`coefRestIzq${j}Var${i}`].value)
        );
      }

      restricciones.push(restriccion);
    }

    const resultado = resolverOptimizacion(
      coefLineales,
      coefCuadraticos,
      coefInteracciones,
      restricciones
    );
    setResultado(resultado);
  };

  const resolverOptimizacion = (
    coefLineales,
    coefCuadraticos,
    coefInteracciones,
    restricciones
  ) => {
    let mejorValor = -Infinity;
    let mejorSolucion = {};

    for (let x1 = 0; x1 <= 100; x1++) {
      for (let x2 = 0; x2 <= 100; x2++) {
        const valores = [x1, x2];

        // Calcular valor objetivo
        let valorObjetivo =
          coefLineales[0] * x1 +
          coefLineales[1] * x2 +
          coefCuadraticos[0] * x1 ** 2 +
          coefCuadraticos[1] * x2 ** 2 +
          coefInteracciones[0][1] * x1 * x2;

        // Verificar restricciones
        let factible = true;
        for (let restriccion of restricciones) {
          const valorRestriccion = restriccion.coeficientes.reduce(
            (acc, coef, i) => acc + coef * valores[i],
            0
          );

          switch (restriccion.simbolo) {
            case "<=":
              if (valorRestriccion > restriccion.limite) factible = false;
              break;
            case ">=":
              if (valorRestriccion < restriccion.limite) factible = false;
              break;
            case "=":
              if (valorRestriccion !== restriccion.limite) factible = false;
              break;
            default:
              break;
          }

          if (!factible) break;
        }

        if (factible && valorObjetivo > mejorValor) {
          mejorValor = valorObjetivo;
          mejorSolucion = { x1, x2 };
        }
      }
    }

    return { mejorValor, mejorSolucion };
  };

  return (
    <div>
      <h1>Programación Cuadrática</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Variables:
            <input
              type="number"
              min="1"
              value={numVariables}
              onChange={(e) => setNumVariables(parseInt(e.target.value))}
            />
          </label>
          <label>
            Restricciones:
            <input
              type="number"
              min="1"
              value={numRestricciones}
              onChange={(e) => setNumRestricciones(parseInt(e.target.value))}
            />
          </label>
        </div>
        <button type="button" onClick={generarFormulario}>
          Generar Formulario
        </button>
        {formularioGenerado}
        {formularioGenerado.length > 0 && <button type="submit">Calcular</button>}
      </form>
      {resultado && (
        <div>
          <h2>Resultado</h2>
          <p>Valor óptimo: {resultado.mejorValor}</p>
          <p>Solución óptima: {JSON.stringify(resultado.mejorSolucion)}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramacionCuadratica;
