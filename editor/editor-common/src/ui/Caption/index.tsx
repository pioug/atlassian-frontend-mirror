/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { Box, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';

const captionWrapperStyle = css({
	marginTop: token('space.100', '8px'),
	textAlign: 'center',
	position: 'relative',
	color: token('color.text.subtle'),
});

const placeholderStyle = xcss({
	color: 'color.text.subtlest',
	position: 'absolute',
	top: 'space.0',
	width: '100%',
});

type Props = {
	selected?: boolean;
	hasContent?: boolean;
	children?: React.ReactNode;
	dataAttributes?: {
		'data-renderer-start-pos': number;
	};
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CaptionComponent extends React.Component<Props & WrappedComponentProps> {
	render() {
		const {
			selected,
			hasContent,
			children,
			dataAttributes,
			intl: { formatMessage },
		} = this.props;

		const showPlaceholder = !selected && !hasContent;

		return (
			<div
				data-media-caption
				data-testid="media-caption"
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...dataAttributes}
				css={captionWrapperStyle}
			>
				{showPlaceholder ? (
					<Box xcss={placeholderStyle}>
						<Text>{formatMessage(messages.placeholder)}</Text>
					</Box>
				) : null}
				{children}
			</div>
		);
	}
}

export default injectIntl(CaptionComponent);
