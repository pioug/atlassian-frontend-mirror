import React, { Component } from 'react';

import Button from '@atlaskit/button/default/button';
import HelpArticle from '@atlaskit/help-article/HelpArticle';
import { Box } from '@atlaskit/primitives/compiled/box';

interface Props {}

interface State {
	body?: string;
}
export default class HelpArticleExample extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			body: '<p><a href="https://www.atlassian.com/" target="_blank">Atlassian</a> Quisque eros orci, sagittis, ultrices varius dolor. Nunc mi leo, accumsan id massa nec, commodo placerat libero. Phasellus ullamcorper ligula facilisis massa tempor auctor. Praesent malesuada, eros sit amet posuere rutrum, justo ex tempor dui, at suscipit metus lacus non dui. Phasellus vehicula urna eu rhoncus sagittis. Integer at risus molestie, rutrum nibh nec, vehicula lacus. Nulla mollis dictum felis vitae facilisis. Nam faucibus non orci eget gravida. <a href="https://www.atlassian.com/" target="_blank">Atlassian</a></<a>',
		};
	}

	changeContent(): void {
		this.setState({
			body: '<p>before image</p> <img src="https://via.placeholder.com/600x600.png/" class="page-list__image" alt="LoremFlickr placeholder image"/> <p>after image</p>',
		});
	}

	render(): React.JSX.Element {
		return (
			<Box padding="space.100">
				<HelpArticle title="Article Title" body={this.state.body} />
				<Button type="button" onClick={() => this.changeContent()}>
					Change content
				</Button>
			</Box>
		);
	}
}
