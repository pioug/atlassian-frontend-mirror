import React from 'react';
import { Component } from 'react';
import {
	Card,
	type CardAction,
	type CardOnClickCallback,
	type CardEvent,
	defaultImageCardDimensions,
	CardLoading,
} from '@atlaskit/media-card';
import { type Identifier } from '@atlaskit/media-client';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { FilmstripView } from './filmstripView';
import { generateIdentifierKey } from './utils/generateIdentifierKey';

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
};

export interface FilmstripState {
	animate: boolean;
	offset: number;
}

export class Filmstrip extends Component<FilmstripProps, FilmstripState> {
	state: FilmstripState = {
		animate: false,
		offset: 0,
	};

	private handleSize = ({ offset }: Pick<FilmstripState, 'offset'>) => this.setState({ offset });
	private handleScroll = ({ animate, offset }: FilmstripState) =>
		this.setState({ animate, offset });

	private renderCards() {
		const { items, mediaClientConfig, shouldOpenMediaViewer, featureFlags } = this.props;

		return items.map((item) => {
			const key = generateIdentifierKey(item.identifier);

			if (!mediaClientConfig) {
				return <CardLoading key={key} dimensions={defaultImageCardDimensions} />;
			}

			const mediaViewerItems = shouldOpenMediaViewer
				? items.map((item) => item.identifier)
				: undefined;

			return (
				<Card
					key={key}
					mediaClientConfig={mediaClientConfig}
					dimensions={defaultImageCardDimensions}
					useInlinePlayer={false}
					shouldOpenMediaViewer={shouldOpenMediaViewer}
					mediaViewerItems={mediaViewerItems}
					featureFlags={featureFlags}
					{...item}
				/>
			);
		});
	}

	render() {
		const { testId = 'media-filmstrip' } = this.props;
		const { animate, offset } = this.state;

		return (
			<FilmstripView
				animate={animate}
				offset={offset}
				onSize={this.handleSize}
				onScroll={this.handleScroll}
				testId={testId}
			>
				{this.renderCards()}
			</FilmstripView>
		);
	}
}
