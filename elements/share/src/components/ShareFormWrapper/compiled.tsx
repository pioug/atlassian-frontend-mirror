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
		paddingTop: token('space.200'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.300'),
	},
	extendedInlineDialogContentWrapper: {
		paddingTop: token('space.250'),
		paddingRight: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.250'),
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
}>): React.JSX.Element => {
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
}): React.JSX.Element => (
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
