/* eslint-disable no-console */

import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { Editor, EditorContext, CollapsedEditor } from '@atlaskit/editor-core';
import type { RenderEditorProps } from '../example-helpers/ToolsDrawer';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { token } from '@atlaskit/tokens';
import {
	localStorageFetchProvider,
	localStorageWriteProvider,
} from '@af/editor-examples-helpers/utils';
import type { SyncedBlockPluginOptions } from '@atlaskit/editor-plugin-synced-block';
import { useMemoizedSyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';
import { getSyncedBlockRenderer } from '@atlaskit/editor-synced-block-renderer';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const mediaProvider = storyMediaProviderFactory({
	includeUploadMediaClientConfig: true,
	collectionName: 'test',
});

export type Props = {};

export type State = {
	hasJquery?: boolean;
	isExpanded?: boolean;
};

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ATL_JQ_PAGE_PROPS: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		jQuery: any;
	}
}

export default function EditorWithFeedback(props: Props): React.JSX.Element {
	const [{ hasJquery, isExpanded }, setState] = useState<State>({
		hasJquery: false,
		isExpanded: false,
	});

	const syncBlockProvider = useMemoizedSyncedBlockProvider({
		fetchProvider: localStorageFetchProvider,
		writeProvider: localStorageWriteProvider,
		providerOptions: {},
	});

	const syncedBlock: SyncedBlockPluginOptions = {
		enableSourceCreation: true,
		syncedBlockRenderer: getSyncedBlockRenderer({
			syncBlockRendererOptions: undefined,
		}),
		syncBlockDataProvider: syncBlockProvider,
	};

	const loadJquery = () => {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'text/javascript';
		scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

		scriptElem.onload = () => {
			setState((prevState) => ({
				...prevState,
				hasJquery: true,
			}));
		};

		document.body.appendChild(scriptElem);
	};

	const handleFocus = () =>
		setState((prevState) => ({
			...prevState,
			isExpanded: !prevState.isExpanded,
		}));

	useEffect(() => {
		delete window.jQuery;

		loadJquery();
	}, []);

	if (!hasJquery) {
		return <h3>Please wait, loading jQuery ...</h3>;
	}

	return (
		<EditorContext>
			<div>
				<ToolsDrawer
					renderEditor={({ onChange, disabled }: RenderEditorProps) => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						<div style={{ padding: token('space.250', '20px') }}>
							<IntlProvider locale="en">
								<CollapsedEditor
									placeholder="What do you want to say?"
									isExpanded={isExpanded}
									onFocus={handleFocus}
									onExpand={EXPAND_ACTION}
								>
									<Editor
										appearance="comment"
										placeholder="What do you want to say?"
										shouldFocus={true}
										allowTextColor={true}
										allowRule={true}
										allowTables={{
											allowColumnResizing: true,
											allowMergeCells: true,
											allowNumberColumn: true,
											allowBackgroundColor: true,
											allowHeaderRow: true,
											allowHeaderColumn: true,
											permittedLayouts: 'all',
										}}
										allowDate={true}
										media={{
											provider: mediaProvider,
											allowMediaSingle: true,
											allowLinking: true,
											allowCaptions: true,
											featureFlags: {
												mediaInline: true,
											},
										}}
										syncBlock={syncedBlock}
										disabled={disabled}
										mentionProvider={Promise.resolve(mentionResourceProvider)}
										taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
										onChange={onChange}
										onSave={SAVE_ACTION}
										onCancel={CANCEL_ACTION}
									/>
								</CollapsedEditor>
							</IntlProvider>
						</div>
					)}
				/>
			</div>
		</EditorContext>
	);
}
