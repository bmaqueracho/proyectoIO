import React, { useState } from 'react';

const Optimizacion = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [numRestricciones, setNumRestricciones] = useState(2);
  const [formularioGenerado, setFormularioGenerado] = useState([]);
  const [resultado, setResultado] = useState(null);

  const generarFormulario = () => {
    let formularioHTML = [];

    // Función objetivo
    formularioHTML.push(
      <div key="objetivo">
        <h2>Función Objetivo</h2>
        {[...Array(numVariables)].map((_, i) => (
          <input
            key={`coefVar${i + 1}`}
            type="number"
            placeholder={`Coeficiente de la variable ${i + 1}`}
            name={`coefVar${i + 1}`}
            required
          />
        ))}
      </div>
    );

    // Restricciones
    formularioHTML.push(
      <div key="restricciones">
        <h2>Restricciones</h2>
        {[...Array(numRestricciones)].map((_, j) => (
          <div key={`restriccion${j + 1}`}>
            <h3>Restricción {j + 1}</h3>
            <h4>Lado Izquierdo (Variables):</h4>
            {[...Array(numVariables)].map((_, i) => (
              <input
                key={`coefRestIzq${j + 1}Var${i + 1}`}
                type="number"
                placeholder={`Coef Variable ${i + 1} (si aplica)`}
                name={`coefRestIzq${j + 1}Var${i + 1}`}
                required
              />
            ))}
            <select name={`simboloRest${j + 1}`} key={`simboloRest${j + 1}`}>
              <option value="<=">&le;</option>
              <option value=">=">&ge;</option>
              <option value="<">&lt;</option>
              <option value=">">&gt;</option>
              <option value="=">=</option>
            </select>
            <h4>Lado Derecho (Variables + Monto Fijo):</h4>
            {[...Array(numVariables)].map((_, i) => (
              <input
                key={`coefRestDer${j + 1}Var${i + 1}`}
                type="number"
                placeholder={`Coef Variable ${i + 1} (si aplica)`}
                name={`coefRestDer${j + 1}Var${i + 1}`}
                required
              />
            ))}
            <input
              key={`montoRestDer${j + 1}`}
              type="number"
              placeholder="Monto fijo"
              name={`montoRestDer${j + 1}`}
              required
            />
          </div>
        ))}
      </div>
    );

    setFormularioGenerado(formularioHTML);
  };

  const resolverOptimizacion = (coefObjetivo, restricciones) => {
    let mejorValor = -Infinity;
    let mejorSolucion = {};

    for (let x = 0; x <= 100; x++) {
      for (let y = 0; y <= 100; y++) {
        let factible = true;

        for (let restriccion of restricciones) {
          let valorIzq =
            restriccion.ladoIzquierdo[0] * x +
            restriccion.ladoIzquierdo[1] * y;
          let valorDer =
            restriccion.ladoDerecho[0] * x +
            restriccion.ladoDerecho[1] * y +
            restriccion.montoDerecho;

          switch (restriccion.simbolo) {
            case '<=':
              if (valorIzq > valorDer) factible = false;
              break;
            case '>=':
              if (valorIzq < valorDer) factible = false;
              break;
            case '=':
              if (valorIzq !== valorDer) factible = false;
              break;
            default:
              break;
          }

          if (!factible) break;
        }

        if (factible) {
          let valorObjetivo = coefObjetivo[0] * x + coefObjetivo[1] * y;
          if (valorObjetivo > mejorValor) {
            mejorValor = valorObjetivo;
            mejorSolucion = { x, y };
          }
        }
      }
    }

    return { mejorValor, mejorSolucion };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const coeficientesObjetivo = [];
    const restricciones = [];

    // Obtener coeficientes de la función objetivo
    for (let i = 1; i <= numVariables; i++) {
      coeficientesObjetivo.push(
        parseFloat(event.target[`coefVar${i}`].value)
      );
    }

    // Obtener restricciones
    for (let j = 1; j <= numRestricciones; j++) {
      let restriccion = {
        ladoIzquierdo: [],
        ladoDerecho: [],
        montoDerecho: parseFloat(
          event.target[`montoRestDer${j}`].value
        ),
        simbolo: event.target[`simboloRest${j}`].value,
      };

      // Lado izquierdo
      for (let i = 1; i <= numVariables; i++) {
        restriccion.ladoIzquierdo.push(
          parseFloat(event.target[`coefRestIzq${j}Var${i}`].value)
        );
      }

      // Lado derecho
      for (let i = 1; i <= numVariables; i++) {
        restriccion.ladoDerecho.push(
          parseFloat(event.target[`coefRestDer${j}Var${i}`].value)
        );
      }

      restricciones.push(restriccion);
    }

    const resultado = resolverOptimizacion(coeficientesObjetivo, restricciones);
    setResultado(resultado);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Modelo de Optimización</h1>

      <form onSubmit={handleSubmit}>
        <h2>Selecciona Cantidad de Variables y Restricciones</h2>

        <label>
          Cantidad de Variables:
          <input
            type="number"
            min="1"
            value={numVariables}
            onChange={(e) => setNumVariables(parseInt(e.target.value))}
            required
          />
        </label>

        <label>
          Cantidad de Restricciones:
          <input
            type="number"
            min="1"
            value={numRestricciones}
            onChange={(e) => setNumRestricciones(parseInt(e.target.value))}
            required
          />
        </label>

        <button type="button" onClick={generarFormulario}>
          Generar Formulario
        </button>

        {formularioGenerado.length > 0 && (
          <>
            {formularioGenerado}
            <button type="submit">Calcular</button>
          </>
        )}
      </form>

      {resultado && (
        <div className="result">
          <h2>Resultado</h2>
          <p>
            Mejor beneficio: {resultado.mejorValor}
            <br />
            Valores óptimos: {JSON.stringify(resultado.mejorSolucion)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Optimizacion;
