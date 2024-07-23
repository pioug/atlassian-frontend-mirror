/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Toggle from '@atlaskit/toggle';

import DynamicTable from '../src';

import { createHead, rows } from './content/sample-data';

interface State {
	isFixedSize: boolean;
	isLoading: boolean;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
	state = {
		isFixedSize: false,
		isLoading: false,
	};

	onToggleFixedChange = () => {
		this.setState({
			isFixedSize: !this.state.isFixedSize,
		});
	};

	onLoadingChange = () => {
		this.setState({
			isLoading: !this.state.isLoading,
		});
	};

	render() {
		return (
			<div>
				<div>
					<Toggle
						label="Fixed size"
						onChange={this.onToggleFixedChange}
						isChecked={this.state.isFixedSize}
					/>
					Fixed size
				</div>
				<div>
					<Toggle
						label="Loading"
						onChange={this.onLoadingChange}
						isChecked={this.state.isLoading}
					/>
					Loading
				</div>
				<DynamicTable
					caption="List of US Presidents"
					head={createHead(this.state.isFixedSize)}
					rows={rows}
					rowsPerPage={5}
					defaultPage={1}
					isRankable
					isLoading={this.state.isLoading}
					onRankStart={(params) => console.log('onRankStart', params)}
					onRankEnd={(params) => console.log('onRankEnd', params)}
					onSort={() => console.log('onSort')}
					onSetPage={() => console.log('onSetPage')}
				/>
			</div>
		);
	}
}
