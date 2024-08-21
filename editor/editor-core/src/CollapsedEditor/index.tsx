import React from 'react';

import type * as EditorImports from '../index';
import ChromeCollapsed from '../ui/ChromeCollapsed';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorModules = { [x: string]: any };

export type EditorModule = {
	// Subset of most common imports expected to be used
	EditorContext: typeof EditorImports.EditorContext;
	WithEditorActions: typeof EditorImports.WithEditorActions;
} & EditorModules;

export interface Props {
	placeholder?: string;
	isExpanded?: boolean;
	onClickToExpand?: () => void;
	renderEditor: (Editor: typeof EditorImports.Editor, modules: EditorModule) => JSX.Element;
}

export interface State {
	editorModules?: EditorModules;
}

export default class CollapsedEditor extends React.Component<Props, State> {
	static editorModules: EditorModules;
	state = { editorModules: CollapsedEditor.editorModules } as State;

	componentDidMount() {
		if (!this.state.editorModules) {
			this.loadEditorModules();
		}
	}

	loadEditorModules() {
		import(/* webpackChunkName:"@atlaskit-internal_editor-core-async" */ '../').then((modules) => {
			CollapsedEditor.editorModules = modules;
			this.setState({ editorModules: modules });
		});
	}

	render() {
		if (!this.props.isExpanded) {
			return <ChromeCollapsed onFocus={this.props.onClickToExpand} text={this.props.placeholder} />;
		}

		if (!this.state.editorModules) {
			// TODO: Proper loading state
			return <ChromeCollapsed text="Loading..." />;
		}

		const { Editor, ...rest } = this.state.editorModules;
		return this.props.renderEditor(Editor, rest as EditorModule);
	}
}
