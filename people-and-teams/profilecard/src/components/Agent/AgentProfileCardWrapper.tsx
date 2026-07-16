import React from 'react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		width: '360px',
		borderRadius: token('radius.large'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	wrapperLegacy: {
		width: '360px',
		borderRadius: token('radius.large'),
		backgroundColor: token('elevation.surface.overlay'),
	},
});

export const AgentProfileCardWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	if (
		expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
		fg('platform_editor_agent_mentions_drop_one_fixes')
	) {
		return <Box xcss={styles.wrapper}>{children}</Box>;
	}
	return <Box xcss={styles.wrapperLegacy}>{children}</Box>;
};
