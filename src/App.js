import React, { useState } from 'react';
import CpmCalculator from './CPMcalculator';
import PertCalculator from './PERTCalculator';
import Optimizacion from './optimizacion';
import EOQCalculator from './EOQcalculator';
import EPQCalculator from './EPQCalculator';
import MIFPCalculator from './MIFPCalculator';
import QuantityDiscountCalculator from './QuantityDiscountCalculator';
import ArbolesDecision from './ArbolesDecision';
import Incertidumbre from './Incertidumbre';

// Importar componentes de Unidad II
import ColasPoissonExponencial from './ColasPoissonExponencial';
import VariosServidorPoissonExponencial from './VariosServidoresPoissonExponencial';
import NacimientoMuerte from './NacimientoMuerte';
import ColasPoissonArbitrario from './ColasPoissonArbitrario';
import MultiplesServidoresSinEspera from './MultiplesServidoresSinEspera';
import FuentesFinitas from './FuentesFinitas';
import QPCalculator from './QPCalculator';
import ProgramacionSeparable from './ProgramacionSeparable';
import ProgramacionNoConvexa from './ProgramacionNoConvexa';
import ProgramacionConvexa from './ProgramacionConvexa';
import ProgramacionFraccionaria from './ProgramacionFraccionaria';
import ProgramacionGeometrica from './ProgramacionGeometrica';
import HolguraPorRechazos from './HolguraPorRechazos';
import DistribucionCientificos from './DistribucionCientificos';
import JuegoApuestas from './JuegoApuestas';
import AsignacionBrigadas from './AsignacionBrigadas';
//import OptimizacionSinRestricciones from './OptimizacionSinRestricciones';

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Manejar selección de unidad
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setSelectedMethod(null); // Resetear el método cuando se cambia la unidad
  };

  // Manejar selección de método
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  // Función para regresar al menú anterior
  const goBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null); // Volver al menú de métodos
    } else if (selectedUnit) {
      setSelectedUnit(null); // Volver al menú principal
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      {/* Menú principal */}
      {!selectedUnit && (
        <div>
          <h1>Seleccione una Unidad</h1>
          <button onClick={() => handleSelectUnit('UNIDAD I')}>UNIDAD I</button>
          <button onClick={() => handleSelectUnit('UNIDAD II')}>UNIDAD II</button>
        </div>
      )}

      {/* Menú de Unidad I */}
      {selectedUnit === 'UNIDAD I' && !selectedMethod && (
        <div>
          <h2>Modelos en UNIDAD I</h2>
          <button onClick={() => handleSelectMethod('CPM')}>Método CPM</button>
          <button onClick={() => handleSelectMethod('PERT')}>Método PERT</button>
          <button onClick={() => handleSelectMethod('OPTIMIZACION')}>Optimización</button>
          <button onClick={() => handleSelectMethod('INVENTARIO')}>Modelos de Inventario</button>
          <button onClick={() => handleSelectMethod('TD')}>Teoría de Decisiones</button>
          <button onClick={goBack}>Volver al menú principal</button>
        </div>
      )}

      {/* Métodos de UNIDAD I */}
      {selectedMethod === 'CPM' && (
        <div>
          <CpmCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PERT' && (
        <div>
          <PertCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'OPTIMIZACION' && (
        <div>
          <Optimizacion />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'INVENTARIO' && (
        <div>
          <h2>Modelos de Inventario</h2>
          <button onClick={() => handleSelectMethod('EOQ')}>EOQ</button>
          <button onClick={() => handleSelectMethod('EPQ')}>EPQ</button>
          <button onClick={() => handleSelectMethod('MIFP')}>MIFP</button>
          <button onClick={() => handleSelectMethod('DCM')}>Descuentos por Cantidad</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'EOQ' && (
        <div>
          <EOQCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'EPQ' && (
        <div>
          <EPQCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'MIFP' && (
        <div>
          <MIFPCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'DCM' && (
        <div>
          <QuantityDiscountCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'TD' && (
        <div>
          <h2>Teoría de Decisiones</h2>
          <button onClick={() => handleSelectMethod('AD')}>Árboles de Decisión</button>
          <button onClick={() => handleSelectMethod('TUI')}>Incertidumbre</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'AD' && (
        <div>
          <ArbolesDecision />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'TUI' && (
        <div>
          <Incertidumbre />
          <button onClick={goBack}>Volver</button>
        </div>
      )}

      {/* Menú de Unidad II */}
      {selectedUnit === 'UNIDAD II' && !selectedMethod && (
        <div>
          <h2>Modelos en UNIDAD II</h2>
          <button onClick={() => handleSelectMethod('TeoriaColas')}>Teoría de Colas</button>
          <button onClick={() => handleSelectMethod('ProgNoLineal')}>Programación No Lineal</button>
          <button onClick={() => handleSelectMethod('ProgDinamica')}>Programación Dinámica</button>
          <button onClick={goBack}>Volver al menú principal</button>
        </div>
      )}

      {/* Métodos de UNIDAD II */}
      {selectedMethod === 'TeoriaColas' && (
        <div>
          <h2>Teoría de Colas</h2>
          <button onClick={() => handleSelectMethod('Cola1Servidor')}>Un servidor / Poisson / Exponenciales</button>
          <button onClick={() => handleSelectMethod('ColaVariosServidores')}>Varios servidores / Poisson / Exponenciales</button>
          <button onClick={() => handleSelectMethod('NacimientoMuerte')}>Nacimiento y Muerte</button>
          <button onClick={() => handleSelectMethod('ColaArbitraria')}>Colas Poisson Arbitrarias</button>
          <button onClick={() => handleSelectMethod('MultiplesServidores')}>Múltiples Servidores sin Espera</button>
          <button onClick={() => handleSelectMethod('FuentesFinitas')}>Fuentes Finitas</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'Cola1Servidor' && (
        <div>
          <ColasPoissonExponencial />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'ColaVariosServidores' && (
        <div>
          <VariosServidorPoissonExponencial />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'NacimientoMuerte' && (
        <div>
          <NacimientoMuerte />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'ColaArbitraria' && (
        <div>
          <ColasPoissonArbitrario />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'MultiplesServidores' && (
        <div>
          <MultiplesServidoresSinEspera />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'FuentesFinitas' && (
        <div>
          <FuentesFinitas />
          <button onClick={goBack}>Volver</button>
        </div>
      )}

      {/* Programación No Lineal */}
      {selectedMethod === 'ProgNoLineal' && (
        <div>
          <h2>Programación No Lineal</h2>
          <button onClick={() => handleSelectMethod('QPC')}>Programación Cuadrática</button>
          <button onClick={() => handleSelectMethod('PC')}>Programación Convexa</button>
          <button onClick={() => handleSelectMethod('PF')}>Programación Fraccionaria</button>
          <button onClick={() => handleSelectMethod('PG')}>Programación Geométrica</button>
          <button onClick={() => handleSelectMethod('PS')}>Programación Separable</button>
          <button onClick={() => handleSelectMethod('PNC')}>Programación No Convexa</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'QPC' && (
        <div>
          <QPCalculator />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PC' && (
        <div>
          <ProgramacionConvexa />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PF' && (
        <div>
          <ProgramacionFraccionaria />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PG' && (
        <div>
          <ProgramacionGeometrica />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PS' && (
        <div>
          <ProgramacionSeparable />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'PNC' && (
        <div>
          <ProgramacionNoConvexa />
          <button onClick={goBack}>Volver</button>
        </div>
      )}

      {/* Programación Dinámica */}
      {selectedMethod === 'ProgDinamica' && (
        <div>
          <h2>Programación Dinámica</h2>
          <button onClick={() => handleSelectMethod('HolguraPorRechazos')}>Holgura por Rechazos</button>
          <button onClick={() => handleSelectMethod('DistribucionCientificos')}>Distribucion de Cientificos</button>
          <button onClick={() => handleSelectMethod('JuegoApuestas')}>Juego de apuestas</button>
          <button onClick={() => handleSelectMethod('AsignacionBrigadas')}>Asignacion de Brigadas</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'HolguraPorRechazos' && (
        <div>
          <HolguraPorRechazos />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'DistribucionCientificos' && (
        <div>
          <DistribucionCientificos />
          <button onClick={goBack}>Volver</button>
        </div>
      )}
      {selectedMethod === 'JuegoApuestas' && (
          <div>
            <JuegoApuestas />
            <button onClick={goBack}>Volver</button>
          </div>
      )}
      {selectedMethod === 'AsignacionBrigadas' && (
          <div>
            <AsignacionBrigadas />
            <button onClick={goBack}>Volver</button>
          </div>
      )}
    </div>
  );
}

export default App;
