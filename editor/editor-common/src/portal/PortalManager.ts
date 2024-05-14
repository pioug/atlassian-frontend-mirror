type PortalsBucketUpdater = React.Dispatch<
  React.SetStateAction<Record<React.Key, React.ReactPortal>>
>;
type PortalRendererUpdater = React.Dispatch<
  React.SetStateAction<Array<PortalBucketType>>
>;

type PortalBucketType = {
  portals: Record<React.Key, React.ReactPortal>;
  capacity: number;
  updater: PortalsBucketUpdater | null;
};

const DEFAULT_INITIAL_BUCKETS = 50;
const DEFAULT_MAX_BUCKET_CAPACITY = 50;
const DEFAULT_SCALE_RATIO = 0.5;

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
 * @typedef {Object} PortalManager
 *
 * @property {number} maxBucketCapacity - The maximum capacity of each bucket before a new bucket is created.
 * @property {number} scaleRatio - The ratio to determine the number of new buckets to add when scaling up.
 * @property {Array<PortalBucketType>} buckets - An array of bucket objects where each bucket holds a record of React portals.
 * @property {Set<number>} availableBuckets - A set of indices representing buckets that have available capacity.
 * @property {Map<React.Key, number>} portalToBucketMap - A map of React portal keys to their corresponding bucket indices.
 * @property {PortalRendererUpdater|null} portalRendererUpdater - A function to trigger updates to the rendering of portals.
 * @property {number} scaleCapacityThreshold - The threshold at which the buckets are scaled up to accommodate more portals.
 *
 * @param {number} [initialBuckets=DEFAULT_INITIAL_BUCKETS] - The initial number of buckets to create.
 * @param {number} [maxBucketCapacity=DEFAULT_MAX_BUCKET_CAPACITY] - The maximum number of portals a single bucket can hold.
 * @param {number} [scaleRatio=DEFAULT_SCALE_RATIO] - The ratio used to calculate the number of new buckets to add when scaling.
 */
export class PortalManager {
  private maxBucketCapacity: number;
  private scaleRatio: number;
  private buckets: Array<PortalBucketType>;
  private availableBuckets: Set<number>;
  private portalToBucketMap: Map<React.Key, number>;
  private portalRendererUpdater: PortalRendererUpdater | null;
  private scaleCapacityThreshold: number;

  constructor(
    initialBuckets = DEFAULT_INITIAL_BUCKETS,
    maxBucketCapacity = DEFAULT_MAX_BUCKET_CAPACITY,
    scaleRatio = DEFAULT_SCALE_RATIO,
  ) {
    this.maxBucketCapacity = maxBucketCapacity;
    this.scaleRatio = scaleRatio;

    // Initialise buckets array by creating an array of length `initialBuckets` containing empty buckets
    this.buckets = Array.from({ length: initialBuckets }, () =>
      createEmptyBucket(maxBucketCapacity),
    );

    this.portalToBucketMap = new Map();

    this.availableBuckets = new Set(
      Array.from({ length: initialBuckets }, (_, i) => i),
    );

    this.portalRendererUpdater = null;
    this.scaleCapacityThreshold = maxBucketCapacity / 2;
  }

  private getCurrentBucket() {
    return this.availableBuckets.values().next().value;
  }

  private createBucket() {
    const currentBucket = this.getCurrentBucket();

    //If the current bucket has capacity, skip this logic
    if (this.buckets[currentBucket].capacity > 0) {
      return;
    } else {
      // The current bucket is full, delete the bucket from the list of available buckets
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

  getBuckets() {
    return this.buckets;
  }

  registerBucket(id: number, updater: PortalsBucketUpdater) {
    this.buckets[id].updater = updater;
    this.buckets[id].updater?.(() => ({ ...this.buckets[id].portals }));
  }

  unregisterBucket(id: number) {
    this.buckets[id].updater = null;
  }

  updateBuckets(id: number) {
    this.buckets[id].updater?.(() => {
      // new object is required to trigger react updates
      return { ...this.buckets[id].portals };
    });
  }

  registerPortal(key: React.Key, portal: React.ReactPortal) {
    this.createBucket();
    this.buckets[this.getCurrentBucket()].capacity -= 1;

    const id = this.portalToBucketMap.get(key) ?? this.getCurrentBucket();
    this.portalToBucketMap.set(key, id);
    if (this.buckets[id].portals[key] !== portal) {
      this.buckets[id].portals[key] = portal;
      this.updateBuckets(id);
    }

    //returns a function to unregister the portal
    return () => {
      delete this.buckets[id].portals[key];
      this.portalToBucketMap.delete(key);
      this.buckets[id].capacity += 1;
      if (this.buckets[id].capacity > this.scaleCapacityThreshold) {
        this.availableBuckets.add(id);
      }
      this.updateBuckets(id);
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
