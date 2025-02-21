import { fg } from '@atlaskit/platform-feature-flags';

import type {
	VCBoxType,
	VCCalculationMethodArgs,
	VCCalculationMethodReturn,
	VCType,
} from './types';
import { type FilterArgs, ViewportUpdateClassifier } from './ViewportUpdateClassifier';

const legacyIgnoreReasons = [
	'image',
	'ssr-hydration',
	'editor-lazy-node-view',
	'editor-container-mutation',
];

export class FY24_01Classifier extends ViewportUpdateClassifier {
	revision = 'fy24.01';

	types = ['html', 'text'];

	filters = [
		{
			name: 'default-ignore-reasons',
			filter: ({ type, ignoreReason }: FilterArgs) => {
				return !ignoreReason || !legacyIgnoreReasons.includes(ignoreReason);
			},
		},
	];

	VCCalculationMethod({
		VCParts,
		entries,
		totalPainted,
		componentsLog,
	}: VCCalculationMethodArgs): VCCalculationMethodReturn {
		const VC: VCType = {};
		const VCBox: VCBoxType = {};

		entries.reduce((acc = 0, v) => {
			let VCRatio = v[1] / totalPainted + acc;
			const time = v[0];

			if (fg('platform_ufo_fix_vc_observer_rounding_error')) {
				// @todo apply fix to include small changes into accumulator
				const preciseCurrRatio = Math.round(100 * (v[1] / totalPainted));
				const preciseAccRatio = Math.round(acc * 100);
				VCRatio = (preciseCurrRatio + preciseAccRatio) / 100;
			}

			VCParts.forEach((value) => {
				if ((VC[value] === null || VC[value] === undefined) && VCRatio >= value / 100) {
					VC[value] = time;
					VCBox[value] = new Set();
					componentsLog[time]?.forEach((v) => VCBox[value]?.add(v.targetName));
				}
			});
			return VCRatio;
		}, 0);

		return {
			VC,
			VCBox,
		};
	}

	constructor() {
		super();
		this.mergeConfig();
	}
}

export const revFY24_01Classifier = new FY24_01Classifier();
