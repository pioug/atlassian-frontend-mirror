import React, { Component } from 'react';

import Button from '@atlaskit/button/default/button';
import HelpArticle from '@atlaskit/help-article/HelpArticle';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article/model/HelpArticle';
import type { AdfDoc } from '@atlaskit/help-article/model/HelpArticle';
import { Box } from '@atlaskit/primitives/compiled/box';

import { AdfDocument, AdfDocumentComplex } from './utils/mockData';

const dataExamples = [
	{
		bodyFormat: BODY_FORMAT_TYPES.adf,
		body: AdfDocument,
	},
	{
		bodyFormat: BODY_FORMAT_TYPES.adf,
		body: AdfDocumentComplex,
	},
	{
		bodyFormat: BODY_FORMAT_TYPES.html,
		body: '<p>before image</p> <img src="https://via.placeholder.com/600x600.png/" class="page-list__image" alt="LoremFlickr placeholder image"/> <p>after image</p>',
	},
];

interface Props {}

interface State {
	body?: string | AdfDoc;
	bodyFormat: BODY_FORMAT_TYPES;
}
export default class HelpArticleAdfExample extends Component<Props, State> {
	currentExample = 0;

	constructor(props: Props) {
		super(props);
		this.state = dataExamples[this.currentExample];
	}

	changeContent(): void {
		this.currentExample =
			this.currentExample + 1 < dataExamples.length ? this.currentExample + 1 : 0;
		this.setState(dataExamples[this.currentExample]);
	}

	render(): React.JSX.Element {
		return (
			<Box padding="space.100">
				<HelpArticle
					title="Article Title"
					body={this.state.body}
					bodyFormat={this.state.bodyFormat}
				/>
				<Button type="button" onClick={() => this.changeContent()}>
					Change content
				</Button>
			</Box>
		);
	}
}
