import { type FileStateFactory } from '../factory';
import { sleep } from '../../nextTick';
import { type Simulation } from './fileSimulation';

const speed = 1500;

export type StandardSimulation = {
	simulation: Simulation;
	description: string;
};

export interface SimulationFactory<T extends any[] = []> {
	(...args: T): StandardSimulation;
}

/**
 * Normal File Flow
 */

export const simulateProcessed: SimulationFactory<[withRemotePreview?: boolean]> = (
	withRemotePreview = false,
) => ({
	simulation: async (factory) => {
		await sleep(speed);
		factory.next('processed', { withRemotePreview });
	},
	description: `File state is processed ${withRemotePreview ? 'with' : 'without'} remote preview`,
});

export const simulateProcessing: SimulationFactory<
	[suceeded?: boolean, withRemotePreview?: boolean]
> = (suceeded = true, withRemotePreview = true) => ({
	description: `File is processing, then ${suceeded ? 'succeeds' : 'fails'} ${
		withRemotePreview ? 'with' : 'without'
	} remote preview`,

	simulation: async (factory) => {
		await sleep(speed);
		factory.next('processing');
		await sleep(speed);
		factory.next('processing');
		await sleep(speed * 0.5);
		if (!suceeded) {
			factory.next('failed-processing', { withRemotePreview });
		} else {
			factory.next('processed', { withRemotePreview });
		}
	},
});

export const simulateImmediateFailProcessing: SimulationFactory = () => ({
	description: 'The first sate is failed-processing with no preview',
	simulation: async (factory) => {
		await sleep(speed);
		factory.next('failed-processing');
	},
});

export const simulateUpload: SimulationFactory<[withLocalPreview?: boolean, suceeded?: boolean]> = (
	withLocalPreview?: boolean,
	suceeded: boolean = true,
) => ({
	description: '',
	simulation: async (factory) => {
		const chunks = 3;
		const chunkUploadDelay = 500;
		const processingTime = speed;
		await sleep(speed);
		factory.next('uploading', { withLocalPreview });

		const uploadUpTo = !suceeded ? chunks / 2 : chunks;
		for (let index = 0; index <= uploadUpTo; index++) {
			factory.next('uploading', {
				uploadProgress: index / chunks,
				withLocalPreview,
			});
			await sleep(chunkUploadDelay);
		}
		if (!suceeded) {
			factory.error(new Error('some-error'));
		}
		factory.next('processing', { withLocalPreview });
		await sleep(processingTime);
		factory.next('processed', { withLocalPreview });
	},
});

export const simulateErrorState: SimulationFactory = () => ({
	description: 'File state is error',
	simulation: async (factory: FileStateFactory) => {
		await sleep(speed);
		factory.next('error');
	},
});

export const simulateError: SimulationFactory = () => ({
	description: 'Subscription throws an error through the observer',
	simulation: async (factory: FileStateFactory) => {
		await sleep(speed);
		factory.error(new Error('error thrown from client'));
	},
});

/**
 * Rare Cases
 */

export const simulateManyProcessed: SimulationFactory<[withRemotePreview?: boolean]> = (
	withRemotePreview = false,
) => ({
	description: '',
	simulation: async (factory: FileStateFactory) => {
		await sleep(speed);
		factory.next('processed', { withRemotePreview });
		await sleep(speed);
		factory.next('processed', { withRemotePreview });
		await sleep(speed);
		factory.next('processed', { withRemotePreview });
	},
});

export const simulateEmptyDetails: SimulationFactory = () => ({
	description: 'Incomplete uploads return empty file details and a processing status pending',
	simulation: async (factory: FileStateFactory) => {
		const emptyDetails = {
			createdAt: 1630986510989,
		};
		await sleep(speed);
		factory.next('processing', { fileDetails: emptyDetails });
	},
});

export const simulateUpdateFileId: SimulationFactory = () => ({
	description:
		'First File Id: video with processing issue. Next File Id: PDF sucessfully processed',
	simulation: async (factory, { updateIdentifier }) => {
		await sleep(speed);
		factory.next('failed-processing');
		await sleep(speed);
		updateIdentifier('doc');
		await sleep(speed);
		factory.next('processing');
		await sleep(speed);
		factory.next('processed');
	},
});

export const simulateAlwaysLoading: SimulationFactory = () => ({
	description: 'File state never fetched',
	simulation: async () => {},
});

export const simulateAlwaysProcessing: SimulationFactory = () => ({
	description: 'File state is permanently processing',
	simulation: async (factory) => {
		await sleep(speed);
		factory.next('processing');
		await sleep(speed);
		factory.next('processing');
		await sleep(speed * 0.5);
	},
});
