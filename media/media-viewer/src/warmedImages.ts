/**
 * Full resolution image fetches started before the viewer opens.
 *
 * `ImageViewer` takes the entry for the file it opens and awaits the same request, so
 * the image downloads once even when the click lands while the warm-up is still
 * downloading.
 *
 * Taking an entry hands over its `AbortController` too. The viewer then owns the
 * download, and closing the viewer aborts it as it aborts the viewer's own request.
 * Entries nobody takes are aborted when they are evicted or expire.
 *
 * Whoever takes the blob creates and revokes its own object URL.
 *
 * Entries are keyed by file, collection and watermark version. The watermark is
 * applied server-side, so a warm-up made before a watermark config change carries
 * the old watermark, and a viewer opened after the change must not take it.
 *
 * The store lives on `globalThis`, not in this module. A bundler can copy a small
 * module into several bundles, each with its own module state, and the warm-up and
 * `ImageViewer` load from different bundles. The shared key gives every copy of this
 * file the same store.
 */

/**
 * How many untaken warm-ups to hold at once. These are full resolution images and can
 * be several megabytes each, so the ceiling is deliberately low: the point is the
 * image the user is about to open, plus a little slack for hovering past one image on
 * the way to another.
 */
const MAX_WARMED_IMAGES = 2;

/** How long an untaken warm-up is held. Covers a hover followed by a click. */
export const WARMED_IMAGE_TTL_MS = 30_000;

export type WarmedImage = {
	image: Promise<Blob>;
	controller: AbortController;
};

/** How a warm-up left the store. */
export type WarmUpOutcome = 'taken' | 'expired' | 'evicted' | 'replaced' | 'failed';

export type WarmUpListener = {
	/** Called once, when the warm-up leaves the store. `blob` is set if it had downloaded. */
	onEnd?: (outcome: WarmUpOutcome, blob: Blob | undefined) => void;
	/** Called when the request fails for a reason other than an abort. */
	onError?: (error: unknown, wasTaken: boolean) => void;
};

type Entry = WarmedImage & {
	expiry: ReturnType<typeof setTimeout>;
	listener?: WarmUpListener;
	blob?: Blob;
};

// Versioned, so a later change to `Entry` never reads a store another version wrote.
const STORE_KEY = Symbol.for('@atlaskit/media-viewer/warmed-images/v1');

const getStore = (): Map<string, Entry> => {
	const scope = globalThis as unknown as Record<symbol, Map<string, Entry> | undefined>;
	let store = scope[STORE_KEY];
	if (!store) {
		store = new Map<string, Entry>();
		scope[STORE_KEY] = store;
	}
	return store;
};

/**
 * Listeners report analytics. A throw from one must not break a take, which runs
 * inside `ImageViewer`, or an eviction, which runs inside the next warm-up.
 */
const notify = (call: () => void): void => {
	try {
		call();
	} catch {
		// Ignored, see above.
	}
};

export type WarmedImageKeyParts = {
	id: string;
	collectionName?: string;
	/**
	 * The `wmv` the image request carries, from `MediaClient.getImageWatermarkVersion`.
	 * Required, so no caller can leave it out.
	 */
	watermarkVersion: string | undefined;
};

export const getWarmedImageKey = ({
	id,
	collectionName,
	watermarkVersion,
}: WarmedImageKeyParts): string =>
	// Joined as JSON, because a watermark version can contain any separator character.
	JSON.stringify([id, collectionName ?? '', watermarkVersion ?? '']);

export const hasWarmedImage = (key: string): boolean => getStore().has(key);

/**
 * Whether any warm-up is held for the file, whatever its watermark version. Lets
 * `ImageViewer` skip resolving the version when there is nothing it could take.
 */
export const hasWarmedImageForFile = ({
	id,
	collectionName,
}: Omit<WarmedImageKeyParts, 'watermarkVersion'>): boolean => {
	// The file's keys all start with the JSON of its first two parts, minus the closing
	// bracket. JSON quotes each part, so no other file's key can share the prefix.
	const prefix = `${JSON.stringify([id, collectionName ?? '']).slice(0, -1)},`;
	return [...getStore().keys()].some((key) => key.startsWith(prefix));
};

const removeWarmedImage = (key: string, outcome?: WarmUpOutcome): Entry | undefined => {
	const store = getStore();
	const entry = store.get(key);
	if (entry) {
		clearTimeout(entry.expiry);
		store.delete(key);
		const onEnd = entry.listener?.onEnd;
		if (outcome && onEnd) {
			notify(() => onEnd(outcome, entry.blob));
		}
	}
	return entry;
};

const discardWarmedImage = (key: string, outcome?: WarmUpOutcome): void => {
	removeWarmedImage(key, outcome)?.controller.abort();
};

export const setWarmedImage = (
	key: string,
	{ image, controller }: WarmedImage,
	listener?: WarmUpListener,
): void => {
	const store = getStore();
	discardWarmedImage(key, 'replaced');

	// `Map` iterates in insertion order, so the first key is the oldest.
	if (store.size >= MAX_WARMED_IMAGES) {
		const oldest = store.keys().next().value;
		if (oldest !== undefined) {
			discardWarmedImage(oldest, 'evicted');
		}
	}

	const entry: Entry = {
		image,
		controller,
		listener,
		expiry: setTimeout(() => discardWarmedImage(key, 'expired'), WARMED_IMAGE_TTL_MS),
	};
	store.set(key, entry);

	image.then(
		(blob) => {
			entry.blob = blob;
		},
		(error) => {
			// Every removal except a take aborts the request, and so does closing the
			// viewer after a take. None of those are failures.
			if (controller.signal.aborted) {
				return;
			}
			// Drop a failed warm-up so a later hover can try again. This handler also marks
			// the rejection as handled when nobody takes the warm-up.
			const wasTaken = getStore().get(key) !== entry;
			if (!wasTaken) {
				removeWarmedImage(key, 'failed');
			}
			const onError = listener?.onError;
			if (onError) {
				notify(() => onError(error, wasTaken));
			}
		},
	);
};

/**
 * Removes the warm-up for `key` and hands it over. The caller owns the request from
 * here, including aborting it.
 */
export const takeWarmedImage = (key: string): WarmedImage | undefined => {
	const entry = removeWarmedImage(key, 'taken');
	return entry && { image: entry.image, controller: entry.controller };
};

/** Aborts and drops every warm-up without reporting an outcome. For tests. */
export const clearWarmedImages = (): void => {
	[...getStore().keys()].forEach((key) => discardWarmedImage(key));
};
