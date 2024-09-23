import React from 'react';

import { useIntl } from 'react-intl-next';

import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { Card, CardLoading } from '@atlaskit/media-card';
import type { Identifier } from '@atlaskit/media-client';

import { type OnInsertAttrs } from './types';
const maxDimensions = {
	width: '100%',
	height: '100%',
};

type Props = {
	attrs: Required<OnInsertAttrs>;
	mediaProvider: MediaProvider;
};

export const MediaCard = ({ attrs, mediaProvider }: Props) => {
	const intl = useIntl();
	const mediaAlt = intl.formatMessage(mediaInsertMessages.mediaAlt);

	const dimensions = React.useMemo(() => {
		return {
			width: attrs.width,
			height: attrs.height,
		};
	}, [attrs.width, attrs.height]);

	const identifier: Identifier = React.useMemo(
		() => ({
			id: attrs.id,
			mediaItemType: 'file',
			collectionName: attrs.collection,
		}),
		[attrs.collection, attrs.id],
	);

	if (!mediaProvider) {
		return <CardLoading dimensions={dimensions} />;
	}

	return (
		<Card
			mediaClientConfig={mediaProvider.viewMediaClientConfig}
			resizeMode="stretchy-fit"
			dimensions={maxDimensions}
			originalDimensions={dimensions}
			identifier={identifier}
			alt={mediaAlt}
			disableOverlay
		/>
	);
};
