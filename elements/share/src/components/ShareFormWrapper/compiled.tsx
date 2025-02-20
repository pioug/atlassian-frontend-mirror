import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type IntegrationMode } from '../../types/ShareEntities';

const styles = cssMap({
	menuNotSelectedAndMenuIntegration: {
		width: '102px',
	},
	tabsIntegration: {
		width: 'auto',
	},
	default: {
		width: '352px',
	},
	inlineDialogContentWrapper: {
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.300', '24px'),
	},
});

export const InlineDialogFormWrapper = ({
	children,
	integrationMode,
	isMenuItemSelected,
}: React.PropsWithChildren<{
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
}>) => {
	if (!isMenuItemSelected && integrationMode === 'menu') {
		return <Box xcss={cx(styles.menuNotSelectedAndMenuIntegration)}>{children}</Box>;
	}

	if (fg('smart_links_for_plans_platform')) {
		if (integrationMode === 'tabs') {
			return <Box xcss={cx(styles.tabsIntegration)}>{children}</Box>;
		}
	}

	return <Box xcss={cx(styles.default)}>{children}</Box>;
};

export const InlineDialogContentWrapper = ({
	children,
	label,
}: {
	children: React.ReactNode;
	label?: string;
}) => (
	<Box aria-label={label} xcss={styles.inlineDialogContentWrapper}>
		{children}
	</Box>
);
