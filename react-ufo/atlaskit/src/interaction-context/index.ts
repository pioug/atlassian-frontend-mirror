/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type Context } from 'react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import { type UFOSegmentType } from '../segment/segment';

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
	type?: UFOSegmentType;
	excludeFromMetrics?: boolean;
}>;

export type LabelStack = ReadonlyArray<SegmentLabel | Label>;

export interface UFOInteractionContextType extends InteractionContextType {
	labelStack: LabelStack;
	segmentIdMap: Map<string, string>;
	addMark(name: string, timestamp?: number): void;
	addCustomData(customData: CustomData): void;
	addCustomTimings(customTimings: CustomTiming): void;
	addApdex(apdexInfo: { key: string; startTime?: number; stopTime: number }): void;
}

export default InteractionContext as Context<UFOInteractionContextType | null>;

/**
 * @deprecated Use `import { useInteractionContext } from '@atlaskit/react-ufo/use-interaction-context'` instead.
 */
export { useInteractionContext } from './useInteractionContext';
