import { getConfig } from '../../../config';

import { revFY25_01Classifier } from './fy25_01';
import { revFY25_02Classifier } from './fy25_02';
import { type RevisionEntry } from './types';

export function getRevisions(): RevisionEntry[] {
	if (!getConfig()?.vc?.enabledVCRevisions?.includes('fy25.01')) {
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
}
