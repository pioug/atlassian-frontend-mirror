import { useEffect, useState } from 'react';
import { type MediaType, type FileState, type FileIdentifier } from '@atlaskit/media-client';
import {
	FileStateFactory,
	type MediaClientMockOptions,
	createIdentifier,
	createFileDetails,
} from '../factory';

const defaultDelay = 1500;

export type SimulationSettings = {
	mediaType?: MediaType;
	mediaClientMockOptions?: MediaClientMockOptions;
};

const useSimulationSettings = ({
	mediaType,
	mediaClientMockOptions = {},
}: SimulationSettings = {}) => {
	const [identifier, setIdentifier] = useState(createIdentifier());
	const [fileStateFactory] = useState(
		new FileStateFactory(identifier, {
			fileDetails: createFileDetails(identifier.id, mediaType),
			mediaClientMockOptions: {
				// default options
				getImageDelay: defaultDelay,
				...mediaClientMockOptions,
			},
		}),
	);

	const [updateIdentifier] = useState(() => (newMediaType?: MediaType): void => {
		const newId = createIdentifier();
		fileStateFactory.updateIdentifier(
			newId,
			createFileDetails(newId.id, newMediaType || mediaType),
		);
		setIdentifier(newId);
	});

	return { fileStateFactory, identifier, updateIdentifier };
};

export type SimulationUtils = {
	updateIdentifier: (newMediaType?: MediaType) => void;
};

export type Simulation = (fileStateFactory: FileStateFactory, utils: SimulationUtils) => void;

export const useRunSimulation = (
	simulation: Simulation,
	simulationSettings: SimulationSettings = {},
) => {
	const { identifier, fileStateFactory, updateIdentifier } =
		useSimulationSettings(simulationSettings);

	const fileState = useSubscribeToFileState(identifier, fileStateFactory);

	useEffect(() => {
		simulation(fileStateFactory, { updateIdentifier });
	}, [fileStateFactory, updateIdentifier, simulation]);

	return {
		identifier,
		fileStateFactory,
		fileState,
		updateIdentifier,
	};
};

const useSubscribeToFileState = (
	identifier: FileIdentifier,
	fileStateFactory: FileStateFactory,
) => {
	const [fileState, setFileState] = useState<FileState | { status: string }>();
	useEffect(() => {
		const subscription = fileStateFactory.mediaClient.file
			.getFileState(identifier.id, { ...identifier })
			.subscribe({
				next: (filestate) => setFileState(filestate),
				error: () => setFileState({ status: 'subscription error' }),
			});
		return () => {
			subscription.unsubscribe();
		};
	}, [fileStateFactory, identifier]);
	return fileState;
};
