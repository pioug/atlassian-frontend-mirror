import React from 'react';
import styled from '@emotion/styled';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { PopupUserPicker } from '../src';

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
							<PopupUserPicker
								fieldId="example"
								target={({ ref }) => (
									<button ref={ref} data-testId={`popup-button-${i}`}>
										Target
									</button>
								)}
								options={options}
								onInputChange={onInputChange}
								onChange={console.log}
								width={200}
								popupTitle="Assignee"
							/>
						)}
					</ExampleWrapper>
				</Cell>
			</Row>,
		);
	}
	return rows;
};

const Example = () => {
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
