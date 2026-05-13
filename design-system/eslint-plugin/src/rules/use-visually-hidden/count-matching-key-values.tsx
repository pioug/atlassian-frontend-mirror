import { type ReferenceObject } from './reference-object';

const referenceObject = {
	width: '1px',
	height: '1px',
	padding: '0',
	position: 'absolute',
	border: '0',
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
};
type KeyValue = {
	key: string;
	value: string;
};

export const countMatchingKeyValues: (styleEntries: KeyValue[]) => number = (
	styleEntries: KeyValue[],
) => {
	const matchingStyleEntries = styleEntries.filter(
		(entry: any): entry is Partial<ReferenceObject> => {
			return entry.key in referenceObject;
		},
	);

	if (styleEntries.length < 5) {
		return 0;
	}

	return (
		matchingStyleEntries.reduce(
			(acc, curr) =>
				acc + (referenceObject[curr?.key as keyof ReferenceObject] === curr?.value ? 1.5 : 0.75),
			0,
		) / styleEntries.length
	);
};
