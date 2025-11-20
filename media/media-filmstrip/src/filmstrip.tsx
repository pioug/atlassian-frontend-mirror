import React from 'react';
import { Component } from 'react';
import { Card, defaultImageCardDimensions, CardLoading } from '@atlaskit/media-card';
import { FilmstripView } from './filmstripView';
import { generateIdentifierKey } from './utils/generateIdentifierKey';
import { type FilmstripProps } from './types';
import { DeduplicatedFilmStrip } from './deduplicatedFilmstrip';

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
		const { items, mediaClientConfig, shouldOpenMediaViewer, featureFlags, viewerOptions, isLazy } =
			this.props;

		return items.map((item) => {
			const key = generateIdentifierKey(item.identifier);

			if (!mediaClientConfig) {
				return (
					<CardLoading
						key={key}
						dimensions={defaultImageCardDimensions}
						interactionName="media-filmstrip-card-loading"
					/>
				);
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
					viewerOptions={viewerOptions}
					isLazy={isLazy}
					{...item}
				/>
			);
		});
	}

	render(): React.JSX.Element {
		const { testId = 'media-filmstrip', includeHashForDuplicateFiles } = this.props;
		if (includeHashForDuplicateFiles) {
			return <DeduplicatedFilmStrip {...this.props} />;
		}

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
