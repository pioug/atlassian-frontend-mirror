import React, { Component } from 'react';
import { type MarkProps } from '../types';

interface Props {
	reference: string;
}

export default class ConfluenceInlineComment extends Component<MarkProps<Props>, {}> {
	render() {
		const { reference, children } = this.props;
		return (
			<span data-mark-type="confluenceInlineComment" data-reference={reference}>
				{children}
			</span>
		);
	}
}
