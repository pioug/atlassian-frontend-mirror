import React, { Component } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';

import staticData from './data-freeform-nodes.json';

export default class SlowLoad extends Component {
	state = {
		tableData: [] as any[],
	};

	dataTimeoutId: number = 0;

	componentDidMount(): void {
		this.dataTimeoutId = setTimeout(() => {
			this.setState({
				tableData: staticData.children,
			});
		}, 3000) as any;
	}

	componentWillUnmount(): void {
		clearTimeout(this.dataTimeoutId);
	}

	render(): React.JSX.Element {
		return (
			<TableTree>
				<Headers>
					<Header width={200}>Title</Header>
					<Header width={120}>Numbering</Header>
				</Headers>
				<Rows
					items={this.state.tableData}
					render={({ id, title, numbering, children }) => (
						<Row itemId={id} items={children} hasChildren={children.length > 0}>
							<Cell>{title}</Cell>
							<Cell>{numbering}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);
	}
}
