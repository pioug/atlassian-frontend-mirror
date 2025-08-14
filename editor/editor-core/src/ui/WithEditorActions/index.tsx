import React from 'react';

import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';

import type EditorActions from '../../actions';

export interface WithEditorActionsProps {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	render(actions: EditorActions): React.ReactElement | null;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export default class WithEditorActions extends React.Component<WithEditorActionsProps, Object> {
	constructor(props: WithEditorActionsProps) {
		super(props);
	}

	render() {
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <WithEditorActionsNew {...this.props} />;
	}
}

function WithEditorActionsNew(props: WithEditorActionsProps) {
	const { render } = props;
	const context = React.useContext(EditorContext) as { editorActions: EditorActions };
	return <WithEditorActionsInner render={render} editorActions={context?.editorActions} />;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class WithEditorActionsInner extends React.Component<
	WithEditorActionsProps & { editorActions: EditorActions }
> {
	componentDidMount() {
		this.props.editorActions._privateSubscribe(() => this.forceUpdate());
	}

	componentWillUnmount() {
		this.props.editorActions._privateUnsubscribe(() => this.forceUpdate());
	}

	render() {
		return this.props.render(this.props.editorActions);
	}
}
