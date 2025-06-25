import { type Context, useContext } from 'react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

export type CustomData = {
	[key: string]: null | string | number | boolean | undefined | CustomData;
};

export type CustomTiming = {
	[key: string]: { startTime: number; endTime: number };
};

export type Label = Readonly<{ name: string }>;
export type SegmentLabel = Readonly<{
	name: string;
	segmentId?: string;
	mode?: 'list' | 'single';
}>;
export type LabelStack = ReadonlyArray<SegmentLabel | Label>;

export interface UFOInteractionContextType extends InteractionContextType {
	labelStack: LabelStack;
	segmentIdMap: Map<string, string>;
	addMark(name: string, timestamp?: number): void;
	addCustomData(customData: CustomData): void;
	addCustomTimings(customTimings: CustomTiming): void;
	addApdex(apdexInfo: { key: string; startTime?: number; stopTime: number }): void;
	holdExperimental?(name: string): void | (() => void);
}

export default InteractionContext as Context<UFOInteractionContextType | null>;

export function useInteractionContext() {
	return useContext(InteractionContext) as UFOInteractionContextType | null;
}
