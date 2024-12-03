import React, { useState } from 'react';
import './App.css'; // Si deseas agregar estilos

const CPMCalculator = () => {
  const [numActivities, setNumActivities] = useState(0);
  const [activities, setActivities] = useState([]);
  const [results, setResults] = useState(null);

  const createTable = (e) => {
    const num = e.target.value;
    setNumActivities(num);

    const newActivities = Array.from({ length: num }, (_, i) => ({
      id: `A${i + 1}`,
      duration: '',
      predecessors: '',
    }));
    setActivities(newActivities);
  };

  const handleInputChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };

  const calculateCPM = () => {
    const durations = activities.map((activity) => parseInt(activity.duration) || 0);
    const predecessors = activities.map((activity) =>
      activity.predecessors.split(',').map((p) => p.trim())
    );

    const computedResults = computeCPM(durations, predecessors);
    setResults(computedResults);
  };

  const computeCPM = (durations, predecessors) => {
    const numActivities = durations.length;
    const earlyStart = Array(numActivities).fill(0);
    const earlyFinish = Array(numActivities).fill(0);
    const lateStart = Array(numActivities).fill(Infinity);
    const lateFinish = Array(numActivities).fill(Infinity);
    const slack = Array(numActivities).fill(0);
    const adjList = Array.from({ length: numActivities }, () => []);
    const inDegree = Array(numActivities).fill(0);

    for (let i = 0; i < numActivities; i++) {
      for (const pred of predecessors[i]) {
        if (pred) {
          const predIndex = parseInt(pred.slice(1)) - 1;
          adjList[predIndex].push(i);
          inDegree[i]++;
        }
      }
    }

    const queue = [];
    for (let i = 0; i < numActivities; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
        earlyFinish[i] = durations[i];
      }
    }

    while (queue.length > 0) {
      const current = queue.shift();
      for (const neighbor of adjList[current]) {
        earlyStart[neighbor] = Math.max(earlyStart[neighbor], earlyFinish[current]);
        earlyFinish[neighbor] = earlyStart[neighbor] + durations[neighbor];

        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    for (let i = 0; i < numActivities; i++) {
      lateFinish[i] = earlyFinish[numActivities - 1];
    }

    for (let i = numActivities - 1; i >= 0; i--) {
      for (const neighbor of adjList[i]) {
        lateFinish[i] = Math.min(lateFinish[i], lateStart[neighbor]);
      }
      lateStart[i] = lateFinish[i] - durations[i];
    }

    const criticalActivities = [];
    for (let i = 0; i < numActivities; i++) {
      slack[i] = lateStart[i] - earlyStart[i];
      if (slack[i] === 0) {
        criticalActivities.push(`A${i + 1}`);
      }
    }

    const totalDuration = earlyFinish[numActivities - 1];

    return { totalDuration, earlyStart, earlyFinish, lateStart, lateFinish, slack, criticalActivities };
  };

  const displayResults = () => {
    if (!results) return null;

    return (
      <div>
        <h3>Resultados</h3>
        <p>Duración Total del Proyecto: {results.totalDuration}</p>
        <table>
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Early Start</th>
              <th>Early Finish</th>
              <th>Late Start</th>
              <th>Late Finish</th>
              <th>Slack</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td>{activity.id}</td>
                <td>{results.earlyStart[index]}</td>
                <td>{results.earlyFinish[index]}</td>
                <td>{results.lateStart[index]}</td>
                <td>{results.lateFinish[index]}</td>
                <td>{results.slack[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Actividades Críticas: {results.criticalActivities.join(', ') || 'Ninguna'}</p>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>CPM - Programación de Proyectos</h1>
      <label htmlFor="numActivities">Número de Actividades:</label>
      <input type="number" id="numActivities" min="1" onChange={createTable} /><br /><br />

      {numActivities > 0 && (
        <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Duración</th>
              <th>Predecesores</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.id}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={activity.duration}
                    onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Ej: A1,A2"
                    value={activity.predecessors}
                    onChange={(e) => handleInputChange(index, 'predecessors', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={calculateCPM}>Calcular Duración del Proyecto</button>

      {results && (
        <div id="results" style={{ marginTop: '20px' }}>
          {displayResults()}
        </div>
      )}
    </div>
  );
};

export default CPMCalculator;
