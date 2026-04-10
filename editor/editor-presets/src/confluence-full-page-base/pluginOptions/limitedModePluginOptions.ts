import type React from 'react';

import type { LimitedModePluginOptions } from '@atlaskit/editor-plugin-limited-mode';

interface Props {
	options: {
		contentId?: string;
		killSwitchEnabled?: boolean;
		showFlag?: (props: { close: string; description: React.ReactNode; title: string }) => void;
	};
}

export function limitedModePluginOptions({ options }: Props): LimitedModePluginOptions {
	return {
		showFlag: options.showFlag,
		contentId: options.contentId,
		killSwitchEnabled: options.killSwitchEnabled,
	};
}
