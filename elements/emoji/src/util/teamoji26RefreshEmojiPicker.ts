import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';

export const teamoji26RefreshEmojiPickerExperimentName = 'platform_teamoji_26_refresh_emoji_picker';
export const teamoji26RefreshEmojiPickerUserIdGateName =
	'platform_teamoji_26_refresh_emoji_picker_user_id';

export const isTeamoji26RefreshEmojiPickerEnabled = (): boolean => {
	return (
		isExperimentEnabled(teamoji26RefreshEmojiPickerExperimentName) ||
		fg(teamoji26RefreshEmojiPickerUserIdGateName)
	);
};

export const isTeamoji26RefreshEmojiPickerEnabledNoExposure = (): boolean => {
	return (
		UNSAFE_expValNoExposure(teamoji26RefreshEmojiPickerExperimentName, 'isEnabled', false) ===
			true || fg(teamoji26RefreshEmojiPickerUserIdGateName)
	);
};
