import { revFY25_01Classifier } from './fy25_01';
import { revFY25_02Classifier } from './fy25_02';
import { type RevisionEntry } from './types';

const Revisions: RevisionEntry[] = [
	{
		name: 'fy25.01',
		classifier: revFY25_01Classifier,
	},
	{
		name: 'fy25.02',
		classifier: revFY25_02Classifier,
	},
];

let revisionResultCache: null | RevisionEntry[] = null;

export const getRevisions = (): RevisionEntry[] => {
	if (revisionResultCache !== null) {
		return revisionResultCache;
	}

	revisionResultCache = [
		...Revisions,
		//...(fg('next_available') ? [{name: 'next', classifier:NEXT}] : [])
	];

	return revisionResultCache;
};
