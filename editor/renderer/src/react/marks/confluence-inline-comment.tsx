import React, { Component } from 'react';
import { type MarkProps } from '../types';

interface Props {
	reference: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export default class ConfluenceInlineComment extends Component<MarkProps<Props>, Object> {
	render() {
		const { reference, children } = this.props;
		return (
			<span data-mark-type="confluenceInlineComment" data-reference={reference}>
				{children}
			</span>
		);
	}
}
