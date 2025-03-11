import React from 'react';

import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table'; // defaults to using the STATEFUL component

import { caption, head, rows } from './content/sample-data';

interface State {
	showMoreData: boolean;
	numRowsPerPage: number;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			showMoreData: true,
			numRowsPerPage: 10,
		};
	}

	toggleData = () => {
		this.setState({
			showMoreData: !this.state.showMoreData,
		});
	};

	handleNumRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			numRowsPerPage: +e.target.value,
		});
	};

	render() {
		return (
			<div>
				<Button onClick={this.toggleData}>Toggle 5 or 15 rows</Button>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<label htmlFor="rows" style={{ display: 'block' }}>
					Number of rows per page
				</label>
				<input id="rows" value={this.state.numRowsPerPage} onChange={this.handleNumRowsChange} />
				<p>
					Table has {this.state.showMoreData ? 15 : 5} rows total, and is showing{' '}
					{this.state.numRowsPerPage} rows per page
				</p>
				<DynamicTable
					caption={caption}
					head={head}
					rows={this.state.showMoreData ? rows.slice(0, 15) : rows.slice(0, 5)}
					rowsPerPage={this.state.numRowsPerPage}
					defaultPage={1}
					isFixedSize
					defaultSortKey="term"
					defaultSortOrder="ASC"
				/>
			</div>
		);
	}
}
