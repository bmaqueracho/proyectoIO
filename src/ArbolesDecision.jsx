import React, { useState } from 'react';
import './ArbolesDecision.css'; // Se agregará el CSS actualizado para reflejar los cambios

function ArbolesDecision() {
  const [nodos, setNodos] = useState([
    { id: '1', nombre: 'Nodo Principal', probabilidad: 'N/A', valor: 'N/A', hijos: [] }
  ]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [cantidadNodos, setCantidadNodos] = useState(1);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('max'); // Opción para elegir entre máximo o mínimo
  const [decisionRecomendada, setDecisionRecomendada] = useState(null); // Para almacenar la decisión recomendada

  const agregarNodos = () => {
    if (!nodoSeleccionado) return;
    const nuevosNodos = [...nodos];
    const nodo = buscarNodo(nodoSeleccionado, nuevosNodos);
    const numHijos = nodo.hijos.length;
    for (let i = 1; i <= cantidadNodos; i++) {
      nodo.hijos.push({
        id: `${nodoSeleccionado}.${numHijos + i}`,
        nombre: '',
        probabilidad: '',
        valor: '',
        hijos: []
      });
    }
    setNodos(nuevosNodos);
  };

  const eliminarNodo = () => {
    if (!nodoSeleccionado) return;
    const nuevosNodos = eliminarNodoPorId(nodoSeleccionado, [...nodos]);
    setNodos(nuevosNodos);
    setNodoSeleccionado(null);
  };

  const buscarNodo = (id, lista) => {
    for (const nodo of lista) {
      if (nodo.id === id) return nodo;
      const encontrado = buscarNodo(id, nodo.hijos);
      if (encontrado) return encontrado;
    }
    return null;
  };

  const eliminarNodoPorId = (id, lista) => {
    return lista.filter(nodo => {
      if (nodo.id === id) return false;
      nodo.hijos = eliminarNodoPorId(id, nodo.hijos);
      return true;
    });
  };

  // Esta función actualiza el estado de los nodos cuando cambian los inputs
  const actualizarNodo = (id, campo, valor) => {
    const nuevosNodos = [...nodos];

    const nodo = buscarNodo(id, nuevosNodos);
    if (nodo) {
      nodo[campo] = valor;
      setNodos(nuevosNodos);
    }
  };

  const calcularValorNodo = (nodo) => {
    // Si el nodo no tiene hijos, devolvemos su valor actual
    if (nodo.hijos.length === 0) {
      return parseFloat(nodo.valor) || 0;
    }
  
    // Si el nodo tiene hijos, calculamos el valor esperado
    let valorEsperado = 0;
    nodo.hijos.forEach(hijo => {
      const probabilidad = parseFloat(hijo.probabilidad) || 0;
      const valorHijo = calcularValorNodo(hijo);
      valorEsperado += probabilidad * valorHijo;
    });
  
    // Aquí sumamos el valor calculado de los hijos al valor actual del nodo padre
    const valorPadre = parseFloat(nodo.valor) || 0;
    nodo.valor = (valorPadre + valorEsperado).toFixed(2);
    
    return valorPadre + valorEsperado;
  };
  

  // Función para calcular la decisión recomendada basada en el método seleccionado
  const calcularDecisionRecomendada = (nodoPrincipal) => {
    if (nodoPrincipal.hijos.length === 0) return;

    let mejorValor;
    let mejorActividad;

    if (metodoSeleccionado === 'max') {
      // Encontrar el hijo con el valor máximo
      mejorValor = Math.max(...nodoPrincipal.hijos.map(hijo => parseFloat(hijo.valor) || 0));
      mejorActividad = nodoPrincipal.hijos.find(hijo => parseFloat(hijo.valor) === mejorValor);
    } else {
      // Encontrar el hijo con el valor mínimo
      mejorValor = Math.min(...nodoPrincipal.hijos.map(hijo => parseFloat(hijo.valor) || 0));
      mejorActividad = nodoPrincipal.hijos.find(hijo => parseFloat(hijo.valor) === mejorValor);
    }

    setDecisionRecomendada({
      nombre: mejorActividad.nombre,
      valor: mejorValor
    });
  };

  const calcularValores = () => {
    const nuevosNodos = [...nodos];
    nuevosNodos.forEach(nodo => calcularValorNodo(nodo));
    setNodos(nuevosNodos);

    // Calcular el resultado final desde el nodo principal
    

    // Calcular la decisión recomendada
    calcularDecisionRecomendada(nuevosNodos[0]);
  };

  const renderNodos = (nodos, nivel = 0) => {
    return nodos.map((nodo) => (
      <React.Fragment key={nodo.id}>
        <tr
          onClick={() => setNodoSeleccionado(nodo.id)}
          className={`${nodoSeleccionado === nodo.id ? 'seleccionado' : ''} nivel-${nivel}`} // Aplicar clase basada en el nivel
          style={{ paddingLeft: `${nivel * 20}px` }} // Mantener la indentación
        >
          <td>{nodo.id}</td>
          <td><input type="text" value={nodo.nombre} placeholder="Nombre" onChange={(e) => actualizarNodo(nodo.id, 'nombre', e.target.value)} /></td>
          <td><input type="text" value={nodo.probabilidad} placeholder="Probabilidad" onChange={(e) => actualizarNodo(nodo.id, 'probabilidad', e.target.value)} /></td>
          <td><input type="text" value={nodo.valor} placeholder="Valor" onChange={(e) => actualizarNodo(nodo.id, 'valor', e.target.value)} /></td>
        </tr>
        {renderNodos(nodo.hijos, nivel + 1)} {/* Incrementar el nivel para los hijos */}
      </React.Fragment>
    ));
  };
  

  return (
    <div className="arbol-decision-contenedor">
      <h1>Árbol de Decisiones</h1>
      <table className="arbol-decision-tabla">
        <thead>
          <tr>
            <th>Número de Actividad</th>
            <th>Nombre</th>
            <th>Probabilidad</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {renderNodos(nodos)}
        </tbody>
      </table>

      <div className="acciones">
        <p>Acciones para el nodo seleccionado: {nodoSeleccionado}</p>
        <label>Cantidad de nodos a agregar:
          <input type="number" value={cantidadNodos} onChange={(e) => setCantidadNodos(Number(e.target.value))} />
        </label>
        <div className="botones">
          <button onClick={agregarNodos} className="btn agregar">Agregar Nodos</button>
          <button onClick={eliminarNodo} className="btn eliminar">Eliminar Nodo Seleccionado</button>
          <button onClick={calcularValores} className="btn calcular">Calcular Valores</button>
        </div>
      </div>

      <div className="metodo-seleccionado">
        <label>Método de decisión:
          <select value={metodoSeleccionado} onChange={(e) => setMetodoSeleccionado(e.target.value)}>
            <option value="max">Máximo</option>
            <option value="min">Mínimo</option>
          </select>
        </label>
      </div>

      

      {decisionRecomendada !== null && (
        <div className="decision-recomendada">
          <h2>La decisión recomendada por el método del valor esperado es "{decisionRecomendada.nombre}" y su valor es {decisionRecomendada.valor}</h2>
        </div>
      )}
    </div>
  );
}

export default ArbolesDecision;
