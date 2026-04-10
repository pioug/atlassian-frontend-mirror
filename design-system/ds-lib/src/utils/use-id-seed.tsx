import { useId } from './use-id';

type SeedGenerator = (id: any) => string;

/**
 * Generates a seed for the useId hook.
 */
export function useIdSeed(): SeedGenerator {
	const uid = useId();
	return (id: any) => `${uid}-${id.toString()}`;
}
