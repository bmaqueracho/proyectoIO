import React, { useState } from 'react';
import { Chart } from 'chart.js/auto';

const AsignacionBrigadas = () => {
  const rendimientosIniciales = [
    [0, 0, 0],    // 0 brigadas
    [45, 20, 50], // 1 brigada
    [70, 45, 70], // 2 brigadas
    [90, 75, 80], // 3 brigadas
    [105, 110, 100], // 4 brigadas
    [120, 150, 130], // 5 brigadas
  ];

  const [rendimientos, setRendimientos] = useState(rendimientosIniciales);
  const [mejorAsignacion, setMejorAsignacion] = useState([]);
  const [mejorRendimiento, setMejorRendimiento] = useState(0);

  // Función para calcular el rendimiento total
  const calcularRendimiento = (asignaciones) => {
    return asignaciones.reduce(
      (rendimientoTotal, brigadas, pais) => rendimientoTotal + rendimientos[brigadas][pais],
      0
    );
  };

  // Lógica para encontrar la mejor asignación
  const encontrarMejorAsignacion = () => {
    let mejorRendimiento = 0;
    let mejorAsignacion = [];

    for (let x1 = 0; x1 <= 5; x1++) {
      for (let x2 = 0; x2 <= 5 - x1; x2++) {
        let x3 = 5 - x1 - x2;
        const asignacion = [x1, x2, x3];
        const rendimiento = calcularRendimiento(asignacion);
        if (rendimiento > mejorRendimiento) {
          mejorRendimiento = rendimiento;
          mejorAsignacion = asignacion;
        }
      }
    }
    setMejorAsignacion(mejorAsignacion);
    setMejorRendimiento(mejorRendimiento);
    generarGrafico(mejorAsignacion);
  };

  // Función para generar el gráfico usando Chart.js
  const generarGrafico = (asignacion) => {
    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['País 1', 'País 2', 'País 3'],
        datasets: [
          {
            label: 'Rendimiento por País (Años de Vida Adicionales)',
            data: [
              rendimientos[asignacion[0]][0],
              rendimientos[asignacion[1]][1],
              rendimientos[asignacion[2]][2],
            ],
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
            borderColor: ['#FF5733', '#33FF57', '#3357FF'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Asignación Óptima de Brigadas</h1>
      <button onClick={encontrarMejorAsignacion}>Calcular Mejor Asignación</button>

      {mejorAsignacion.length > 0 && (
        <div className="resultado" style={{ marginTop: '20px' }}>
          <p><strong>Asignación Óptima:</strong></p>
          <p>País 1: {mejorAsignacion[0]} brigadas</p>
          <p>País 2: {mejorAsignacion[1]} brigadas</p>
          <p>País 3: {mejorAsignacion[2]} brigadas</p>
          <p><strong>Rendimiento Total:</strong> {mejorRendimiento} años de vida adicionales</p>
        </div>
      )}

      <table style={{ margin: '20px auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Número de Brigadas</th>
            <th>País 1</th>
            <th>País 2</th>
            <th>País 3</th>
          </tr>
        </thead>
        <tbody>
          {rendimientos.map((rend, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>{rend[0]}</td>
              <td>{rend[1]}</td>
              <td>{rend[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <canvas id="grafico" width="400" height="200"></canvas>
    </div>
  );
};

export default AsignacionBrigadas;