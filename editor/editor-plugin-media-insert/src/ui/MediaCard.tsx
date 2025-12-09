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

export const MediaCard = ({ attrs, mediaProvider }: Props): React.JSX.Element => {
	const intl = useIntl();
	const mediaAlt = intl.formatMessage(mediaInsertMessages.mediaAlt);

	const dimensions = React.useMemo(() => {
		return {
			width: attrs.dimensions.width,
			height: attrs.dimensions.height,
		};
	}, [attrs.dimensions.width, attrs.dimensions.height]);

	const identifier: Identifier = React.useMemo(
		() => ({
			id: attrs.id,
			mediaItemType: 'file',
			collectionName: attrs.collection,
		}),
		[attrs.collection, attrs.id],
	);

	if (!mediaProvider) {
		return (
			<CardLoading dimensions={dimensions} interactionName="editor-media-insert-card-loading" />
		);
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
