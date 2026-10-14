import { fg } from '@atlaskit/platform-feature-flags/fg';

export default {
	get(): boolean {
		return fg('migrate-agent-avatar-component-to-ads');
	},
};
