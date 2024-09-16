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

const isEmptyDoc = (adf: any) => (adf ? adf.content.length === 0 : true);

let queuedIdleTask: number;

const idle = () => {
	if (queuedIdleTask) {
		((window as any).cancelIdleCallback || window.cancelAnimationFrame)(queuedIdleTask);
	}

	return new Promise((resolve) => {
		((window as any).requestIdleCallback || window.requestAnimationFrame)(resolve);
	});
};

type TemplateDefinition = {
	title: string;
	desc: string;
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
const clearTableWidths = (adf: any) => {
	if (!adf) {
		return adf;
	}

	if (!adf.content) {
		// leaf node
		return adf;
	}

	// recursively fix children
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

const equalDocument = (a: any, b: any): boolean =>
	JSON.stringify(clearTableWidths(a)) === JSON.stringify(clearTableWidths(b));

type TemplatePanelState = {
	adf: any;
	selectedTemplate: TemplateDefinition | null;
	panelVisible: boolean;
};

type TemplatePanelProps = {
	actions: EditorActions;
	defaultValue: string | undefined;
	editorAPI: PublicPluginAPI<ContextPanelPlugin> | undefined;
};

class TemplatePanel extends React.Component<TemplatePanelProps, TemplatePanelState> {
	state: TemplatePanelState = {
		adf: null,
		selectedTemplate: null,
		panelVisible: false,
	};

	static derivePanelVisibility(adf: any, state: TemplatePanelState): boolean {
		if (!adf) {
			return true;
		}

		const selectedTemplate = isEmptyDoc(adf) ? null : state.selectedTemplate;
		return isEmptyDoc(adf) || equalDocument(adf, selectedTemplate);
	}

	static getDerivedStateFromProps(
		props: TemplatePanelProps,
		state: TemplatePanelState,
	): TemplatePanelState | null {
		if (state.adf || (state.adf && state.adf === props.defaultValue)) {
			return null;
		}

		return {
			...state,
			adf: props.defaultValue,
			panelVisible: TemplatePanel.derivePanelVisibility(props.defaultValue, state),
		};
	}

	onChange = async () => {
		await idle();
		const actions = this.props.actions;
		const adf = (await actions.getValue()) || this.props.defaultValue;
		const panelVisible = TemplatePanel.derivePanelVisibility(adf, this.state);
		const selectedTemplate = isEmptyDoc(adf) ? null : this.state.selectedTemplate;

		if (
			panelVisible !== this.state.panelVisible ||
			selectedTemplate !== this.state.selectedTemplate
		) {
			this.setState({
				adf,
				panelVisible,
				selectedTemplate,
			});
		}
	};

	selectTemplate(tmpl: TemplateDefinition) {
		this.setState({
			selectedTemplate: tmpl,
		});

		this.props.actions.replaceDocument(tmpl.adf, false);
	}

	render() {
		return (
			<ContextPanel visible={this.state.panelVisible} editorAPI={this.props.editorAPI}>
				<div>
					{templates.map((tmpl, idx) => (
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
