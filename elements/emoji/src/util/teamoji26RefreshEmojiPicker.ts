import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';

export const teamoji26RefreshEmojiPickerExperimentName = 'platform_teamoji_26_refresh_emoji_picker';
export const teamoji26RefreshEmojiPickerCanvasExperimentName =
	'platform_teamoji_26_refresh_emoji_picker_canvas';
export const teamoji26RefreshEmojiPickerUserIdGateName =
	'platform_teamoji_26_refresh_emoji_picker_user_id';
export const teamoji26RefreshEmojiPickerShortNameAndOrderingGateName =
	'platform_bitbucket_fix_shortname_and_ordering';

export const isTeamoji26RefreshEmojiPickerEnabled = (): boolean => {
	return (
		isExperimentEnabled(teamoji26RefreshEmojiPickerExperimentName) ||
		isExperimentEnabled(teamoji26RefreshEmojiPickerCanvasExperimentName) ||
		fg(teamoji26RefreshEmojiPickerUserIdGateName) ||
		fg(teamoji26RefreshEmojiPickerShortNameAndOrderingGateName)
	);
};

export const isTeamoji26RefreshEmojiPickerEnabledNoExposure = (): boolean => {
	return (
		UNSAFE_expValNoExposure(teamoji26RefreshEmojiPickerExperimentName, 'isEnabled', false) ===
			true ||
		UNSAFE_expValNoExposure(teamoji26RefreshEmojiPickerCanvasExperimentName, 'isEnabled', false) ===
			true ||
		fg(teamoji26RefreshEmojiPickerUserIdGateName) ||
		fg(teamoji26RefreshEmojiPickerShortNameAndOrderingGateName)
	);
};
