export type MakePreloadKeyArgs = {
	name: string;
	routeIdentifier?: string;
	query?: Readonly<Record<string, string | undefined>>;
	source?: string;
};

export function makePreloadKey({
	name,
	routeIdentifier,
	query,
	source,
}: MakePreloadKeyArgs): string {
	const normalizedQuery = Object.entries(query ?? {})
		.filter((entry): entry is [string, string] => entry[1] !== undefined)
		.sort(([left], [right]) => left.localeCompare(right));

	return JSON.stringify([name, routeIdentifier ?? '', normalizedQuery, source ?? '']);
}
