import React, { PureComponent } from 'react';
import { type EditorProps } from '@atlaskit/editor-core';
import { type RendererProps } from '@atlaskit/renderer';
import { type State } from '../context/context';
import { Consumer } from './consumer';
import { default as Document } from '../components/document';

export interface Props {
	editorProps?: Partial<EditorProps>;
	rendererProps?: Partial<RendererProps>;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class DocumentBody extends PureComponent<Props> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private renderChild = (props: any) => {
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <Document {...this.props} {...props} />;
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private stateMapper = (state: State): any => {
		const { doc, hasError, isLoading, mode } = state;

		return {
			doc,
			hasError,
			isLoading,
			mode,
		};
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private renderPropsMapper = (renderProps: any): any => {
		const { renderTitle, renderToolbar } = renderProps;
		return {
			renderTitle,
			renderToolbar,
		};
	};

	render() {
		return (
			<Consumer stateMapper={this.stateMapper} renderPropsMapper={this.renderPropsMapper}>
				{this.renderChild}
			</Consumer>
		);
	}
}
