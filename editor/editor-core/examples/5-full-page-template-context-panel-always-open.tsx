/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type ExtractPresetAPI } from '@atlaskit/editor-common/preset';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { type createUniversalPresetInternal } from '@atlaskit/editor-core/preset-universal';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { token } from '@atlaskit/tokens';

import breakoutAdf from '../example-helpers/templates/breakout.adf.json';
import decisionAdf from '../example-helpers/templates/decision.adf.json';
import type { EditorActions } from '../src';
import { ContextPanel } from '../src';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

import { ExampleEditor, LOCALSTORAGE_defaultDocKey } from './5-full-page';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmptyDoc = (adf: any) => adf.content.length === 0;

type TemplateDefinition = {
	title: string;
	desc: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf: any;
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
	border: `1px solid ${token('color.border')}`,
	padding: token('space.100', '8px'),
	marginBottom: token('space.100', '8px'),
	borderRadius: '5px',
	'&:hover': {
		background: token('color.background.accent.gray.subtler'),
	},
});

// when loading a document on a small viewport, the tables plugin resizes
// the column widths. this causes the editor's ADF to diverge from the
// ADF of the template.
//
// normalises column widths between documents by clearing them.
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clearTableWidths = (adf: any) => {
	if (!adf.content) {
		// leaf node
		return adf;
	}

	// recursively fix children
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf.content = adf.content.map((child: any) => {
		if (child.type === 'tableCell' || child.type === 'tableHeader') {
			child.attrs.colwidth = [];
		}

		if (child.content) {
			return clearTableWidths(child);
		} else {
			return child;
		}
	});

	return adf;
};

type TemplatePanelState = {
	selectedTemplate: TemplateDefinition | null;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf: any;
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
					{templates.map((tmpl, idx) => (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, react/no-array-index-key, @atlassian/a11y/interactive-element-not-keyboard-focusable
						<div css={templateCard} key={idx} onClick={() => this.selectTemplate(tmpl)}>
							<h4>{tmpl.title}</h4>
							<p>{tmpl.desc}</p>
						</div>
					))}
				</div>
			</ContextPanel>
		);
	}
}

type EditorAPI = ExtractPresetAPI<ReturnType<typeof createUniversalPresetInternal>> | undefined;

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
