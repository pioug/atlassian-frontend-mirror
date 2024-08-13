import React from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

export const MediaInsertContent = () => {
	return (
		<Tabs id="media-insert-tab-navigation">
			<Box paddingBlockEnd="space.150">
				<TabList>
					<Tab>
						<Button autoFocus appearance="subtle">
							{/* TODO: i18n */}
							Link
						</Button>
					</Tab>
				</TabList>
			</Box>
			<TabPanel>
				<p>InsertLinkPanel here</p>
			</TabPanel>
		</Tabs>
	);
};
