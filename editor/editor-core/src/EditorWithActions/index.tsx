import React from 'react';

import PropTypes from 'prop-types';

import type EditorActions from '../actions';
import type { EditorProps } from '../editor';
import Editor from '../editor';
import EditorContext from '../ui/EditorContext';
import WithEditorActions from '../ui/WithEditorActions';

export interface EditorWithActionsProps
	extends Omit<EditorProps, 'onSave' | 'onChange' | 'onCancel'> {
	onSave?: (actions: EditorActions) => void;
	onChange?: (actions: EditorActions) => void;
	onCancel?: (actions: EditorActions) => void;
}

export default class EditorWithActions extends React.Component<EditorWithActionsProps, {}> {
	static contextTypes = {
		editorActions: PropTypes.object.isRequired,
	};
	context!: {
		editorActions?: EditorActions;
	};

	handleSave = (actions: EditorActions) => () => {
		this.props.onSave!(actions);
	};
	handleCancel = (actions: EditorActions) => () => {
		this.props.onCancel!(actions);
	};
	handleChange = (actions: EditorActions) => () => {
		this.props.onChange!(actions);
	};

	render() {
		if (this.context.editorActions) {
			const { editorActions: actions } = this.context;
			return (
				<Editor
					{...this.props}
					onSave={this.props.onSave ? this.handleSave(actions) : undefined}
					onChange={this.props.onChange ? this.handleChange(actions) : undefined}
					onCancel={this.props.onCancel ? this.handleCancel(actions) : undefined}
				/>
			);
		}
		return (
			<EditorContext>
				<WithEditorActions
					render={(actions) => (
						<Editor
							{...this.props}
							onSave={this.props.onSave ? this.handleSave(actions) : undefined}
							onChange={this.props.onChange ? this.handleChange(actions) : undefined}
							onCancel={this.props.onCancel ? this.handleCancel(actions) : undefined}
						/>
					)}
				/>
			</EditorContext>
		);
	}
}
