import type { ComponentsLogType } from '../../../common/vc/types';

import { ViewportUpdateClassifier } from './ViewportUpdateClassifier';

export type RevisionEntry = {
	name: string;
	classifier: ViewportUpdateClassifier;
};

export type VCType = { [key: string]: number | null };
export type VCBoxType = { [key: string]: null | Set<string> };

export type VCCalculationMethodArgs = {
	VCParts: number[];
	entries: number[][];
	totalPainted: number;
	componentsLog: ComponentsLogType;
};

export type VCCalculationMethodReturn = {
	VC: VCType;
	VCBox: VCBoxType;
};

export type VCCalculationMethodType = (args: VCCalculationMethodArgs) => VCCalculationMethodReturn;

export type FilterComponentsLogArgs = {
	componentsLog: ComponentsLogType;
	ttai: number;
};

export type FilterComponentsLogType = (args: FilterComponentsLogArgs) => ComponentsLogType;
