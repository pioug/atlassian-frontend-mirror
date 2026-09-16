import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	isTeamoji26RefreshEmojiPickerEnabled,
	isTeamoji26RefreshEmojiPickerEnabledNoExposure,
	teamoji26RefreshEmojiPickerExperimentName,
	teamoji26RefreshEmojiPickerShortNameAndOrderingGateName,
	teamoji26RefreshEmojiPickerUserIdGateName,
} from '../../../util/teamoji26RefreshEmojiPicker';

describe('teamoji26RefreshEmojiPicker', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns true when the refresh experiment is enabled', () => {
		mockExpEnabled(teamoji26RefreshEmojiPickerExperimentName);

		expect(isTeamoji26RefreshEmojiPickerEnabled()).toBe(true);
	});

	it('returns true when the user id gate is enabled', () => {
		mockExpDisabled(teamoji26RefreshEmojiPickerExperimentName);
		passGate(teamoji26RefreshEmojiPickerUserIdGateName);

		expect(isTeamoji26RefreshEmojiPickerEnabled()).toBe(true);
	});

	it('returns true when the shortname and ordering gate is enabled', () => {
		mockExpDisabled(teamoji26RefreshEmojiPickerExperimentName);
		failGate(teamoji26RefreshEmojiPickerUserIdGateName);
		passGate(teamoji26RefreshEmojiPickerShortNameAndOrderingGateName);

		expect(isTeamoji26RefreshEmojiPickerEnabled()).toBe(true);
	});

	it('returns true in no-exposure checks when the refresh experiment is enabled', () => {
		mockExpEnabled(teamoji26RefreshEmojiPickerExperimentName);

		expect(isTeamoji26RefreshEmojiPickerEnabledNoExposure()).toBe(true);
	});

	it('returns true in no-exposure checks when the user id gate is enabled', () => {
		mockExpDisabled(teamoji26RefreshEmojiPickerExperimentName);
		passGate(teamoji26RefreshEmojiPickerUserIdGateName);

		expect(isTeamoji26RefreshEmojiPickerEnabledNoExposure()).toBe(true);
	});

	it('returns true in no-exposure checks when the shortname and ordering gate is enabled', () => {
		mockExpDisabled(teamoji26RefreshEmojiPickerExperimentName);
		failGate(teamoji26RefreshEmojiPickerUserIdGateName);
		passGate(teamoji26RefreshEmojiPickerShortNameAndOrderingGateName);

		expect(isTeamoji26RefreshEmojiPickerEnabledNoExposure()).toBe(true);
	});

	it('returns false when the refresh experiment and user id gate are disabled', () => {
		mockExpDisabled(teamoji26RefreshEmojiPickerExperimentName);
		failGate(teamoji26RefreshEmojiPickerUserIdGateName);
		failGate(teamoji26RefreshEmojiPickerShortNameAndOrderingGateName);

		expect(isTeamoji26RefreshEmojiPickerEnabled()).toBe(false);
	});
});
