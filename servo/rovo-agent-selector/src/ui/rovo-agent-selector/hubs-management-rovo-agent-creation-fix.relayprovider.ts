import { fg } from '@atlaskit/platform-feature-flags/fg';

export default {
	get(): boolean {
		return fg('hubs_management_rovo_agent_creation_fix');
	},
};
