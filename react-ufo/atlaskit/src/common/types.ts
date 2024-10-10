export type Label = Readonly<{ name: string }>;
export type SegmentLabel = Readonly<{ name: string; segmentId: string }>;
export type LabelStack = ReadonlyArray<Label | SegmentLabel>;

export type SpanType =
	| 'placeholder'
	| 'relay'
	| 'hidden_timing'
	| 'bundle_load'
	| 'graphql'
	| 'fetch'
	| 'reducer'
	| 'custom';

export interface Span {
	type: SpanType;
	name: string;
	labelStack: LabelStack | null;
	start: number;
	end: number;
	size?: number;
}
