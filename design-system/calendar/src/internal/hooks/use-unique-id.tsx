import { useUIDSeed } from 'react-uid';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useUniqueId(prefix: string) {
	const seed = useUIDSeed();

	return `${prefix}-${seed(prefix)}`;
}
