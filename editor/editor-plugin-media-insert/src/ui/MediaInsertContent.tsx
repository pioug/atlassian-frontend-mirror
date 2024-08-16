import React from 'react';

import { useIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

import { MediaFromURL } from './FromURL';

export const MediaInsertContent = ({
	mediaProvider,
	dispatchAnalyticsEvent,
	closeMediaInsertPicker,
}: {
	mediaProvider: MediaProvider;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	closeMediaInsertPicker: () => void;
}) => {
	const intl = useIntl();

	return (
		<Tabs id="media-insert-tab-navigation">
			<Box paddingBlockEnd="space.150">
				<TabList>
					<Tab>{intl.formatMessage(mediaInsertMessages.linkTabTitle)}</Tab>
				</TabList>
			</Box>
			<TabPanel>
				<MediaFromURL
					mediaProvider={mediaProvider}
					onExternalInsert={() => {}}
					onInsert={() => {}}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					closeMediaInsertPicker={closeMediaInsertPicker}
				/>
			</TabPanel>
		</Tabs>
	);
};
