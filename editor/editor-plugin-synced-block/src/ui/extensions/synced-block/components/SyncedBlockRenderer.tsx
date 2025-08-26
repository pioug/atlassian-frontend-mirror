import React from 'react';

import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

import type { SyncedBlockContentPropertyValue } from '../utils/synced-block';

type SyncedBlockRenderer = {
	syncedBlockContent: SyncedBlockContentPropertyValue;
};

const SyncedBlockRenderer = ({ syncedBlockContent }: SyncedBlockRenderer) => {
	return (
		<RendererActionsContext>
			<ReactRenderer
				adfStage="stage0"
				// @ts-ignore
				document={{ type: 'doc', version: 1, content: syncedBlockContent.adf.content }}
				appearance="full-page"
			/>
		</RendererActionsContext>
	);
};

export default SyncedBlockRenderer;
