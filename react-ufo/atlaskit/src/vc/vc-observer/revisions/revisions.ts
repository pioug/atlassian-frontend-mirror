import { fg } from '@atlaskit/platform-feature-flags';

import { withProfiling } from '../../../self-measurements';

import { revFY25_01Classifier } from './fy25_01';
import { revFY25_02Classifier } from './fy25_02';
import { type RevisionEntry } from './types';

export const getRevisions = withProfiling(
	function getRevisions(): RevisionEntry[] {
		if (fg('platform_ufo_disable_ttvc_v1')) {
			return [
				{
					name: 'fy25.02',
					classifier: revFY25_02Classifier,
				},
			];
		}

		return [
			{
				name: 'fy25.01',
				classifier: revFY25_01Classifier,
			},
			{
				name: 'fy25.02',
				classifier: revFY25_02Classifier,
			},
		];
	},
	['vc'],
);
