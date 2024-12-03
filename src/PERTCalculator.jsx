import React, { useState } from 'react';

function PertCalculator() {
  const [numActivities, setNumActivities] = useState(0);
  const [activities, setActivities] = useState([]);
  const [results, setResults] = useState(null);

  const handleNumActivitiesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 0) {
      setNumActivities(0);
      setActivities([]);
      return;
    }
    setNumActivities(value);
    setActivities(Array.from({ length: value }, () => ({ optimistic: '', mostLikely: '', pessimistic: '', predecessors: '' })));
  };

  const handleInputChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setActivities(updatedActivities);
  };

  const calculatePERT = () => {
    const optimisticTimes = activities.map(activity => parseFloat(activity.optimistic) || 0);
    const mostLikelyTimes = activities.map(activity => parseFloat(activity.mostLikely) || 0);
    const pessimisticTimes = activities.map(activity => parseFloat(activity.pessimistic) || 0);
    const predecessors = activities.map(activity => activity.predecessors ? activity.predecessors.split(',').map(p => p.trim()) : []);

    const pertResults = computePERT(optimisticTimes, mostLikelyTimes, pessimisticTimes, predecessors);
    setResults(pertResults);
  };

  const computePERT = (optimistic, mostLikely, pessimistic, predecessors) => {
    const expectedTimes = optimistic.map((o, i) => (o + 4 * mostLikely[i] + pessimistic[i]) / 6);
    const variances = optimistic.map((o, i) => ((pessimistic[i] - o) / 6) ** 2);

    const { totalDuration, criticalPath } = calculateCriticalPath(expectedTimes, predecessors);
    const totalVariance = variances.reduce((a, b) => a + b, 0);
    const projectStandardDeviation = Math.sqrt(totalVariance);

    return {
      totalDuration,
      totalVariance,
      projectStandardDeviation,
      criticalPath,
    };
  };

  const calculateCriticalPath = (expectedTimes, predecessors) => {
    const n = expectedTimes.length;
    const earliestStart = Array(n).fill(0);
    const latestFinish = Array(n).fill(Infinity);

    // Paso 1: Calcular el tiempo de inicio más temprano (forward pass)
    for (let i = 0; i < n; i++) {
      if (predecessors[i].length > 0) {
        const predIndices = predecessors[i].map(p => parseInt(p.replace('A', '')) - 1);
        const maxPredFinish = Math.max(...predIndices.map(p => earliestStart[p] + expectedTimes[p]));
        earliestStart[i] = maxPredFinish;
      }
    }

    const totalDuration = Math.max(...earliestStart.map((start, i) => start + expectedTimes[i]));

    // Paso 2: Calcular el tiempo de finalización más tarde (backward pass)
    latestFinish.fill(totalDuration); // Todas las actividades finales deben terminar en la duración total

    for (let i = n - 1; i >= 0; i--) {
      if (predecessors[i].length > 0) {
        const predIndices = predecessors[i].map(p => parseInt(p.replace('A', '')) - 1);
        predIndices.forEach(predIndex => {
          latestFinish[predIndex] = Math.min(latestFinish[predIndex], earliestStart[i]);
        });
      }
    }

    // Paso 3: Determinar las actividades críticas (las que tienen holgura cero)
    const criticalPath = [];
    for (let i = 0; i < n; i++) {
      const finishTime = earliestStart[i] + expectedTimes[i];
      if (finishTime === latestFinish[i]) {
        criticalPath.push(`A${i + 1}`);
      }
    }

    return { totalDuration, criticalPath };
  };

  return (
    <div>
      <h1>PERT - Programación de Proyectos</h1>
      <label htmlFor="numActivities">Número de Actividades:</label>
      <input
        type="number"
        id="numActivities"
        min="1"
        value={numActivities}
        onChange={handleNumActivitiesChange}
      />
      <br /><br />

      {activities.map((activity, index) => (
        <div key={index}>
          <h3>Actividad {index + 1}</h3>
          <label>Tiempo Optimista:</label>
          <input
            type="number"
            value={activity.optimistic}
            onChange={(e) => handleInputChange(index, 'optimistic', e.target.value)}
          />
          <label>Tiempo Más Probable:</label>
          <input
            type="number"
            value={activity.mostLikely}
            onChange={(e) => handleInputChange(index, 'mostLikely', e.target.value)}
          />
          <label>Tiempo Pesimista:</label>
          <input
            type="number"
            value={activity.pessimistic}
            onChange={(e) => handleInputChange(index, 'pessimistic', e.target.value)}
          />
          <label>Predecesores:</label>
          <input
            type="text"
            value={activity.predecessors}
            onChange={(e) => handleInputChange(index, 'predecessors', e.target.value)}
            placeholder="Ej: A1,A2"
          />
        </div>
      ))}

      <button onClick={calculatePERT}>Calcular Duración del Proyecto</button>

      {results && (
        <div id="results">
          <h3>Resultados</h3>
          <p>Duración Total del Proyecto: {results.totalDuration}</p>
          <p>Varianza Total del Proyecto: {results.totalVariance}</p>
          <p>Desviación Estándar del Proyecto: {results.projectStandardDeviation}</p>
          <p>Ruta Crítica: {results.criticalPath.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default PertCalculator;
