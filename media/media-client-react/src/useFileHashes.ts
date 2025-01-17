import { useMediaStore } from './useMediaStore';

export function useFileHashes() {
	const fileHashes = useMediaStore((state) =>
		Object.fromEntries(Object.entries(state.files).map(([key, val]) => [key, val.hash])),
	);
	return fileHashes;
}
