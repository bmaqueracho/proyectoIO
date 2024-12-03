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

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null); 
  const [selectedMethod, setSelectedMethod] = useState(null); 
  const [subMethod, setSubMethod] = useState(null); 

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setSelectedMethod(null);
    setSubMethod(null);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setSubMethod(null);
  };

  const handleSelectSubMethod = (submethod) => {
    setSubMethod(submethod);
  };

  const goBack = () => {
    if (subMethod) {
      setSubMethod(null);
    } else if (selectedMethod) {
      setSelectedMethod(null);
    } else if (selectedUnit) {
      setSelectedUnit(null);
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
      {selectedMethod === 'CPM' && <CpmCalculator />}
      {selectedMethod === 'PERT' && <PertCalculator />}
      {selectedMethod === 'OPTIMIZACION' && <Optimizacion />}
      
      {selectedMethod === 'INVENTARIO' && !subMethod && (
        <div>
          <h2>Modelos de Inventario</h2>
          <button onClick={() => handleSelectSubMethod('EOQ')}>EOQ</button>
          <button onClick={() => handleSelectSubMethod('EPQ')}>EPQ</button>
          <button onClick={() => handleSelectSubMethod('MIFP')}>MIFP</button>
          <button onClick={() => handleSelectSubMethod('DCM')}>Descuentos por Cantidad</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}

      {subMethod === 'EOQ' && <EOQCalculator />}
      {subMethod === 'EPQ' && <EPQCalculator />}
      {subMethod === 'MIFP' && <MIFPCalculator />}
      {subMethod === 'DCM' && <QuantityDiscountCalculator />}

      {selectedMethod === 'TD' && !subMethod && (
        <div>
          <h2>Teoría de Decisiones</h2>
          <button onClick={() => handleSelectSubMethod('AD')}>Árboles de Decisión</button>
          <button onClick={() => handleSelectSubMethod('TUI')}>Incertidumbre</button>
          <button onClick={goBack}>Volver</button>
        </div>
      )}

      {subMethod === 'AD' && <ArbolesDecision />}
      {subMethod === 'TUI' && <Incertidumbre />}

     {/* Menú de Unidad II */}
      {selectedUnit === 'UNIDAD II' && !selectedMethod && (
        <div>
          <h2>Modelos en UNIDAD II</h2>
          <button onClick={() => handleSelectMethod('1Servidor_Poisson_Exponencial')}>
            Un servidor / Poisson / Exponenciales
          </button>
          <button onClick={() => handleSelectMethod('VariosServidor_Poisson_Exponencial')}>
            Varios servidores / Poisson / Exponenciales
          </button>
          <button onClick={() => handleSelectMethod('NacimientoMuerte')}>
            Nacimiento y Muerte
          </button>
          <button onClick={goBack}>Volver al menú principal</button>
          <button onClick={() => handleSelectMethod('1Servidor_Poisson_Arbitrario')}>
            Un servidor / Poisson / Arbitrarios
          </button>
          <button onClick={() => handleSelectMethod('MultiplesServidoresSinEspera')}>
            Varios servidores / Poisson / Arbitrarios (sin espera)
          </button>
          <button onClick={() => handleSelectMethod('FuentesFinitas')}>
            Fuentes Finitas
          </button>
          <button onClick={() => handleSelectMethod('QP')}>
            Programación Cuadrática
          </button>
          <button onClick={() => handleSelectMethod('ProgramacionSeparable')}>
            Programación Separable
          </button>
          <button onClick={() => handleSelectMethod('ProgramacionNoConvexa')}>
            Programación No Convexa
          </button>

          <button onClick={() => handleSelectMethod('ProgramacionGeometrica')}>
            Programación Geometrica
          </button>
          <button onClick={() => handleSelectMethod('ProgramacionFraccionaria')}>
            Programación Fraccionaria
          </button>
          <button onClick={() => handleSelectMethod('ProgramacionConvexa')}>
            Programación Convexa
          </button>
        </div>
      )}

      {/* Métodos de UNIDAD II */}
      {selectedMethod === '1Servidor_Poisson_Exponencial' && <ColasPoissonExponencial />}
      {selectedMethod === 'VariosServidor_Poisson_Exponencial' && <VariosServidorPoissonExponencial />}
      {selectedMethod === 'NacimientoMuerte' && <NacimientoMuerte />}
      {selectedMethod === '1Servidor_Poisson_Arbitrario' && <ColasPoissonArbitrario />}
      {selectedMethod === 'MultiplesServidoresSinEspera' && <MultiplesServidoresSinEspera />}
      {selectedMethod === 'FuentesFinitas' && <FuentesFinitas />}
      {selectedMethod === 'QP' && <QPCalculator />}
      {selectedMethod === 'ProgramacionSeparable' && <ProgramacionSeparable />}
      {selectedMethod === 'ProgramacionNoConvexa' && <ProgramacionNoConvexa />}

      {selectedMethod === 'ProgramacionGeometrica' && <ProgramacionGeometrica />}
      {selectedMethod === 'ProgramacionFraccionaria' && <ProgramacionFraccionaria />}
      {selectedMethod === 'ProgramacionConvexa' && <ProgramacionConvexa />}
      {/* Botón universal de "Volver" */}
      {(selectedUnit || selectedMethod || subMethod) && (
        <div>
          <button onClick={goBack}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default App;
