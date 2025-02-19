import React from 'react';

import PropTypes from 'prop-types';

import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';
import { fg } from '@atlaskit/platform-feature-flags';

import type EditorActions from '../../actions';

export interface WithEditorActionsProps {
	render(actions: EditorActions): React.ReactElement | null;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export default class WithEditorActions extends React.Component<WithEditorActionsProps, Object> {
	constructor(props: WithEditorActionsProps) {
		super(props);
	}

	render() {
		if (fg('platform_editor_react18_phase2_v2')) {
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <WithEditorActionsNew {...this.props} />;
		}
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <WithEditorActionsOld {...this.props} />;
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

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class WithEditorActionsOld extends React.Component<WithEditorActionsProps> {
	static contextTypes = {
		editorActions: PropTypes.object.isRequired,
	};

	context!: {
		editorActions: EditorActions;
	};

	componentDidMount() {
		this.context.editorActions._privateSubscribe(this.onContextUpdate);
	}

	componentWillUnmount() {
		this.context.editorActions._privateUnsubscribe(this.onContextUpdate);
	}

	private onContextUpdate = () => {
		// Re-render actions when editorActions changes...
		this.forceUpdate();
	};

	render() {
		return this.props.render(this.context.editorActions);
	}
}
