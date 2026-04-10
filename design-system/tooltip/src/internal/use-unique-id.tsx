import { useIdSeed } from '@atlaskit/ds-lib/use-id-seed';

/**
 * Generates unique ID.
 */
export default function useUniqueId(prefix: string, shouldRenderId: boolean): string | undefined {
	const seed = useIdSeed();

	return shouldRenderId ? `${seed(prefix)}` : undefined;
}
