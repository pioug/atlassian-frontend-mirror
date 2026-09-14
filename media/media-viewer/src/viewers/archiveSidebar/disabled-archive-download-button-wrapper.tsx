/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import type { Children } from './styleWrappers';

const disabledArchiveDownloadButtonWrapperStyles = css({
	paddingTop: `${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100')}`,

	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	backgroundColor: 'transparent',
	color: token('color.icon'),
	cursor: 'not-allowed',
});

export const DisabledArchiveDownloadButtonWrapper = ({ children }: Children): JSX.Element => {
	return (
		<div
			css={disabledArchiveDownloadButtonWrapperStyles}
			data-testid="media-disabledArchiveDownloadButton"
		>
			{children}
		</div>
	);
};
