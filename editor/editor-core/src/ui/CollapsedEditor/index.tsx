import React from 'react';

import { IntlProviderIfMissingWrapper } from '@atlaskit/editor-common/ui';

import Editor from '../../editor';
import ChromeCollapsed from '../ChromeCollapsed';

export interface Props {
	placeholder?: string;
	children?: any;
	isExpanded?: boolean;

	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onExpand?: () => void;
}

export interface State {}

export default class CollapsedEditor extends React.Component<Props, State> {
	editorComponent?: Editor;
	previouslyExpanded?: boolean;
	functionalEditor?: boolean;

	componentDidUpdate() {
		if (
			this.props.isExpanded &&
			(this.editorComponent || this.functionalEditor) &&
			(!this.previouslyExpanded || this.previouslyExpanded === undefined)
		) {
			this.props.onExpand?.();
		}
		this.previouslyExpanded = this.props.isExpanded;
	}

	handleEditorRef = (editorRef?: Editor, editorRefCallback?: any) => {
		if (editorRefCallback && typeof editorRefCallback === 'function') {
			editorRefCallback(editorRef);
		}
		this.editorComponent = editorRef;
	};

	render() {
		const child = React.Children.only(this.props.children);
		this.functionalEditor = typeof child.type === 'function';

		if (!this.props.isExpanded) {
			return (
				<IntlProviderIfMissingWrapper>
					<ChromeCollapsed onFocus={this.props.onFocus} text={this.props.placeholder} />
				</IntlProviderIfMissingWrapper>
			);
		}

		// Let's avoid ref logic for functional Editor
		if (this.functionalEditor) {
			return child;
		}
		return React.cloneElement(child, {
			ref: (editorComponent: Editor) => this.handleEditorRef(editorComponent, (child as any).ref),
		});
	}
}
