/** @jsx jsx */

import { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

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
}: {
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
}) => {
	const formWidth = `${8 * 44}px`;

	if (!isMenuItemSelected && integrationMode === 'menu') {
		return menuWrapperWidth;
	}

	return formWidth;
};

export const InlineDialogFormWrapper = ({
	children,
	integrationMode,
	isMenuItemSelected,
}: PropsWithChildren<{
	integrationMode?: IntegrationMode;
	isMenuItemSelected?: boolean;
}>) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={{
				width: calculateFormWrapperWidth({
					integrationMode,
					isMenuItemSelected,
				}),
			}}
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
