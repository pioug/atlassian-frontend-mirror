export interface LayoutShiftAttribution {
	readonly node: Node;
	readonly previousRect: DOMRectReadOnly;
	readonly currentRect: DOMRectReadOnly;
	readonly toJSON: () => object;
}

export interface LayoutShiftPerformanceEntry extends PerformanceEntry {
	value: number;
	sources: LayoutShiftAttribution[];
}
