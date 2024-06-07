import { createContext } from 'react';
import { type ExperimentContext } from './types';

const initialContext: ExperimentContext = {
	experiments: {},
};
const Experiment = createContext(initialContext);

export const ExperimentProvider = Experiment.Provider;
export const ExperimentConsumer = Experiment.Consumer;
