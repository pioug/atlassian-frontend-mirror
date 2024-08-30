import React from 'react';

import type Editor from '../../editor';
import ChromeCollapsed from '../ChromeCollapsed';
import { IntlProviderIfMissingWrapper } from '../IntlProviderIfMissingWrapper/IntlProviderIfMissingWrapper';

export interface Props {
	placeholder?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	handleEditorRef = (
		editorRef?: Editor,
		editorRefCallback?: (editor: Editor | undefined) => void,
	) => {
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
			ref: (editorComponent: Editor) => this.handleEditorRef(editorComponent, child.ref),
		});
	}
}
