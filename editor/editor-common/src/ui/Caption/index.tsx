/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';

const captionWrapperStyle = css({
	marginTop: token('space.100'),
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
	children?: React.ReactNode;
	dataAttributes?: {
		'data-renderer-start-pos': number;
	};
	hasContent?: boolean;
	selected?: boolean;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CaptionComponent extends React.Component<Props & WrappedComponentProps> {
	render(): jsx.JSX.Element {
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

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(CaptionComponent);
export default _default_1;
