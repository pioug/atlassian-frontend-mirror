import type { ProductType } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY } from './index';

export const isEmbedRovoActionsFooterExperimentEnabled = (product?: ProductType): boolean => {
	return (
		product === 'CONFLUENCE' &&
		fg('platform_sl_3p_auth_rovo_embed_footer_kill_switch') &&
		expValEquals(EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY, 'isEnabled', true)
	);
};
