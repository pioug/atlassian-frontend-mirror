import type { VCRawDataType, VCResult } from '../common/vc/types';

export type GetVCResultType = {
	start: number;
	stop: number;
	tti: number;
	isEventAborted: boolean;
	prefix?: string;
	ssr?: number;
	vc?: VCRawDataType | null;
	experienceKey: string;
};

export type SelectorConfig = {
	id: boolean;
	testId: boolean;
	role: boolean;
	className: boolean;
	dataVC?: boolean;
};

export type VCObserverOptions = {
	heatmapSize?: number | undefined;
	oldDomUpdates?: boolean | undefined;
	devToolsEnabled?: boolean | undefined;
	selectorConfig?: SelectorConfig | undefined;
	isPostInteraction?: boolean;
};

export interface VCObserverInterface {
	start(startArg: { startTime: number; experienceKey?: string }): void;
	stop(experienceKey?: string): void;
	getVCRawData(): VCRawDataType | null;
	getVCResult(param: GetVCResultType): Promise<VCResult>;
	setSSRElement(element: HTMLElement): void;
	setReactRootRenderStart(startTime?: number): void;
	setReactRootRenderStop(stopTime?: number): void;
}
