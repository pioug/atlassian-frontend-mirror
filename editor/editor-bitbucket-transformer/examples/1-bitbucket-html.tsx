/* eslint-disable no-console */

import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { Editor, EditorContext, CollapsedEditor } from '@atlaskit/editor-core';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { token } from '@atlaskit/tokens';
import ToolsDrawer from './helpers/ToolsDrawer';
import { BitbucketTransformer } from '../src';
import exampleHTML from './helpers/exampleHTML';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

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
			<IntlProvider locale="en">
				<EditorContext>
					<div>
						<ToolsDrawer
							renderEditor={({ mentionProvider, emojiProvider, onChange, disabled }) => (
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<div style={{ padding: token('space.100', '8px') }}>
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
											allowRule={true}
											allowHelpDialog={true}
											disabled={disabled}
											mentionProvider={mentionProvider}
											emojiProvider={emojiProvider}
											defaultValue={exampleHTML}
											onChange={onChange}
											onSave={SAVE_ACTION}
											onCancel={CANCEL_ACTION}
											contentTransformerProvider={(schema) => new BitbucketTransformer(schema)}
											taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
										/>
									</CollapsedEditor>
								</div>
							)}
						/>
					</div>
				</EditorContext>
			</IntlProvider>
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
