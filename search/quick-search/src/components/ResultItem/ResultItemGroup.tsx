import React from 'react';

import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

type Props = {
	/** Text to appear as heading above group. Will be auto-capitalised. */
	title: string;
	/** React Elements to be displayed within the group. This should generally be a collection of ResultItems. */
	children?: React.ReactNode;
};

export default class ResultItemGroup extends React.Component<Props> {
	render(): React.JSX.Element {
		const { title, children } = this.props;

		return (
			<MenuGroup>
				<Section title={title}>{children}</Section>
			</MenuGroup>
		);
	}
}
