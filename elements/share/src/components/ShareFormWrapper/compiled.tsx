import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
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
	extendedDefault: {
		width: '452px',
	},
	inlineDialogContentWrapper: {
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.300', '24px'),
	},
	extendedInlineDialogContentWrapper: {
		paddingTop: token('space.250', '20px'),
		paddingRight: token('space.250', '20px'),
		paddingBottom: token('space.250', '20px'),
		paddingLeft: token('space.250', '20px'),
	},
});

export const InlineDialogFormWrapper = ({
	children,
	integrationMode,
	isMenuItemSelected,
	isExtendedShareDialogEnabled,
}: React.PropsWithChildren<{
	integrationMode?: IntegrationMode;
	isExtendedShareDialogEnabled?: boolean;
	isMenuItemSelected?: boolean;
}>) => {
	if (!isMenuItemSelected && integrationMode === 'menu') {
		return <Box xcss={cx(styles.menuNotSelectedAndMenuIntegration)}>{children}</Box>;
	}

	if (integrationMode === 'tabs') {
		return <Box xcss={cx(styles.tabsIntegration)}>{children}</Box>;
	}

	return (
		<Box xcss={cx(isExtendedShareDialogEnabled ? styles.extendedDefault : styles.default)}>
			{children}
		</Box>
	);
};

export const InlineDialogContentWrapper = ({
	children,
	label,
	isExtendedShareDialogEnabled,
}: {
	children: React.ReactNode;
	isExtendedShareDialogEnabled?: boolean;
	label?: string;
}) => (
	<Box
		aria-label={label}
		xcss={
			isExtendedShareDialogEnabled
				? styles.extendedInlineDialogContentWrapper
				: styles.inlineDialogContentWrapper
		}
	>
		{children}
	</Box>
);
