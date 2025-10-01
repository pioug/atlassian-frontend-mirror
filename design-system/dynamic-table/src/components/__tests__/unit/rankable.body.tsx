import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import * as closestEdge from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

import { RankableBody } from '../../rankable/body';

import { headMock1, rowsWithKeys } from './_data';

const createProps = () => ({
	head: headMock1,
	isFixedSize: false,
	onRankStart: jest.fn(),
	onRankEnd: jest.fn(),
	isRanking: false,
	innerRef: jest.fn(),
	refWidth: -1,
	refHeight: -1,
	pageRows: rowsWithKeys,
	isRankingDisabled: false,
	testId: 'dynamictable',
});

describe('RankableBody', () => {
	beforeEach(() => {
		HTMLElement.prototype.scrollIntoView = jest.fn();
	});

	test('onDragEnd - onRankEnd is called with proper empty destination if drag was cancelled', () => {
		const props = createProps();
		const sourceIndex = 1;

		const onRankStart = jest.fn();
		const onRankEnd = jest.fn();
		render(<RankableBody {...props} onRankStart={onRankStart} onRankEnd={onRankEnd} />);

		const row = screen.getByTestId(
			'dynamictable--1--rankable--table--row--rankable--table--body--row',
		);

		fireEvent.keyDown(row, { key: ' ' });
		fireEvent.keyDown(row, { key: 'Escape' });

		expect(onRankStart).toHaveBeenCalledTimes(1);
		expect(onRankEnd).toHaveBeenCalledTimes(1);
		expect(onRankEnd).toHaveBeenCalledWith({
			destination: undefined,
			sourceIndex,
			sourceKey: sourceIndex.toString(),
		});
	});

	function setElementFromPoint(el: Element | null): CleanupFn {
		const originalElementFromPoint = document.elementFromPoint;
		const originalElementsFromPoint = document.elementsFromPoint;

		document.elementFromPoint = () => el;
		document.elementsFromPoint = () => (el ? [el] : []);

		return () => {
			document.elementFromPoint = originalElementFromPoint;
			document.elementsFromPoint = originalElementsFromPoint;
		};
	}

	const extractClosestEdge = jest.spyOn(closestEdge, 'extractClosestEdge');

	function dragAndDrop({
		handle,
		target,
	}: {
		handle: HTMLElement;
		target: { getElement: () => HTMLElement; edge: Edge };
	}) {
		const cleanup = setElementFromPoint(handle);
		fireEvent.dragStart(handle);

		act(() => {
			// @ts-expect-error
			requestAnimationFrame.step();
		});
		cleanup();

		extractClosestEdge.mockReturnValue(target.edge);
		fireEvent.dragEnter(target.getElement());
		fireEvent.drop(handle);
	}

	const testOnRankEnd = ({
		sourceIndex,
		destinationIndex,
		afterKey,
		beforeKey,
	}: {
		sourceIndex: number;
		destinationIndex: number;
		afterKey?: string;
		beforeKey?: string;
	}) => {
		const props = createProps();

		render(<RankableBody {...props} />);

		const handle = screen.getByTestId(
			`dynamictable--${sourceIndex}--rankable--table--row--rankable--table--body--row`,
		);

		const target = screen.getByTestId(
			`dynamictable--${destinationIndex}--rankable--table--row--rankable--table--body--row`,
		);

		dragAndDrop({
			handle,
			target: {
				getElement: () => target,
				edge: sourceIndex > destinationIndex ? 'top' : 'bottom',
			},
		});

		// fireEvent.click(row);

		const { onRankEnd } = props;
		expect(onRankEnd).toHaveBeenCalledTimes(1);
		expect(onRankEnd).toHaveBeenLastCalledWith({
			sourceKey: sourceIndex.toString(),
			sourceIndex,
			destination: {
				index: destinationIndex,
				afterKey,
				beforeKey,
			},
		});
	};

	test('onDragEnd - onRankEnd is called with proper destination if was dropped on first position', () => {
		testOnRankEnd({
			sourceIndex: 2,
			destinationIndex: 0,
			afterKey: undefined,
			beforeKey: rowsWithKeys[0].key,
		});
	});

	test('onDragEnd - onRankEnd is called with proper destination if was dropped in the middle of list (move to the greater index)', () => {
		testOnRankEnd({
			sourceIndex: 0,
			destinationIndex: 2,
			afterKey: rowsWithKeys[2].key,
			beforeKey: rowsWithKeys[3].key,
		});
	});

	test('onDragEnd - onRankEnd is called with proper destination if was dropped in the middle of list before an item', () => {
		testOnRankEnd({
			sourceIndex: 3,
			destinationIndex: 1,
			afterKey: rowsWithKeys[0].key,
			beforeKey: rowsWithKeys[1].key,
		});
	});

	test('onDragEnd - onRankEnd is called with proper destination if was dropped on the last position', () => {
		const lastIndex = rowsWithKeys.length - 1;
		testOnRankEnd({
			sourceIndex: 1,
			destinationIndex: lastIndex,
			afterKey: rowsWithKeys[lastIndex].key,
			beforeKey: undefined,
		});
	});
});
