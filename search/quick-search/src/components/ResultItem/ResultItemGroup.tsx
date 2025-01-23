import React from 'react';
import { MenuGroup, Section } from '@atlaskit/menu';

type Props = {
	/** Text to appear as heading above group. Will be auto-capitalised. */
	title: string;
	/** React Elements to be displayed within the group. This should generally be a collection of ResultItems. */
	children?: React.ReactNode;
};

export default class ResultItemGroup extends React.Component<Props> {
	render() {
		const { title, children } = this.props;

		return (
			<MenuGroup>
				<Section title={title}>{children}</Section>
			</MenuGroup>
		);
	}
}
