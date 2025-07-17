import React, { useState, type ReactNode } from 'react';
import { token } from '@atlaskit/tokens';
import UserPicker from '../src';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';

const Example = () => {
	const [items, setItems] = useState(getItems(3));

	function onDragEnd(result: any) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		setItems(reorder(items, result.source.index, result.destination.index));
	}

	const PickerExamples = ({ id }: { id: string }) => (
		<ExampleWrapper>
			{({ options, onInputChange, onSelection }) => (
				<>
					<UserPicker
						fieldId={`select${id && '-'}${id}`}
						options={options}
						onChange={console.log}
						onOpen={() => console.log('open')}
						onClose={() => console.log('close')}
						onInputChange={onInputChange}
						onSelection={onSelection}
						UNSAFE_hasDraggableParentComponent={true}
					/>
					<UserPicker
						fieldId={`select-multi${id && '-'}${id}`}
						options={options}
						isMulti
						onChange={console.log}
						onOpen={() => console.log('open')}
						onClose={() => console.log('close')}
						onInputChange={onInputChange}
						onSelection={onSelection}
						UNSAFE_hasDraggableParentComponent={true}
					/>
				</>
			)}
		</ExampleWrapper>
	);

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	return (
		<Stack space="space.300">
			<DragDropContext onDragEnd={onDragEnd}>
				<Stack space="space.100">
					<Heading size="medium">
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
						Standard user picker with <code>UNSAFE_hasDraggableParentComponent=true</code>
					</Heading>
					<PickerExamples id="basic" />
					<Box
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						xcss={xcss({ border: '2px dashed gray', width: 'fit-content' })}
						onMouseDownCapture={(e: React.MouseEvent<HTMLDivElement>) => e.preventDefault()}
					>
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
						Parent with <code>onMouseDownCapture</code> preventing default
						<PickerExamples id="mousedown-captured" />
					</Box>
				</Stack>
				<Heading size="medium">
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
					User picker inside <code>react-beautiful-dnd</code> Draggable with{' '}
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
					<code>UNSAFE_hasDraggableParentComponent=true</code>
				</Heading>
				<Droppable droppableId="droppable">
					{(provided, snapshot) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{items.map((item: { id: string; content: ReactNode }, index: number) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											//@ts-ignore
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
										>
											{item.content}
											<PickerExamples id={`draggable-${item.id}`} />
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</Stack>
	);
};

// fake data generator
const getItems = (count: number) =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `item-${k}`,
		content: `Item ${k}`,
	}));

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle?: Object) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: token('space.200', '16px'),
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.100', '8px'),
	marginBottom: token('space.100', '8px'),

	// change background color if dragging
	background: token('elevation.surface.raised', '#FFFFFF'),
	boxShadow: isDragging
		? token('elevation.shadow.overlay', '0 1px 2px rgba(0,0,0,0.15)')
		: token('elevation.shadow.raised', '0 4px 8px -2px #000000'),
	transition: 'background 0.2s ease',

	// styles we need to apply on draggables
	...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
	padding: token('space.100', '8px'),

	background: isDraggingOver
		? token('color.background.selected', '#DEEBFF')
		: token('elevation.surface', '#FFFFFF'),
	transition: 'background 0.2s ease, box-shadow 0.2s ease',

	width: 250,
	border: `1px solid ${token('color.border', '#C1C7D0')} `,
});

export default Example;
