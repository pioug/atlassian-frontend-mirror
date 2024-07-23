/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useCallback } from 'react';
// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
	DragDropContext,
	Draggable,
	Droppable,
	type OnDragEndResponder,
	type DropResult,
} from 'react-beautiful-dnd';
import ActionBlockBuilder from './action-block-builder';
import BlockBuilderContainer from './block-builder-container';
import { type BlockTemplate } from '../types';
import { BlockName } from '../constants';
import FooterBlockBuilder from './footer-block-builder';
import MetadataBlockBuilder from './metadata-block-builder';
import PreviewBlockBuilder from './preview-block-builder';
import SnippetBlockBuilder from './snippet-block-builder';
import TitleBlockBuilder from './title-block-builder';
import { type SmartLinkSize } from '../../../src';
import BlockOption from './inputs/block-option';
import Fieldset from './fieldset';

const listStyles = css({
	marginTop: '1rem',
});

const blockBuilderMapper = {
	[BlockName.ActionBlock]: ActionBlockBuilder,
	[BlockName.FooterBlock]: FooterBlockBuilder,
	[BlockName.MetadataBlock]: MetadataBlockBuilder,
	[BlockName.PreviewBlock]: PreviewBlockBuilder,
	[BlockName.SnippetBlock]: SnippetBlockBuilder,
	[BlockName.TitleBlock]: TitleBlockBuilder,
};

const isInternal = (name: BlockName) => name === BlockName.ActionBlock;

const add = <T,>(list: T[], item: T) => {
	return [...list, item];
};

const remove = <T,>(list: T[], index: number) => {
	const result = Array.from(list);
	result.splice(index, 1);

	return result;
};

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const isRemovable = (blockTemplates: BlockTemplate[], name: BlockName) => {
	if (
		name === BlockName.TitleBlock &&
		blockTemplates.filter((block) => block.name === BlockName.TitleBlock).length === 1
	) {
		return false;
	}
	return true;
};

const BlockBuilder = ({
	blocks = [],
	onChange,
	size,
}: {
	blocks?: BlockTemplate[];
	onChange: (blocks: BlockTemplate[]) => void;
	size?: SmartLinkSize; // block inherit size from ui options
}) => {
	const handleOnBlockChange = useCallback(
		(position: number, t: BlockTemplate) => {
			const updatedBlocks = blocks.map((blockTemplate, idx) =>
				idx === position ? t : blockTemplate,
			);
			onChange(updatedBlocks);
		},
		[blocks, onChange],
	);

	const handleOnBlockAdd = useCallback(
		(name: BlockName) => {
			const updatedBlocks = add(blocks, { name });
			onChange(updatedBlocks);
		},
		[blocks, onChange],
	);

	const handleOnBlockRemove = useCallback(
		(idx: number) => {
			const updatedBlocks = remove(blocks, idx);
			onChange(updatedBlocks);
		},
		[blocks, onChange],
	);

	const handleOnBlockDragEnd: OnDragEndResponder = useCallback(
		(result: DropResult) => {
			// dropped outside the list
			if (!result.destination) {
				return;
			}

			const updatedBlocks = reorder(blocks, result.source.index, result.destination.index);
			onChange(updatedBlocks);
		},
		[blocks, onChange],
	);

	return (
		<Fieldset legend="Flexible Smart Links: Blocks">
			<BlockOption onClick={handleOnBlockAdd} />
			<DragDropContext onDragEnd={handleOnBlockDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef} css={listStyles}>
							{blocks.map((blockTemplate, idx) => {
								const { name } = blockTemplate;
								const BlockBuilderItem =
									blockBuilderMapper[name as keyof typeof blockBuilderMapper];
								if (BlockBuilderItem) {
									return (
										<Draggable key={`${idx}-${name}`} draggableId={`${name}-${idx}`} index={idx}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<BlockBuilderContainer
														internal={isInternal(name)}
														name={name}
														onRemove={handleOnBlockRemove}
														position={idx}
														removable={isRemovable(blocks, name)}
													>
														<BlockBuilderItem
															onChange={(t) => handleOnBlockChange(idx, t)}
															size={size}
															template={blockTemplate}
														/>
													</BlockBuilderContainer>
												</div>
											)}
										</Draggable>
									);
								}
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</Fieldset>
	);
};

export default BlockBuilder;
