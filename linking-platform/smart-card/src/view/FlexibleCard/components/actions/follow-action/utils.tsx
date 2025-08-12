import type { MessageDescriptor } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';

import { messages } from '../../../../../messages';

export const getFollowActionErrorMessage = (
	isProject = false,
	isFollow = false,
): MessageDescriptor => {
	if (isProject && isFollow) {
		return FeatureGates.getExperimentValue('project-terminology-refresh', 'isEnabled', false)
			? messages.follow_project_errorGalaxia
			: messages.follow_project_error;
	}

	if (isProject && !isFollow) {
		return FeatureGates.getExperimentValue('project-terminology-refresh', 'isEnabled', false)
			? messages.unfollow_project_errorGalaxia
			: messages.unfollow_project_error;
	}

	if (!isProject && isFollow) {
		return messages.follow_goal_error;
	}

	if (!isProject && !isFollow) {
		return messages.unfollow_goal_error;
	}

	return messages.generic_error_message;
};
