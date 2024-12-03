import React from 'react';

import { useIntl } from 'react-intl-next';

import { type MediaType } from '@atlaskit/adf-schema';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { fg } from '@atlaskit/platform-feature-flags';
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

// On cleanup of 'platform_editor_hide_external_media_badge', make types non-optional
type ExternalImageBadgeProps = {
	badgeSize: 'medium' | 'small';
	type?: MediaType;
	url?: string | undefined;
};

const NO_EXTERNAL_BADGE_HOSTS = ['atlassian.com'];

export const isUnbadgedUrl = (url: string | undefined) => {
	let hostname: string;
	try {
		({ hostname } = new URL(url || ''));
	} catch (e) {
		// If the URL is invalid (or empty), just carry on showing the badge
		return false;
	}

	return Boolean(
		hostname &&
			// Do not show badge for atlassian domains and subdomains
			NO_EXTERNAL_BADGE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
	);
};

export const ExternalImageBadge = ({ badgeSize, type, url }: ExternalImageBadgeProps) => {
	const intl = useIntl();
	const message = intl.formatMessage(externalMediaMessages.externalMediaFile);

	if (fg('platform_editor_hide_external_media_badge')) {
		if (type !== 'external' || isUnbadgedUrl(url)) {
			return null;
		}
	}

	return (
		<Box padding={badgeSize === 'medium' ? 'space.050' : 'space.0'} xcss={baseStyles} tabIndex={0}>
			<Tooltip content={message} position="top">
				<InfoIcon size="small" label={message} />
			</Tooltip>
		</Box>
	);
};
