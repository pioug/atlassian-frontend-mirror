/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { B400, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import LinkRenderType from '../../../issue-like-table/render-type/link';

const placeholderSmartLinkStyles = css({
	backgroundColor: token('elevation.surface.raised', N0),
	borderRadius: token('border.radius.200', '3px'),
	boxShadow: '0px 1px 1px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
	color: token('color.text.brand', B400),
	padding: `${token('space.0', '0px')} ${token('space.025', '2px')}`,
});

const smartLinkContainerStyles = css({
	paddingLeft: token('space.025', '2px'),
});

export const SmartCardPlaceholder = ({
	placeholderText,
}: {
	placeholderText: MessageDescriptor;
}) => (
	<div css={smartLinkContainerStyles}>
		<span data-testid={`datasource-modal--smart-card-placeholder`} css={placeholderSmartLinkStyles}>
			<FormattedMessage {...placeholderText} />
		</span>
	</div>
);

export const SmartLink = ({ url }: { url: string }) => (
	<div css={smartLinkContainerStyles}>
		<LinkRenderType url={url} />
	</div>
);
