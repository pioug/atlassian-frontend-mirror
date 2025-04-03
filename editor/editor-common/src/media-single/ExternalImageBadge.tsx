import React from 'react';

import { useIntl } from 'react-intl-next';

import { type MediaType } from '@atlaskit/adf-schema';
import InfoIcon from '@atlaskit/icon/core/migration/information--info';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { externalMediaMessages } from '../media';

const baseStyles = xcss({
	borderRadius: 'border.radius',
	backgroundColor: 'elevation.surface',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.200'),
	cursor: 'pointer',
});

type ExternalImageBadgeProps = {
	type: MediaType;
	url: string | undefined;
};

const NO_EXTERNAL_BADGE_HOSTS = ['atlassian.com'];

export const isUnbadgedUrl = (url: string | undefined) => {
	if (!url) {
		return false;
	}
	// Check if URL is valid
	try {
		new URL(url);
	} catch {
		return false;
	}

	const parsedUrl = new URL(url || '');
	const { hostname, pathname, protocol } = parsedUrl;

	if (protocol === 'data:') {
		return pathname?.startsWith('image/');
	}

	return Boolean(
		hostname &&
			NO_EXTERNAL_BADGE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
	);
};

export const ExternalImageBadge = ({ type, url }: ExternalImageBadgeProps) => {
	const intl = useIntl();
	const message = intl.formatMessage(externalMediaMessages.externalMediaFile);

	if (type !== 'external' || isUnbadgedUrl(url)) {
		return null;
	}

	return (
		<Box padding="space.050" xcss={baseStyles} tabIndex={0}>
			<div data-testid="external-image-badge" />
			<Tooltip content={message} position="top">
				<InfoIcon LEGACY_size="small" label={message} />
			</Tooltip>
		</Box>
	);
};
