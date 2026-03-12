import React from 'react';

import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';

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
		this.contextValue = { editorActions: this.editorActions };
	}
	private editorActions: EditorActions;
	private contextValue: EditorContextProps;

	render() {
		return (
			<EditorContext.Provider value={this.contextValue}>
				{this.props.children}
			</EditorContext.Provider>
		);
	}
}

export default (props: EditorContextProps) => (
	<LegacyEditorContext editorActions={props.editorActions}>{props.children}</LegacyEditorContext>
);
