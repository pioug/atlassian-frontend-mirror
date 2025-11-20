import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import LinkRenderType from '../../../issue-like-table/render-type/link';

const styles = cssMap({
	placeholderSmartLinkStyles: {
		borderRadius: token('radius.large', '3px'),
		color: token('color.text.brand'),
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.025'),
		paddingRight: token('space.025'),
		boxShadow: token('elevation.shadow.raised'),
	},
	smartLinkContainerStyles: {
		paddingLeft: token('space.025'),
	},
});

export const SmartCardPlaceholder = ({
	placeholderText,
}: {
	placeholderText: MessageDescriptor;
}): React.JSX.Element => (
	<Box xcss={styles.smartLinkContainerStyles}>
		<Box
			as="span"
			testId="datasource-modal--smart-card-placeholder"
			xcss={styles.placeholderSmartLinkStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ backgroundColor: token('elevation.surface.raised') }}
		>
			<FormattedMessage {...placeholderText} />
		</Box>
	</Box>
);

export const SmartLink = ({ url }: { url: string }): React.JSX.Element => (
	<Box xcss={styles.smartLinkContainerStyles}>
		<LinkRenderType url={url} />
	</Box>
);
