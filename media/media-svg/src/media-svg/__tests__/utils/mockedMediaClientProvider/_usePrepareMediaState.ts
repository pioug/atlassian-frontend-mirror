import { useEffect, useMemo, useRef, useState } from 'react';

import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type {
	GeneratedItemWithBinaries,
	ItemWithBinariesGenerator,
} from '@atlaskit/media-test-data/items-with-binaries/types';

import {
	createMockedMediaClientProviderWithBinaries,
	type CreateMockedMediaClientProviderWithBinariesResult,
} from './_MockedMediaClientProviderWithBinaries';

export type UsePrepareMediaStateResult = [
	CreateMockedMediaClientProviderWithBinariesResult,
	FileIdentifier[],
];

export const usePrepareMediaState = (
	generators: ItemWithBinariesGenerator[] = [],
): UsePrepareMediaStateResult => {
	const generatorsRef = useRef(generators); // Using ref to prevent endless loops
	const [generatedItems, setGeneratedItems] = useState<GeneratedItemWithBinaries[]>();

	useEffect(() => {
		Promise.all(generatorsRef.current.map((generator) => generator())).then(setGeneratedItems);
	}, []);

	const identifiers = useMemo(
		() => generatedItems?.map(([, identifier]) => identifier) || [],
		[generatedItems],
	);

	const initialItemsWithBinaries = useMemo(
		() => generatedItems?.map(([generatedFileItem]) => generatedFileItem),
		[generatedItems],
	);

	const createdMockedMediaClientProvider = useMemo(
		() =>
			createMockedMediaClientProviderWithBinaries({
				initialItemsWithBinaries,
			}),
		[initialItemsWithBinaries],
	);
	return [createdMockedMediaClientProvider, identifiers];
};
