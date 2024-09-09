import React from 'react';

import { useIntl } from 'react-intl-next';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { externalMediaMessages } from '../media';

const baseStyles = xcss({
	borderRadius: 'border.radius',
	backgroundColor: 'elevation.surface',
	lineHeight: token('space.200'),
	cursor: 'pointer',
});

type ExternalImageBadgeProps = {
	badgeSize: 'medium' | 'small';
};

export const ExternalImageBadge = ({ badgeSize }: ExternalImageBadgeProps) => {
	const intl = useIntl();
	const message = intl.formatMessage(externalMediaMessages.externalMediaFile);

	return (
		<Box padding={badgeSize === 'medium' ? 'space.050' : 'space.0'} xcss={baseStyles} tabIndex={0}>
			<Tooltip content={message} position="top">
				<InfoIcon size="small" label={message} />
			</Tooltip>
		</Box>
	);
};
