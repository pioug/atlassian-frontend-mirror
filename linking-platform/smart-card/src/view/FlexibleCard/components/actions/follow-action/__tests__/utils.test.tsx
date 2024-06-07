import { messages } from '../../../../../../messages';
import { getFollowActionErrorMessage } from '../utils';

describe('getFollowActionErrorMessage', () => {
	it('should return the correct message descriptor for follow action on a project', () => {
		const result = getFollowActionErrorMessage(true, true);
		expect(result).toEqual(messages.follow_project_error);
	});

	it('should return the correct message descriptor for follow action on a goal', () => {
		const result = getFollowActionErrorMessage(false, true);
		expect(result).toEqual(messages.follow_goal_error);
	});

	it('should return the correct message descriptor for unfollow action on a project', () => {
		const result = getFollowActionErrorMessage(true, false);
		expect(result).toEqual(messages.unfollow_project_error);
	});

	it('should return the correct message descriptor for unfollow action on a goal', () => {
		const result = getFollowActionErrorMessage(false, false);
		expect(result).toEqual(messages.unfollow_goal_error);
	});
});
