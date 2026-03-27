/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
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
	isExtendedShareDialogEnabled,
}: {
	integrationMode?: IntegrationMode;
	isExtendedShareDialogEnabled?: boolean;
	isMenuItemSelected?: boolean;
}) => {
	const formWidth = `${isExtendedShareDialogEnabled ? 452 : 8 * 44}px`;

	if (!isMenuItemSelected && integrationMode === 'menu') {
		return menuWrapperWidth;
	}

	if (integrationMode === 'tabs') {
		return 'auto';
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
	isExtendedShareDialogEnabled?: boolean;
	isMenuItemSelected?: boolean;
}>): jsx.JSX.Element => {
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
	padding: `${token('space.200')} ${token('space.300')}`,
});

const extendedInlineDialogContentWrapperStyles = css({
	padding: token('space.250'),
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
	isExtendedShareDialogEnabled,
}: PropsWithChildren<{
	isExtendedShareDialogEnabled?: boolean;
	label?: string;
}>): jsx.JSX.Element => {
	return (
		<div
			css={
				isExtendedShareDialogEnabled
					? extendedInlineDialogContentWrapperStyles
					: inlineDialogContentWrapperStyles
			}
			aria-label={label}
		>
			{children}
		</div>
	);
};
