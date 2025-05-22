/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type IntegrationMode } from '../../types/ShareEntities';
import { menuWrapperWidth } from '../ShareMenuItem';

/**
 * Set fixed width considering full form width and full menu width in order
 * to prevent dialog form from bouncing when isLoading prop is set to true.
 * Since loading container has 100% width, it adjusts accordingly.
 */
const calculateFormWrapperWidth = ({
	integrationMode,
	isMenuItemSelected,
	isExtendedShareDialogEnabled,
}: {
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
	isExtendedShareDialogEnabled?: boolean;
}) => {
	const formWidth = `${isExtendedShareDialogEnabled ? 452 : 8 * 44}px`;

	if (!isMenuItemSelected && integrationMode === 'menu') {
		return menuWrapperWidth;
	}

	if (fg('smart_links_for_plans_platform')) {
		if (integrationMode === 'tabs') {
			return 'auto';
		}
	}

	return formWidth;
};

export const InlineDialogFormWrapper = ({
	children,
	integrationMode,
	isMenuItemSelected,
	isExtendedShareDialogEnabled,
}: PropsWithChildren<{
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
	isExtendedShareDialogEnabled?: boolean;
}>) => {
	const styles = {
		width: calculateFormWrapperWidth({
			integrationMode,
			isMenuItemSelected,
			isExtendedShareDialogEnabled,
		}),
	};

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={styles}
		>
			{children}
		</div>
	);
};

const inlineDialogContentWrapperStyles = css({
	padding: `${token('space.200', '16px')} ${token('space.300', '24px')}`,
});

/**
 * Apply the same styling, as previous @atlaskit/inline-dialog had,
 * compared to the @atlaskit/popup we are now using.
 *
 * packages/design-system/inline-dialog/src/InlineDialog/styled.ts:20:3
 */
export const InlineDialogContentWrapper = ({
	children,
	label,
}: PropsWithChildren<{ label?: string }>) => {
	return (
		<div css={inlineDialogContentWrapperStyles} aria-label={label}>
			{children}
		</div>
	);
};
