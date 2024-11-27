/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import LinkRenderType from '../../../issue-like-table/render-type/link';

const placeholderSmartLinkStyles = xcss({
	backgroundColor: 'elevation.surface.raised',
	borderRadius: token('border.radius.200', '3px'),
	color: 'color.text.brand',
	paddingTop: 'space.0',
	paddingBottom: 'space.0',
	paddingLeft: 'space.025',
	paddingRight: 'space.025',
	boxShadow: 'elevation.shadow.raised',
});

const smartLinkContainerStyles = xcss({
	paddingLeft: 'space.025',
});

export const SmartCardPlaceholder = ({
	placeholderText,
}: {
	placeholderText: MessageDescriptor;
}) => (
	<Box xcss={smartLinkContainerStyles}>
		<Box
			as="span"
			testId="datasource-modal--smart-card-placeholder"
			xcss={placeholderSmartLinkStyles}
		>
			<FormattedMessage {...placeholderText} />
		</Box>
	</Box>
);

export const SmartLink = ({ url }: { url: string }) => (
	<Box xcss={smartLinkContainerStyles}>
		<LinkRenderType url={url} />
	</Box>
);
