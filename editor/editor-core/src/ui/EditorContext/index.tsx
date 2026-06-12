import React from 'react';

import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';

import EditorActions from '../../actions';

type EditorContextInternal = {
	editorActions?: EditorActions;
};

export type EditorContextProps = React.PropsWithChildren<EditorContextInternal>;

export const useEditorContext = (): EditorContextProps =>
	React.useContext<EditorContextProps>(EditorContext);

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function, @atlaskit/volt-strict-mode/no-multiple-exports
export class LegacyEditorContext extends React.Component<EditorContextProps, Object> {
	constructor(props: EditorContextProps) {
		super(props);
		this.editorActions = props.editorActions || new EditorActions();
		this.contextValue = { editorActions: this.editorActions };
	}
	private editorActions: EditorActions;
	private contextValue: EditorContextProps;

	render(): React.JSX.Element {
		return (
			<EditorContext.Provider value={this.contextValue}>
				{this.props.children}
			</EditorContext.Provider>
		);
	}
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default (props: EditorContextProps): React.JSX.Element => (
	<LegacyEditorContext editorActions={props.editorActions}>{props.children}</LegacyEditorContext>
);
