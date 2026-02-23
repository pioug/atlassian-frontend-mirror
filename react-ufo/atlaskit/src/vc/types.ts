import type { VCRawDataType, VCResult } from '../common/vc/types';
import type { AbortReasonType, InteractionType } from '../interaction-metrics';

export type GetVCResultType = {
	start: number;
	stop: number;
	tti: number;
	isEventAborted: boolean;
	prefix?: string;
	ssr?: number;
	includeSSRInV3?: boolean;
	vc?: VCRawDataType | null;
	experienceKey: string;
	interactionId?: string;
	includeSSRRatio?: boolean;
	include3p?: boolean;
	excludeSmartAnswersInSearch?: boolean;
	interactionType: InteractionType;
	isPageVisible: boolean;
	interactionAbortReason?: AbortReasonType;
	includeRawData?: boolean;
	rawDataStopTime?: number;
	reportLayoutShiftOffenders?: boolean;
};

export type SelectorConfig = {
	id: boolean;
	testId: boolean;
	role: boolean;
	className: boolean;
	dataVC?: boolean;
};

export type SearchPageConfig = {
	/**
	 * Whether to enable detection of smart answers mutations
	 */
	enableSmartAnswersMutations?: boolean;

	/**
	 * Route of the search page. If this is not specified, then all other VC
	 * configurations related to the search page will be ignored. This is
	 * done to ensure that search page specific computations are not performed
	 * for non-search page interactions.
	 */
	searchPageRoute?: string;
};

export type VCObserverOptions = {
	heatmapSize?: number | undefined;
	oldDomUpdates?: boolean | undefined;
	devToolsEnabled?: boolean | undefined;
	selectorConfig?: SelectorConfig | undefined;
	isPostInteraction?: boolean;
	ssrEnablePageLayoutPlaceholder?: boolean;
	ssrPlaceholderHandler?: any; // SSRPlaceholderHandlers | null - using any to avoid circular import
	trackLayoutShiftOffenders?: boolean;
	searchPageConfig?: SearchPageConfig;
};

export interface VCObserverInterface {
	start(startArg: { startTime: number; experienceKey?: string }): void;
	stop(experienceKey?: string): void;
	getVCRawData(): VCRawDataType | null;
	getVCResult(param: GetVCResultType): Promise<VCResult>;
	setSSRElement(element: HTMLElement): void;
	setReactRootRenderStart(startTime?: number): void;
	setReactRootRenderStop(stopTime?: number): void;
	collectSSRPlaceholders?(): void;
}
