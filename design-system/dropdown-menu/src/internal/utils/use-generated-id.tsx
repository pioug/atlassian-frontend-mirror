import { useId } from '@atlaskit/ds-lib/use-id';

export const PREFIX = 'ds--dropdown--';

/**
 * useGeneratedId generates a random string which remains constant across
 * renders when called without any parameter.
 */
export default function useGeneratedId() {
	const id = useId();
	return `${PREFIX}${id}`;
}
