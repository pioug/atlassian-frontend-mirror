import React from 'react';

import { Card } from '@atlaskit/media-card';

import type { mediaCardFragment_mediaItem$key } from './__generated__/mediaCardFragment_mediaItem.graphql';
import { useMediaCardFragment } from './mediaCardFragment';
import { mapGQLItemsToFileState } from './utils/mapGQLItemsToFileState';

/**
 * Props for MediaCardRelay — same as CardProps but with ssrFileState omitted (it's
 * derived from the fragment) and mediaItemRef added.
 */
export type MediaCardRelayProps = Omit<React.ComponentProps<typeof Card>, 'ssrFileState'> & {
	/**
	 * A Relay fragment ref obtained by spreading ...cardRelay_mediaItem on a MediaItem
	 * in your query. When provided, the Card will be seeded with SSR metadata.
	 */
	mediaItemRef?: mediaCardFragment_mediaItem$key | null;
};

/**
 * A Relay-aware wrapper around @atlaskit/media-card's Card component.
 *
 * Accepts a `mediaItemRef` (a Relay fragment ref from ...cardRelay_mediaItem spread
 * on a MediaItem in your query) and maps the fragment data to `ssrFileState`, which
 * is then forwarded to `Card`. Gate decisions (platform_media_ssr_data_seed) are
 * evaluated inside `Card`/`FileCard`, not here.
 *
 * IMPORTANT: Requires AGG MediaItem hydration to be enabled (Phases 1–4 of BMPT-7771).
 * The card will function without it, but SSR metadata will not be populated.
 */
export const MediaCardRelay = ({
	mediaItemRef,
	...cardProps
}: MediaCardRelayProps): JSX.Element => {
	const mediaItem = useMediaCardFragment(mediaItemRef);

	const ssrFileState = React.useMemo(() => mapGQLItemsToFileState(mediaItem), [mediaItem]);

	const ssr = cardProps.ssr ?? (!!ssrFileState ? 'server' : undefined);

	return <Card {...cardProps} ssrFileState={ssrFileState} ssr={ssr} />;
};
