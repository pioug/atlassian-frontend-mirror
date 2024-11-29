import { type CardAction, type CardOnClickCallback, type CardEvent } from '@atlaskit/media-card';
import { type Identifier } from '@atlaskit/media-client';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { type ViewerOptionsProps } from '@atlaskit/media-viewer';

export interface FilmstripItem {
	readonly identifier: Identifier;
	readonly actions?: Array<CardAction>;
	readonly selectable?: boolean;
	readonly selected?: boolean;
	readonly onClick?: CardOnClickCallback;
	readonly onMouseEnter?: (result: CardEvent) => void;
	readonly shouldEnableDownloadButton?: boolean;
}

export type FilmstripProps = {
	items: FilmstripItem[];
	shouldOpenMediaViewer?: boolean;
	mediaClientConfig?: MediaClientConfig;
	testId?: string;
	featureFlags?: MediaFeatureFlags;
	viewerOptions?: ViewerOptionsProps;
	includeHashForDuplicateFiles?: boolean;
	isLazy?: boolean;
};
