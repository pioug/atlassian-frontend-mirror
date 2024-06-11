import { useState, useMemo } from 'react';
import { type FileIdentifier } from '@atlaskit/media-client';

export const useSelectOptions = (identifiers: FileIdentifier[], fileKeys: string[]) => {
	const defaultOption = useMemo(
		() => ({ label: fileKeys[0], value: identifiers[0] }),
		[identifiers, fileKeys],
	);

	const options = useMemo(
		() =>
			identifiers.map((identifier, index) => ({
				label: fileKeys[index],
				value: identifier,
			})),
		[identifiers, fileKeys],
	);
	const [identifier, setIdentifier] = useState<FileIdentifier>(defaultOption.value);

	return { options, defaultOption, identifier, setIdentifier };
};
