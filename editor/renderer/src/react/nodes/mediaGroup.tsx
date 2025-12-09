import type { ReactElement } from 'react';
import React, { PureComponent } from 'react';
import type { CardEvent } from '@atlaskit/media-card';
import { defaultImageCardDimensions } from '@atlaskit/media-card';
import type { SizeEvent, ScrollEvent } from '@atlaskit/media-filmstrip';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import type {
	EventHandlers,
	CardSurroundings,
	CardEventClickHandler,
} from '@atlaskit/editor-common/ui';
import type { Identifier } from '@atlaskit/media-client';
import type { MediaProps } from './media';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';

export interface MediaGroupProps {
	children?: React.ReactNode;
	enableDownloadButton?: boolean;
	eventHandlers?: EventHandlers;
	featureFlags?: MediaFeatureFlags;
}

interface MediaGroupState {
	animate: boolean;
	offset: number;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class MediaGroup extends PureComponent<MediaGroupProps, MediaGroupState> {
	state: MediaGroupState = {
		animate: false,
		offset: 0,
	};

	private handleSize = ({ offset }: SizeEvent) => this.setState({ offset });
	private handleScroll = ({ animate, offset }: ScrollEvent) => this.setState({ animate, offset });

	render(): React.JSX.Element {
		const numChildren = React.Children.count(this.props.children);

		let content;

		if (numChildren === 1) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const card = React.Children.toArray(this.props.children)[0] as ReactElement<any>;
			switch (card.props.type) {
				case 'file':
					content = this.renderSingleFile(card);
					break;
				case 'link':
					content = null;
					break;
				default:
					content = this.renderSingleLink(card);
			}
		} else {
			content = this.renderStrip();
		}

		return (
			<>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, react/jsx-props-no-spreading  -- Ignored via go/DSP-18766 */}
				<div className="MediaGroup" {...VcMediaWrapperProps}>
					{content}
				</div>
			</>
		);
	}

	renderSingleFile(child: ReactElement<MediaProps>) {
		return React.cloneElement(child, {
			// the media group component renders in crop mode in editor thus this enables consistency
			// also crop is much easier to make consistent across SSR and hydration
			resizeMode: fg('media-perf-uplift-mutation-fix') ? 'crop' : 'stretchy-fit',
			cardDimensions: defaultImageCardDimensions,
			useInlinePlayer: false,
			featureFlags: this.props.featureFlags,
			enableDownloadButton: this.props.enableDownloadButton,
		} as MediaProps);
	}

	renderSingleLink(child: ReactElement<MediaProps>) {
		return React.cloneElement(child, {
			appearance: 'auto',
			featureFlags: this.props.featureFlags,
		} as MediaProps);
	}

	onMediaClick =
		(
			cardClickHandler: CardEventClickHandler,
			child: ReactElement<MediaProps>,
			surroundingItems: Identifier[],
		) =>
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: CardEvent, analyticsEvent?: any) => {
			const surroundings: CardSurroundings = {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				collectionName: child.props.collection!,
				list: surroundingItems,
			};
			cardClickHandler(event, surroundings, analyticsEvent);
		};

	cloneFileCard(child: ReactElement<MediaProps>, surroundingItems: Identifier[]) {
		const cardClickHandler =
			this.props &&
			this.props.eventHandlers &&
			this.props.eventHandlers.media &&
			this.props.eventHandlers.media.onClick;
		const onClick = cardClickHandler
			? this.onMediaClick(cardClickHandler, child, surroundingItems)
			: undefined;

		return React.cloneElement(child, {
			useInlinePlayer: false,
			eventHandlers: {
				...child.props.eventHandlers,
				media: {
					onClick,
				},
			},
			featureFlags: this.props.featureFlags,
			enableDownloadButton: this.props.enableDownloadButton,
		} as MediaProps);
	}

	renderStrip(): React.JSX.Element {
		const { children } = this.props;
		const { animate, offset } = this.state;
		const childIdentifiers = React.Children.map(children, (child) => {
			if (React.isValidElement<MediaProps>(child)) {
				return this.mapMediaPropsToIdentifier(child.props);
			}
		});
		const surroundingItems = (childIdentifiers || []).filter((identifier) => !!identifier);

		return (
			<FilmstripView
				animate={animate}
				offset={offset}
				onSize={this.handleSize}
				onScroll={this.handleScroll}
			>
				{React.Children.map(children, (rawChild) => {
					const child = rawChild as React.ReactElement<MediaProps>;
					switch (child.props.type) {
						case 'file':
							return this.cloneFileCard(child, surroundingItems as Identifier[]);
						case 'link':
							return null;
						default:
							return React.cloneElement(child, {
								featureFlags: this.props.featureFlags,
								enableDownloadButton: this.props.enableDownloadButton,
							});
					}
				})}
			</FilmstripView>
		);
	}

	private mapMediaPropsToIdentifier({
		id,
		type,
		occurrenceKey,
		collection,
	}: MediaProps): Identifier | undefined {
		switch (type) {
			case 'file':
				return {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: id!,
					mediaItemType: type,
					occurrenceKey,
					collectionName: collection,
				};
			case 'link':
				return undefined;
			case 'external':
				return {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: id!,
					mediaItemType: 'file',
					occurrenceKey,
					collectionName: collection,
				};
		}
	}
}
