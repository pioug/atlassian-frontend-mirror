export const PROFILER_KEY = '__editorRenderCountProfiler';

interface ComponentInstanceRenderCounter {
	count: number;
	instanceId: string;
}

type ProfilerData = {
	components?: {
		[componentId: string]: {
			[instanceId: string]: {
				count: number;
			};
		};
	};
	enabled: boolean;
};

type RenderCountProfilerInstanceParams = {
	store: Object;
};

export class RenderCountProfiler {
	/**
	 * The singleton/cached instance of RenderCountProfiler that will be shared
	 * betweenRenderCountProfiler.getInstance() calls
	 */
	private static instance: RenderCountProfiler;

	private store: {
		[PROFILER_KEY]?: ProfilerData;
	};

	private constructor({ store }: RenderCountProfilerInstanceParams) {
		this.store = store;
	}

	/**
	 * Returns the singleton/cached instance of RenderCountProfiler that
	 * currently exists. If it hasn't been instantiated yet, the singleton
	 * instance will be created using the given params. Returns the latest
	 * singleton/instance.
	 */
	static getInstance(params: RenderCountProfilerInstanceParams): RenderCountProfiler {
		if (!RenderCountProfiler.instance) {
			RenderCountProfiler.instance = new RenderCountProfiler({
				store: (params as RenderCountProfilerInstanceParams).store,
			});
		}
		return RenderCountProfiler.instance;
	}

	getData(profilerKey: typeof PROFILER_KEY): ProfilerData | void {
		return this.store?.[profilerKey];
	}

	enable(): void {
		this.store[PROFILER_KEY] = {
			...this.store[PROFILER_KEY],
			enabled: true,
		};
	}

	remove(): void {
		delete this.store[PROFILER_KEY];
	}

	isEnabled(): boolean {
		return Boolean(this.store?.[PROFILER_KEY]?.enabled);
	}

	setRenderCount({
		componentId,
		renderCount,
		instanceId,
	}: {
		componentId: string;
		instanceId: string;
		renderCount: number;
	}): void {
		const profilerData = this.store[PROFILER_KEY];
		const instance = { count: renderCount };
		const existingComponents = profilerData?.components;
		const existingInstances = existingComponents?.[componentId];
		const updatedComponent = { ...existingInstances, [instanceId]: instance };
		this.store[PROFILER_KEY] = {
			...(profilerData as ProfilerData),
			components: {
				...existingComponents,
				[componentId]: updatedComponent,
			},
		};
	}

	getInstanceRenderCounters({
		componentId,
	}: {
		componentId: string;
	}): ComponentInstanceRenderCounter[] {
		const component = this.store?.[PROFILER_KEY]?.components?.[componentId] ?? {};
		const counters = [];
		// eslint-disable-next-line guard-for-in
		for (const instanceId in component) {
			const counter = { instanceId, count: component[instanceId].count };
			counters.push(counter);
		}
		return counters;
	}

	getRenderCount({ componentId }: { componentId: string }): number {
		const component = this.store?.[PROFILER_KEY]?.components?.[componentId] ?? {};
		let total = 0;
		// eslint-disable-next-line guard-for-in
		for (const instanceId in component) {
			total += component[instanceId].count;
		}
		return total;
	}
}
