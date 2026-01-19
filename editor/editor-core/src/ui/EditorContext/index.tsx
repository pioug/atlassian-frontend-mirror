import React from 'react';

import PropTypes from 'prop-types';

import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import EditorActions from '../../actions';

type EditorContextInternal = {
	editorActions?: EditorActions;
};

export type EditorContextProps = React.PropsWithChildren<EditorContextInternal>;

export const useEditorContext = () => React.useContext<EditorContextProps>(EditorContext);

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export class LegacyEditorContext extends React.Component<EditorContextProps, Object> {
	constructor(props: EditorContextProps) {
		super(props);
		this.editorActions = props.editorActions || new EditorActions();
	}
	private editorActions: EditorActions;

	render() {
		return (
		<EditorContext.Provider value={{ editorActions: this.editorActions }}>
			{this.props.children}
		</EditorContext.Provider>
	);
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class LegacyEditorContextOld extends React.Component<EditorContextProps, Object> {
	static childContextTypes = {
		editorActions: PropTypes.object,
	};

	private editorActions: EditorActions;

	constructor(props: EditorContextProps) {
		super(props);
		this.editorActions = props.editorActions || new EditorActions();
	}

	getChildContext() {
		return {
			editorActions: this.editorActions,
		};
	}

	render() {
		return (
			<EditorContext.Provider value={this.getChildContext()}>
				{this.props.children}
			</EditorContext.Provider>
		);
	}
}

export default (props: EditorContextProps) => expValEquals('platform_editor_context_context_types_migration', 'isEnabled', true) ? (
	<LegacyEditorContext editorActions={props.editorActions}>{props.children}</LegacyEditorContext>
) : (
	<LegacyEditorContextOld editorActions={props.editorActions}>{props.children}</LegacyEditorContextOld>
);
