import React from 'react';

import PropTypes from 'prop-types';

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
	}

	render(): React.JSX.Element {
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <LegacyEditorContextNew {...this.props}>{this.props.children}</LegacyEditorContextNew>;
	}
}

function LegacyEditorContextNew({ children, editorActions }: EditorContextProps) {
	return (
		<EditorContext.Provider value={{ editorActions: editorActions ?? new EditorActions() }}>
			{children}
		</EditorContext.Provider>
	);
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class LegacyEditorContextOld extends React.Component<EditorContextProps, Object> {
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

	render(): React.JSX.Element {
		return (
			<EditorContext.Provider value={this.getChildContext()}>
				{this.props.children}
			</EditorContext.Provider>
		);
	}
}
