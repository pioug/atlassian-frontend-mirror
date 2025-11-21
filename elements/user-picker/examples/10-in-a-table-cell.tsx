import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Table = styled.div({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Row = styled.div({
	display: 'flex',
	flexDirection: 'row',
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const Cell = styled.div<{ width?: number }>((props) => ({
	maxWidth: '100%',
	flex: '0 0 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${props.width}px` || 'auto',
}));

const renderRows = (count: number) => {
	const rows: React.ReactNode[] = [];
	for (let i = 0; i < count; i++) {
		rows.push(
			<Row>
				<Cell width={300}>KEY-{i}</Cell>
				<Cell width={100}>
					<ExampleWrapper>
						{({ options, onInputChange }) => (
							<UserPicker
								fieldId="example"
								menuPortalTarget={document.body}
								options={options}
								onInputChange={onInputChange}
								onChange={console.log}
							/>
						)}
					</ExampleWrapper>
				</Cell>
			</Row>,
		);
	}
	return rows;
};

const Example = (): React.JSX.Element => {
	return (
		<Table>
			<Row>
				<Cell width={300}>Issue</Cell>
				<Cell width={100}>Assign</Cell>
			</Row>
			{renderRows(50)}
		</Table>
	);
};
export default Example;
