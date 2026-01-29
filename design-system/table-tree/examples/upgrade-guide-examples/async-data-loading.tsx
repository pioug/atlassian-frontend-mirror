import React, { Component } from 'react';

import TableTree, {
	Cell,
	Header,
	Headers,
	Row,
	Rows,
	TableTreeDataHelper,
} from '@atlaskit/table-tree';

const defaultChild = {
	id: 'title One',
	title: 'title One',
	numbering: '1',
	page: '1',
	hasChildren: true,
};

type Item = typeof defaultChild;
interface State {
	items: Item[];
}

const tableTreeDataHelper = new TableTreeDataHelper<Item>({ key: 'title' });
// eslint-disable-next-line @repo/internal/react/no-class-components
class WithStaticData extends Component<any, State> {
	state: State = {
		items: [],
	};

	componentDidMount() {
		this.loadChildFor();
	}

	loadChildFor = (parentItem?: Item) => {
		getChildren(parentItem).then((item) => {
			this.setState({
				items: tableTreeDataHelper.updateItems(item, this.state.items, parentItem),
			});
		});
	};

	render() {
		const { items } = this.state;
		return (
			<TableTree>
				<Headers>
					<Header width={300}>Chapter title</Header>
					<Header width={120}>Numbering</Header>
					<Header width={100}>Page</Header>
				</Headers>
				<Rows
					items={items}
					render={({ title, numbering, page, hasChildren, children }) => (
						<Row
							onExpand={this.loadChildFor}
							expandLabel="Expand"
							collapseLabel="Collapse"
							itemId={numbering}
							items={children}
							hasChildren={hasChildren}
						>
							<Cell singleLine>{title}</Cell>
							<Cell singleLine>{numbering}</Cell>
							<Cell singleLine>{page}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		);
	}
}

const getChildren = (parentItem?: Item) => {
	if (!parentItem) {
		return Promise.resolve([defaultChild]);
	}
	return Promise.resolve([
		{
			id: `${parentItem.id}: child`,
			title: `${parentItem.title}: child`,
			numbering: `${parentItem.numbering}.1`,
			page: '1',
			hasChildren: true,
		},
	]);
};

export default (): React.JSX.Element => <WithStaticData />;
