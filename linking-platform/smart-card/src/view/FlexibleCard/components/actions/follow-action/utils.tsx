import { messages } from '../../../../../messages';
import type { MessageDescriptor } from 'react-intl-next';

export const getFollowActionErrorMessage = (
	isProject = false,
	isFollow = false,
): MessageDescriptor => {
	if (isProject && isFollow) {
		return messages.follow_project_error;
	}

	if (isProject && !isFollow) {
		return messages.unfollow_project_error;
	}

	if (!isProject && isFollow) {
		return messages.follow_goal_error;
	}

	if (!isProject && !isFollow) {
		return messages.unfollow_goal_error;
	}

	return messages.generic_error_message;
};
