import React, { PureComponent } from 'react';

import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

import staticData from './data-cleancode-toc.json';

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class extends PureComponent<any, any> {
	state: any = {
		expansionMap: {
			1: true,
		},
	};

	render(): React.JSX.Element {
		const { expansionMap } = this.state;

		return (
			<div>
				<TableTree>
					<Headers>
						<Header width={200}>Chapter title</Header>
						<Header width={120}>Numbering</Header>
						<Header width={100}>Page</Header>
					</Headers>
					<Rows
						items={staticData.children}
						render={({ title, numbering, page, children }: any) => (
							<Row
								itemId={numbering}
								items={children}
								hasChildren={children.length > 0}
								isExpanded={Boolean(expansionMap[numbering])}
								onExpand={() =>
									this.setState({
										expansionMap: {
											...expansionMap,
											[numbering]: true,
										},
									})
								}
								onCollapse={() =>
									this.setState({
										expansionMap: {
											...expansionMap,
											[numbering]: false,
										},
									})
								}
							>
								<Cell singleLine>{title}</Cell>
								<Cell>{numbering}</Cell>
								<Cell>{page}</Cell>
							</Row>
						)}
					/>
				</TableTree>
			</div>
		);
	}
}
