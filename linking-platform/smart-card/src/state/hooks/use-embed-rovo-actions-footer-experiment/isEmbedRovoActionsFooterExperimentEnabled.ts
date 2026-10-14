import type { ProductType } from '@atlaskit/linking-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

export const isEmbedRovoActionsFooterExperimentEnabled = (product?: ProductType): boolean => {
	return product === 'CONFLUENCE' && fg('platform_sl_3p_auth_rovo_embed_footer_kill_switch');
};
