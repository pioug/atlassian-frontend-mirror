import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export const isNewBlockcardUnauthorizedRefreshExperimentEnabled = (fireExperimentExposure: boolean = false) => {
	if (fireExperimentExposure) {
		return expValEquals('platform_sl_3p_unauth_paste_as_block_card', 'cohort', 'card_by_default_and_new_design', 'control');
	} else {
		return expValEqualsNoExposure('platform_sl_3p_unauth_paste_as_block_card', 'cohort', 'card_by_default_and_new_design', 'control');
	}
}