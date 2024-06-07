/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { contentStyles, wrapperStyles } from '@af/editor-examples-helpers/example-presets';
import { DevTools } from '@af/editor-examples-helpers/utils';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import type { EditorActions } from '../src';
import { Editor } from '../src';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

// eslint-disable-next-line no-console
const SAVE_ACTION = () => console.log('Save');

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => {
	const exampleDocument = useExampleDocument();

	return (
		<ButtonGroup>
			<Button onClick={() => props.editorActions.replaceDocument(exampleDocument, false)}>
				Load Example
			</Button>
			<Button
				appearance="primary"
				onClick={() =>
					props.editorActions
						.getValue()
						// eslint-disable-next-line no-console
						.then((value) => console.log(value))
				}
			>
				Publish
			</Button>
			<Button appearance="subtle" onClick={() => props.editorActions.clear()}>
				Close
			</Button>
		</ButtonGroup>
	);
};

export type Props = {
	defaultValue?: Object;
};

const quickInsertProvider = quickInsertProviderFactory();
const quickInsert = {
	provider: Promise.resolve(quickInsertProvider),
};
export class ExampleEditor extends React.Component<Props> {
	render() {
		return (
			<IntlProvider locale="en">
				<div css={wrapperStyles}>
					<div css={contentStyles}>
						<ToolsDrawer
							renderEditor={({
								mentionProvider,
								emojiProvider,
								mediaProvider,
								activityProvider,
								taskDecisionProvider,
								contextIdentifierProvider,
								onChange,
								disabled,
								enabledFeatures,
							}: any) => (
								<Editor
									defaultValue={this.props.defaultValue}
									appearance="full-page"
									allowAnalyticsGASV3={true}
									quickInsert={quickInsert}
									allowBreakout={true}
									allowTextColor={true}
									allowTextAlignment={true}
									allowIndentation={true}
									allowTables={{
										allowColumnSorting: true,
										allowColumnResizing: true,
										allowMergeCells: true,
										allowNumberColumn: true,
										allowBackgroundColor: true,
										allowHeaderRow: true,
										allowHeaderColumn: true,
										permittedLayouts: 'all',
									}}
									allowPanel={true}
									allowStatus={true}
									allowExtension={{
										allowBreakout: true,
									}}
									allowRule={true}
									allowDate={true}
									allowLayouts={true}
									allowTemplatePlaceholders={{ allowInserting: true }}
									smartLinks={{
										provider: Promise.resolve(cardProvider),
									}}
									activityProvider={activityProvider}
									mentionProvider={mentionProvider}
									emojiProvider={emojiProvider}
									taskDecisionProvider={taskDecisionProvider}
									contextIdentifierProvider={contextIdentifierProvider}
									macroProvider={Promise.resolve(macroProvider)}
									media={{
										provider: mediaProvider,
										allowMediaSingle: true,
										allowResizing: enabledFeatures.imageResizing,
									}}
									placeholder="Write something..."
									shouldFocus={false}
									onChange={onChange}
									disabled={disabled}
									primaryToolbarComponents={
										<WithEditorActions
											render={(actions) => <SaveAndCancelButtons editorActions={actions} />}
										/>
									}
									onSave={SAVE_ACTION}
									insertMenuItems={customInsertMenuItems}
									extensionHandlers={extensionHandlers}
								/>
							)}
						/>
					</div>
				</div>
			</IntlProvider>
		);
	}
}

export default function Example(defaultValue: string | object) {
	return (
		<EditorContext>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ height: '100%' }}>
				<WithEditorActions
					render={(actions) => <DevTools editorView={actions._privateGetEditorView()} />}
				/>
				<ExampleEditor defaultValue={defaultValue} />
			</div>
		</EditorContext>
	);
}
