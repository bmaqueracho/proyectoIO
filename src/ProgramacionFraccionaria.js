import React, { useState } from 'react';

const ProgramacionFraccionaria = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [coeficientesNumerador, setCoeficientesNumerador] = useState([]);
  const [coeficientesDenominador, setCoeficientesDenominador] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  const inicializarFormulario = () => {
    const nuevosNumerador = Array(numVariables).fill(0);
    const nuevosDenominador = Array(numVariables).fill(0);
    setCoeficientesNumerador(nuevosNumerador);
    setCoeficientesDenominador(nuevosDenominador);

    const nuevasRestricciones = Array.from({ length: 2 }, () => ({
      coeficientes: Array(numVariables).fill(0),
      limite: 0,
      tipo: '≤', // Tipo por defecto: menor o igual
    }));
    setRestricciones(nuevasRestricciones);
  };

  const actualizarCoeficiente = (tipo, index, valor) => {
    const coeficientes = tipo === 'numerador' ? [...coeficientesNumerador] : [...coeficientesDenominador];
    coeficientes[index] = parseFloat(valor) || 0;
    tipo === 'numerador' ? setCoeficientesNumerador(coeficientes) : setCoeficientesDenominador(coeficientes);
  };

  const actualizarRestriccion = (index, campo, valor) => {
    const nuevasRestricciones = [...restricciones];
    if (campo === 'coeficientes') {
      nuevasRestricciones[index].coeficientes = valor.map((v) => parseFloat(v) || 0);
    } else if (campo === 'tipo') {
      nuevasRestricciones[index][campo] = valor;
    } else {
      nuevasRestricciones[index][campo] = parseFloat(valor) || 0;
    }
    setRestricciones(nuevasRestricciones);
  };

  const resolver = () => {
    try {
      let mejorSolucion = { valores: [], resultado: Infinity };

      for (let x1 = 0.1; x1 <= 10; x1 += 0.1) {
        for (let x2 = 0.1; x2 <= 10; x2 += 0.1) {
          const variables = [x1, x2];
          const valorNumerador = coeficientesNumerador.reduce((sum, coef, i) => sum + coef * variables[i], 0);
          const valorDenominador = coeficientesDenominador.reduce((sum, coef, i) => sum + coef * variables[i], 0);

          if (valorDenominador === 0) continue;

          const valorObjetivo = valorNumerador / valorDenominador;

          const cumpleRestricciones = restricciones.every(({ coeficientes, limite, tipo }) => {
            const valor = coeficientes.reduce((sum, coef, i) => sum + coef * variables[i], 0);
            if (tipo === '≤') return valor <= limite;
            if (tipo === '≥') return valor >= limite;
            return valor === limite;
          });

          if (cumpleRestricciones && valorObjetivo < mejorSolucion.resultado) {
            mejorSolucion = { valores: [x1, x2], resultado: valorObjetivo };
          }
        }
      }

      setResultado(mejorSolucion);
    } catch (error) {
      console.error("Error al resolver:", error);
      alert("Revisa los datos ingresados.");
    }
  };

  return (
    <div>
      <h1>Programación Fraccionaria</h1>

      <label>Número de variables:</label>
      <input
        type="number"
        min="2"
        value={numVariables}
        onChange={(e) => setNumVariables(parseInt(e.target.value, 10) || 2)}
      />
      <button onClick={inicializarFormulario}>Inicializar Formulario</button>

      {coeficientesNumerador.length > 0 && (
        <div>
          <h2>Función Objetivo</h2>
          <h3>Numerador:</h3>
          {coeficientesNumerador.map((_, index) => (
            <input
              key={`num-${index}`}
              type="number"
              placeholder={`Coef x${index + 1}`}
              onChange={(e) => actualizarCoeficiente('numerador', index, e.target.value)}
            />
          ))}

          <h3>Denominador:</h3>
          {coeficientesDenominador.map((_, index) => (
            <input
              key={`den-${index}`}
              type="number"
              placeholder={`Coef x${index + 1}`}
              onChange={(e) => actualizarCoeficiente('denominador', index, e.target.value)}
            />
          ))}
        </div>
      )}

      {restricciones.length > 0 && (
        <div>
          <h2>Restricciones</h2>
          {restricciones.map((restriccion, index) => (
            <div key={`res-${index}`}>
              <label>Restricción {index + 1}:</label>
              {restriccion.coeficientes.map((_, i) => (
                <input
                  key={`coef-${index}-${i}`}
                  type="number"
                  placeholder={`Coef x${i + 1}`}
                  onChange={(e) => {
                    const nuevosCoef = [...restriccion.coeficientes];
                    nuevosCoef[i] = e.target.value;
                    actualizarRestriccion(index, 'coeficientes', nuevosCoef);
                  }}
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
          <p>Solución óptima: x1 = {resultado.valores[0].toFixed(2)}, x2 = {resultado.valores[1].toFixed(2)}</p>
          <p>Valor óptimo: {resultado.resultado.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramacionFraccionaria;
