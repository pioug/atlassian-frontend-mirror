import type { SmartLinkResponse } from '@atlaskit/linking-types';

import mockAtlasProject from './atlas-project';

const mockAtlasProjectWithAISummary = {
	...mockAtlasProject,
	meta: {
		...mockAtlasProject.meta,
		supportedFeature: ['AISummary'],
	},
} as SmartLinkResponse;

export default mockAtlasProjectWithAISummary;
