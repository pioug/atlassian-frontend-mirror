import React from 'react';

import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';

import { caption, head, rows } from './content/sample-data';

interface State {
	showPagination: boolean;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			showPagination: true,
		};
	}

	togglePagination = () => {
		this.setState({
			showPagination: !this.state.showPagination,
		});
	};

	render() {
		return (
			<div>
				<p>
					Pagination is enabled or disabled by setting or unsetting the <code>rowsPerPage</code>
					prop.
				</p>
				<Button onClick={this.togglePagination}>Toggle pagination</Button>
				<DynamicTable
					caption={caption}
					head={head}
					rows={rows.slice(0, 10)}
					rowsPerPage={this.state.showPagination ? 5 : undefined}
					defaultPage={1}
					isFixedSize
					defaultSortKey="term"
					defaultSortOrder="ASC"
					onSort={() => console.log('onSort')}
					onSetPage={() => console.log('onSetPage')}
				/>
			</div>
		);
	}
}
