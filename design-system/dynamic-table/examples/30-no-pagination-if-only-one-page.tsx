/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';

import { lorem } from './content/lorem';
import { caption, head, rows } from './content/sample-data';

interface State {
	showMoreData: boolean;
	numRows: number;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			showMoreData: true,
			numRows: 10,
		};
	}

	toggleData = () => {
		this.setState({
			showMoreData: !this.state.showMoreData,
		});
	};

	handleNumRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			numRows: +e.target.value,
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
				<input id="rows" value={this.state.numRows} onChange={this.handleNumRowsChange} />
				<p>We're trying to show {this.state.numRows} rows</p>
				<DynamicTable
					caption={caption}
					head={head}
					rows={this.state.showMoreData ? rows.slice(0, 15) : rows.slice(0, 5)}
					rowsPerPage={this.state.numRows}
					defaultPage={1}
					isFixedSize
					defaultSortKey="term"
					defaultSortOrder="ASC"
					onSort={() => console.log('onSort')}
					onSetPage={() => console.log('onSetPage')}
				/>
				<p>{lorem}</p>
				<p>{lorem}</p>
				<p>{lorem}</p>
			</div>
		);
	}
}
