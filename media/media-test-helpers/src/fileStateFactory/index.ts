export { FileStateFactory, MediaClientMock } from './factory';
export { createIdentifier, createFileDetails } from './factory';
export { createFileState } from './factory/createFileState';
export type { FileStateFactoryOptions, MediaClientMockOptions } from './factory/factory';

export type { Simulation, SimulationUtils, SimulationSettings } from './fileSimulation';
export { useRunSimulation } from './fileSimulation';
export {
	simulateProcessed,
	simulateProcessing,
	simulateImmediateFailProcessing,
	simulateUpload,
	simulateError,
	simulateErrorState,
	simulateManyProcessed,
	simulateEmptyDetails,
	simulateUpdateFileId,
	simulateAlwaysLoading,
	simulateAlwaysProcessing,
} from './fileSimulation';
export type { SimulationFactory, StandardSimulation } from './fileSimulation';
