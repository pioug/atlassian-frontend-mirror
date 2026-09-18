// eslint-disable-line no-console

import React, { type PropsWithChildren } from 'react';

import { IntlProvider } from 'react-intl';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import CrossIcon from '@atlaskit/icon/core/cross';
import AnnotateIcon from '@atlaskit/icon/core/edit';
import { type FileItem, type Identifier, type MediaClientConfig } from '@atlaskit/media-client';
import {
	createPollingMaxAttemptsError,
	createRateLimitedError,
} from '@atlaskit/media-client/test-helpers';
import {
	createStorybookMediaClientConfig,
	enableMediaUfoLogger,
	FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import { payloadPublisher } from '@atlassian/ufo/publisher';

import { type CardAction } from '../src/card/actions';
import Card from '../src/card/cardLoader';
import { MediaCardError } from '../src/MediaCardError';
import type { CardFocusEvent, CardAppearance, CardEvent } from '../src/types';
import DevelopmentUseMessage from './developmentUseMessage';
import { SelectableCard } from './selectableCard';

const mediaClientConfig = createStorybookMediaClientConfig();

export const clickHandler = (result: CardEvent): void => {
	result.event.preventDefault();
	console.log('click', result.mediaItemDetails);
};

export const mouseEnterHandler = (result: CardEvent): void => {
	result.event.preventDefault();
	console.log('mouseEnter', result.mediaItemDetails);
};

export const focusHandler = (result: CardFocusEvent): void => {
	console.log('focus', result.mediaItemDetails);
};

export const createApiCards = (
	appearance: CardAppearance,
	identifier: Identifier,
): {
	title: string;
	content: React.JSX.Element;
}[] => {
	// API methods
	const apiCards = [
		{
			title: 'not selectable',
			content: (
				<Card
					mediaClientConfig={mediaClientConfig}
					appearance={appearance}
					identifier={identifier}
					onClick={clickHandler}
					onMouseEnter={mouseEnterHandler}
					onFocus={focusHandler}
				/>
			),
		},
	];

	const selectableCard = {
		title: 'selectable',
		content: <SelectableCard mediaClientConfig={mediaClientConfig} identifier={identifier} />,
	};

	if (appearance === 'image') {
		return [...apiCards, selectableCard];
	}

	return apiCards;
};

export const openAction = {
	label: 'Open',
	handler: (): void => {
		console.log('open');
	},
};
export const closeAction = {
	label: 'Close',
	handler: (): void => {
		console.log('close');
	},
};
export const deleteAction: {
	label: string;
	handler: () => void;
	icon: React.JSX.Element;
} = {
	label: 'Delete',
	handler: () => {
		console.log('delete');
	},
	icon: <CrossIcon color="currentColor" label="delete" />,
};

export const annotateCardAction: CardAction = {
	label: 'Annotate',
	handler: () => {
		console.log('annotate');
	},
	icon: <AnnotateIcon label="annotate" />,
};

export const actions: (
	| {
			label: string;
			handler: () => void;
	  }
	| CardAction
)[] = [openAction, closeAction, deleteAction, annotateCardAction];

export const anotherAction: CardAction = {
	label: 'Some other action',
	handler: (item?: FileItem) => {
		console.log('Some other action', item);
	},
};

export const annotateAction: CardAction = {
	label: 'Annotate',
	handler: (item?: FileItem) => {
		console.log('annotate', item);
	},
};

export const cardsActions: CardAction[] = [anotherAction, annotateAction];
export const wrongMediaClientConfig: MediaClientConfig = createStorybookMediaClientConfig({
	authType: 'client',
});
export const wrongCollection = 'adfasdf';

export type MainWrapperProps = PropsWithChildren<{
	developmentOnly?: boolean;
	disableFeatureFlagWrapper?: boolean;
}>;

export const MainWrapper = ({
	children,
	developmentOnly,
	disableFeatureFlagWrapper = false,
}: MainWrapperProps): React.JSX.Element => {
	enableMediaUfoLogger(payloadPublisher);
	return (
		// `react-intl` is a peer dependency of this package — the card's loading bar localises its
		// aria-label via `useIntl`, so examples need a provider in the ancestry.
		<IntlProvider locale="en">
			{developmentOnly && <DevelopmentUseMessage />}
			{!disableFeatureFlagWrapper ? (
				<FeatureFlagsWrapper>{children}</FeatureFlagsWrapper>
			) : (
				<>{children}</>
			)}
		</IntlProvider>
	);
};

export const mediaCardErrorState = (error?: string): MediaCardError | undefined => {
	switch (error) {
		case 'rateLimitedError':
			return new MediaCardError('error-file-state', createRateLimitedError());
		case 'pollingMaxAttemptsError':
			return new MediaCardError('error-file-state', createPollingMaxAttemptsError());
		case 'uploadError':
			return new MediaCardError('upload');
		default:
			return undefined;
	}
};

export const SSRAnalyticsWrapper = ({ children }: PropsWithChildren<{}>): React.JSX.Element => {
	const mockClient: AnalyticsWebClient = {
		sendUIEvent: (e) => console.debug('UI event', e),
		sendOperationalEvent: (e) => console.debug('Operational event', e),
		sendTrackEvent: (e) => console.debug('Track event', e),
		sendScreenEvent: (e) => console.debug('Screen event', e),
	};

	return <FabricAnalyticsListeners client={mockClient}>{children}</FabricAnalyticsListeners>;
};
