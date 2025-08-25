import throttle from 'lodash/throttle';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type PortalsBucketUpdater = React.Dispatch<
	React.SetStateAction<Record<string | number, React.ReactPortal>>
>;
type PortalRendererUpdater = React.Dispatch<React.SetStateAction<Array<PortalBucketType>>>;

type PortalBucketType = {
	capacity: number;
	portals: Record<string | number, React.ReactPortal>;
	updater: PortalsBucketUpdater | null;
};

const DEFAULT_INITIAL_BUCKETS = 50;
const DEFAULT_MAX_BUCKET_CAPACITY = 50;
const DEFAULT_SCALE_RATIO = 0.5;
const DEFAULT_THROTTLE_DELAY = 16; // ~60fps for smooth updates

/**
 * Creates an empty bucket object with a specified capacity. Each bucket is designed
 * to hold a certain number of React portals and has an associated updater function
 * which can be null initially.
 *
 * @function createEmptyBucket
 * @param {number} capacity - The maximum capacity of the bucket.
 * @returns {PortalBucketType} An object representing an empty bucket with the specified capacity.
 */
function createEmptyBucket(capacity: number): PortalBucketType {
	return {
		portals: {},
		capacity,
		updater: null,
	};
}

/**
 * A utility class to manage and dynamically scale React portals across multiple buckets.
 * It allows for efficient rendering of large numbers of React portals by distributing them
 * across "buckets" and updating these buckets as necessary to balance load and performance.
 *
 * @class PortalManager
 * @typedef {object} PortalManager
 *
 * @property {number} maxBucketCapacity - The maximum capacity of each bucket before a new bucket is created.
 * @property {number} scaleRatio - The ratio to determine the number of new buckets to add when scaling up.
 * @property {Array<PortalBucketType>} buckets - An array of bucket objects where each bucket holds a record of React portals.
 * @property {Set<number>} availableBuckets - A set of indices representing buckets that have available capacity.
 * @property {Map<React.Key, number>} portalToBucketMap - A map of React portal keys to their corresponding bucket indices.
 * @property {PortalRendererUpdater|null} portalRendererUpdater - A function to trigger updates to the rendering of portals.
 * @property {number} scaleCapacityThreshold - The threshold at which the buckets are scaled up to accommodate more portals.
 * @property {Map<number, ReturnType<typeof throttle>>} throttledBucketUpdaters - A map of bucket IDs to their throttled update functions.
 * @property {number} throttleDelay - The delay in milliseconds for throttling bucket updates.
 *
 * @param {number} [initialBuckets=DEFAULT_INITIAL_BUCKETS] - The initial number of buckets to create.
 * @param {number} [maxBucketCapacity=DEFAULT_MAX_BUCKET_CAPACITY] - The maximum number of portals a single bucket can hold.
 * @param {number} [scaleRatio=DEFAULT_SCALE_RATIO] - The ratio used to calculate the number of new buckets to add when scaling.
 * @param {number} [throttleDelay=DEFAULT_THROTTLE_DELAY] - The delay in milliseconds for throttling updates.
 */
export class PortalManager {
	private maxBucketCapacity: number;
	private scaleRatio: number;
	private buckets: Array<PortalBucketType>;
	private availableBuckets: Set<number>;
	private portalToBucketMap: Map<React.Key, number>;
	private portalRendererUpdater: PortalRendererUpdater | null;
	private scaleCapacityThreshold: number;
	private throttledBucketUpdaters: Map<number, ReturnType<typeof throttle>>;
	private throttleDelay: number;

	constructor(
		initialBuckets = DEFAULT_INITIAL_BUCKETS,
		maxBucketCapacity = DEFAULT_MAX_BUCKET_CAPACITY,
		scaleRatio = DEFAULT_SCALE_RATIO,
		throttleDelay = DEFAULT_THROTTLE_DELAY,
	) {
		this.maxBucketCapacity = maxBucketCapacity;
		this.scaleRatio = scaleRatio;
		this.throttleDelay = throttleDelay;

		// Initialise buckets array by creating an array of length `initialBuckets` containing empty buckets
		this.buckets = Array.from({ length: initialBuckets }, () =>
			createEmptyBucket(maxBucketCapacity),
		);

		this.portalToBucketMap = new Map();

		this.availableBuckets = new Set(Array.from({ length: initialBuckets }, (_, i) => i));

		this.portalRendererUpdater = null;
		this.scaleCapacityThreshold = maxBucketCapacity / 2;
		this.throttledBucketUpdaters = new Map();
	}

	private getCurrentBucket() {
		return this.availableBuckets.values().next().value;
	}

	private createBucket() {
		const currentBucket = this.getCurrentBucket();

		//If the current bucket has capacity, skip this logic
		// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
		if (this.buckets[currentBucket].capacity > 0) {
			return;
		} else {
			// The current bucket is full, delete the bucket from the list of available buckets
			// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
			this.availableBuckets.delete(currentBucket);
		}

		// Skip creating new bucket if there are buckets still available
		if (this.availableBuckets.size > 0) {
			return;
		}

		// Scale the buckets up only if there are no available buckets left
		// Calculate how many new buckets need to be added
		const numBucketsToAdd = Math.floor(this.buckets.length * this.scaleRatio);
		this.buckets = [...this.buckets];
		for (let i = 0; i < numBucketsToAdd; i++) {
			this.buckets.push(createEmptyBucket(this.maxBucketCapacity));
			this.availableBuckets.add(this.buckets.length - 1);
		}

		this.portalRendererUpdater?.(this.buckets);
	}

	private getOrCreateThrottledUpdater(id: number): ReturnType<typeof throttle> | undefined {
		if (!this.throttledBucketUpdaters.has(id)) {
			const throttledUpdater = throttle(() => {
				this.buckets[id]?.updater?.(() => ({ ...this.buckets[id].portals }));
			}, this.throttleDelay);

			this.throttledBucketUpdaters.set(id, throttledUpdater);
		}

		return this.throttledBucketUpdaters.get(id);
	}

	getBuckets() {
		return this.buckets;
	}

	registerBucket(id: number, updater: PortalsBucketUpdater) {
		this.buckets[id].updater = updater;
		this.buckets[id].updater?.(() => ({ ...this.buckets[id].portals }));
	}

	unregisterBucket(id: number) {
		this.buckets[id].updater = null;
		// Clean up throttled updater when bucket is unregistered
		if (this.throttledBucketUpdaters.has(id)) {
			this.throttledBucketUpdaters.get(id)?.cancel();
			this.throttledBucketUpdaters.delete(id);
		}
	}

	updateBuckets(id: number, immediate = false) {
		if (immediate || !expValEquals('platform_editor_debounce_portal_provider', 'isEnabled', true)) {
			// Cancel any pending throttled update and update immediately
			if (this.throttledBucketUpdaters.has(id)) {
				this.throttledBucketUpdaters.get(id)?.cancel();
			}
			this.buckets[id].updater?.(() => ({ ...this.buckets[id].portals }));
		} else {
			// Use throttled update for smooth, regular updates
			this.getOrCreateThrottledUpdater(id)?.();
		}
	}

	registerPortal(key: string | number, portal: React.ReactPortal, immediate = false) {
		this.createBucket();
		// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
		this.buckets[this.getCurrentBucket()].capacity -= 1;

		const id = this.portalToBucketMap.get(key) ?? this.getCurrentBucket();
		// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
		this.portalToBucketMap.set(key, id);
		// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
		if (this.buckets[id].portals[key] !== portal) {
			// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
			this.buckets[id].portals[key] = portal;
			// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
			this.updateBuckets(id, immediate);
		}

		//returns a function to unregister the portal
		return () => {
			// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
			delete this.buckets[id].portals[key];
			this.portalToBucketMap.delete(key);
			// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
			this.buckets[id].capacity += 1;
			// @ts-ignore - TS2538 TypeScript 5.9.2 upgrade
			if (this.buckets[id].capacity > this.scaleCapacityThreshold) {
				// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
				this.availableBuckets.add(id);
			}
			// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
			this.updateBuckets(id, immediate);
		};
	}

	registerPortalRenderer(updater: PortalRendererUpdater) {
		if (!this.portalRendererUpdater) {
			updater(() => this.buckets);
		}
		this.portalRendererUpdater = updater;
	}

	unregisterPortalRenderer() {
		this.portalRendererUpdater = null;
	}

	/**
	 * Cleans up resources used by the PortalManager. This includes clearing all portals,
	 * unregistering all buckets, and resetting internal state.
	 */
	destroy() {
		// Cancel all pending throttled updates
		this.throttledBucketUpdaters.forEach((updater) => {
			updater.cancel();
		});
		this.throttledBucketUpdaters.clear();

		// Iterate through each bucket and clear its portals and unset the updater function
		this.buckets.forEach((bucket, id) => {
			bucket.portals = {}; // Clearing all portals from the bucket
			bucket.updater = null; // Unsetting the bucket's updater function
			this.availableBuckets.add(id); // Mark all buckets as available
		});
		this.portalToBucketMap.clear();
		this.portalRendererUpdater = null;
		this.availableBuckets = new Set(this.buckets.map((_, index) => index));
	}
}
