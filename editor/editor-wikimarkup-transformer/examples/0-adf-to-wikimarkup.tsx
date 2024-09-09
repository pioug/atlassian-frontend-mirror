/* eslint-disable no-console */

import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { Editor, EditorContext, CollapsedEditor } from '@atlaskit/editor-core';
import type { RenderEditorProps } from '../example-helpers/ToolsDrawer';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { token } from '@atlaskit/tokens';

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
		jQuery: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ATL_JQ_PAGE_PROPS: any;
	}
}

export default class EditorWithFeedback extends React.Component<Props, State> {
	state = {
		hasJquery: false,
		isExpanded: false,
	};

	componentDidMount() {
		delete window.jQuery;
		this.loadJquery();
	}

	onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	render() {
		if (!this.state.hasJquery) {
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
										isExpanded={this.state.isExpanded}
										onFocus={this.onFocus}
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

	private loadJquery = () => {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'text/javascript';
		scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

		scriptElem.onload = () => {
			this.setState({
				...this.state,
				hasJquery: true,
			});
		};

		document.body.appendChild(scriptElem);
	};
}
