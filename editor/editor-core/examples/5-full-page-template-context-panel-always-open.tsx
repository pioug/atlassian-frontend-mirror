/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { token } from '@atlaskit/tokens';

import breakoutAdf from '../example-helpers/templates/breakout.adf.json';
import decisionAdf from '../example-helpers/templates/decision.adf.json';
import type { EditorActions } from '../src';
import { ContextPanel } from '../src';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

import { ExampleEditor, LOCALSTORAGE_defaultDocKey, type EditorAPI } from './5-full-page';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmptyDoc = (adf: any) => adf.content.length === 0;

type TemplateDefinition = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf: any;
	desc: string;
	title: string;
};

const templates: Array<TemplateDefinition> = new Array(20).fill({
	title: 'Decision',
	desc: 'Use this template to effectively guide your team in making a descision.',
	adf: decisionAdf,
});

templates[1] = {
	title: 'Breakout',
	desc: `This is an example template that has breakout content so that you can
         ensure everything is working correctly when the sidebar is overlaid.`,
	adf: breakoutAdf,
};

const templateCard = css({
	border: `${token('border.width')} solid ${token('color.border')}`,
	padding: token('space.100', '8px'),
	marginBottom: token('space.100', '8px'),
	borderRadius: token('radius.medium', '6px'),
	'&:hover': {
		background: token('color.background.accent.gray.subtler'),
	},
});

type TemplatePanelState = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf: any;
	selectedTemplate: TemplateDefinition | null;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class TemplatePanel extends React.Component<
	{
		actions: EditorActions;
		defaultValue: string | undefined;
		editorAPI: PublicPluginAPI<ContextPanelPlugin> | undefined;
	},
	TemplatePanelState
> {
	state: TemplatePanelState = {
		selectedTemplate: null,
		adf: null,
	};

	onChange = async () => {
		const actions = this.props.actions;
		const adf = await actions.getValue();

		this.setState((state) => ({
			...state,

			adf,

			// reset selected template if document is cleared
			selectedTemplate: isEmptyDoc(adf) ? null : this.state.selectedTemplate,
		}));
	};

	selectTemplate(tmpl: TemplateDefinition) {
		this.setState({
			selectedTemplate: tmpl,
		});

		this.props.actions.replaceDocument(tmpl.adf, false);
	}

	render() {
		return (
			<ContextPanel visible={true} editorAPI={this.props.editorAPI}>
				<div>
					{templates.map((tmpl) => (
						<div
							css={templateCard}
							key={tmpl.title}
							role="button"
							tabIndex={0}
							onClick={() => this.selectTemplate(tmpl)}
							onKeyDown={(e: React.KeyboardEvent) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									this.selectTemplate(tmpl);
								}
							}}
						>
							<h4>{tmpl.title}</h4>
							<p>{tmpl.desc}</p>
						</div>
					))}
				</div>
			</ContextPanel>
		);
	}
}

const EditorWithSidebar = () => {
	const sidebar = React.createRef<TemplatePanel>();
	// wire this up via ref so that we don't re-render the whole
	// editor each time the content changes, only the sidebar
	const onChange = React.useCallback(async () => {
		if (sidebar.current) {
			sidebar.current.onChange();
		}
	}, [sidebar]);

	const [editorAPI, setEditorAPI] = useState<EditorAPI | undefined>();

	const defaultValue =
		(localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) || undefined;

	const editorProps = React.useMemo(() => {
		return {
			onChange,
			defaultValue,
			extensionProviders: (editorActions: EditorActions | undefined) => [
				getExampleExtensionProviders(editorAPI, editorActions),
			],
			allowExtension: {},
			contextPanel: (
				<WithEditorActions
					render={(actions) => (
						<TemplatePanel
							actions={actions}
							defaultValue={defaultValue ? JSON.parse(defaultValue) : null}
							ref={sidebar}
							editorAPI={editorAPI}
						/>
					)}
				/>
			),
		};
	}, [sidebar, defaultValue, onChange, editorAPI]);

	return <ExampleEditor editorProps={editorProps} setEditorApi={setEditorAPI} />;
};

export default function Example() {
	return (
		<EditorContext>
			<EditorWithSidebar />
		</EditorContext>
	);
}
