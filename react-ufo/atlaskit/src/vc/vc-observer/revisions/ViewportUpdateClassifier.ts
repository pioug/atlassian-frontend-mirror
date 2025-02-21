import type { FilterComponentsLogArgs, VCCalculationMethodArgs } from './types';

export type FilterArgs = { type: string; tags?: string[]; ignoreReason?: string };

type Filter = {
	name: string;
	filter: (args: FilterArgs) => boolean;
};

type ClassifyUpdateArgs = {
	element: HTMLElement;
	type: string;
	tags?: string[];
	ignoreReason?: string;
};

export class ViewportUpdateClassifier {
	types: string[] = [];

	filters: Filter[] = [];

	removedFilters: string[] = [];

	VCCalculationMethod(_: VCCalculationMethodArgs) {
		return {
			VC: {},
			VCBox: {},
		};
	}

	// @todo remove it once fixed as described: https://product-fabric.atlassian.net/browse/AFO-3443
	filterComponentsLog({ componentsLog }: FilterComponentsLogArgs) {
		return componentsLog;
	}

	protected __combinedTypes: string[] = [];

	protected __combinedFilters: Filter[] = [];

	mergeConfig() {
		this.__combinedTypes = [...this.types, ...(this?.__combinedTypes || [])];
		const previousFilters =
			this.removedFilters.length === 0
				? this.__combinedFilters
				: this.__combinedFilters.filter((filter) => !this.removedFilters.includes(filter.name));
		this.__combinedFilters = [...this.filters, ...previousFilters];
	}

	classifyUpdate({ element, type, tags, ignoreReason }: ClassifyUpdateArgs) {
		if (!this.__combinedTypes.includes(type)) {
			return false;
		}

		return this.__combinedFilters.every(({ filter, name }) => {
			return filter({ type, tags, ignoreReason });
		});
	}
}
