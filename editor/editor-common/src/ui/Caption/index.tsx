/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { messages } from './messages';

const captionWrapperStyle = css({
	marginTop: token('space.100', '8px'),
	textAlign: 'center',
	position: 'relative',
	color: token('color.text.subtle'),
});

const placeholderStyle = css({
	color: token('color.text.subtlest'),
	position: 'absolute',
	top: 0,
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
				{...dataAttributes}
				css={captionWrapperStyle}
			>
				{showPlaceholder ? (
					<p css={placeholderStyle}>{formatMessage(messages.placeholder)}</p>
				) : null}
				{children}
			</div>
		);
	}
}

export default injectIntl(CaptionComponent);
