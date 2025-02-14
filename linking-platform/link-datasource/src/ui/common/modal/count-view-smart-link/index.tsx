import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import LinkRenderType from '../../../issue-like-table/render-type/link';

import { SmartCardPlaceholderOld, SmartLinkOld } from './count-view-smart-link-old';

const styles = cssMap({
	placeholderSmartLinkStyles: {
		borderRadius: token('border.radius.200', '3px'),
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

export const SmartCardPlaceholderNew = ({
	placeholderText,
}: {
	placeholderText: MessageDescriptor;
}) => (
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

export const SmartCardPlaceholder = (props: { placeholderText: MessageDescriptor }) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <SmartCardPlaceholderNew {...props} />;
	} else {
		return <SmartCardPlaceholderOld {...props} />;
	}
};

export const SmartLinkNew = ({ url }: { url: string }) => (
	<Box xcss={styles.smartLinkContainerStyles}>
		<LinkRenderType url={url} />
	</Box>
);

export const SmartLink = (props: { url: string }) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <SmartLinkNew {...props} />;
	} else {
		return <SmartLinkOld {...props} />;
	}
};
