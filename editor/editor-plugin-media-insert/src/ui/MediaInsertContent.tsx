import React from 'react';

import { useIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

import { type InsertExternalMediaSingle, type InsertMediaSingle } from '../types';

import { LocalMedia } from './LocalMedia';
import { MediaFromURL } from './MediaFromURL';

type Props = {
	mediaProvider: MediaProvider;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	closeMediaInsertPicker: () => void;
	insertMediaSingle: InsertMediaSingle;
	insertExternalMediaSingle: InsertExternalMediaSingle;
};

export const MediaInsertContent = ({
	mediaProvider,
	dispatchAnalyticsEvent,
	closeMediaInsertPicker,
	insertMediaSingle,
	insertExternalMediaSingle,
}: Props) => {
	const intl = useIntl();

	return (
		<Tabs id="media-insert-tab-navigation">
			<Box paddingBlockEnd="space.150">
				<TabList>
					<Tab>{intl.formatMessage(mediaInsertMessages.fileTabTitle)}</Tab>
					<Tab>{intl.formatMessage(mediaInsertMessages.linkTabTitle)}</Tab>
				</TabList>
			</Box>
			<TabPanel>
				<LocalMedia
					mediaProvider={mediaProvider}
					onInsert={insertMediaSingle}
					onClose={closeMediaInsertPicker}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				/>
			</TabPanel>
			<TabPanel>
				<MediaFromURL
					mediaProvider={mediaProvider}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					closeMediaInsertPicker={closeMediaInsertPicker}
					insertMediaSingle={insertMediaSingle}
					insertExternalMediaSingle={insertExternalMediaSingle}
				/>
			</TabPanel>
		</Tabs>
	);
};
