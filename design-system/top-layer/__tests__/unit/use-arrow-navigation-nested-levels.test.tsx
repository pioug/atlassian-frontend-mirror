import React, { type ReactNode, useRef } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import { useArrowNavigation } from '../../src/use-arrow-navigation/use-arrow-navigation';

/**
 * One key acts on one menu level. A nested menu's listener runs first, and closing the nested menu
 * returns focus to its trigger, in the menu around it. In a browser, React can commit that focus
 * move between the two listeners. The menu around it must decide by the element that had focus when
 * the key was pressed.
 */

function Menu({
	label,
	onNestedClose,
	children,
}: {
	label: string;
	onNestedClose: () => void;
	children: ReactNode;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	useArrowNavigation({ containerRef, onClose: noop, onNestedClose, isEnabled: true });
	return (
		<div role="menu" aria-label={label} ref={containerRef}>
			{children}
		</div>
	);
}

describe('useArrowNavigation: nested menu levels', () => {
	it('should close only the nested menu on ArrowLeft, when its close moves focus to its trigger', () => {
		const onLevelOneClose = jest.fn();
		const onLevelTwoClose = jest.fn(() => {
			// As the commit of the close does in a browser, before the next listener runs.
			screen.getByRole('menuitem', { name: 'Level two trigger' }).focus();
		});
		render(
			<Menu label="Root" onNestedClose={noop}>
				<Menu label="Level one" onNestedClose={onLevelOneClose}>
					<button type="button" role="menuitem" aria-haspopup="menu">
						Level two trigger
					</button>
					<Menu label="Level two" onNestedClose={onLevelTwoClose}>
						<button type="button" role="menuitem">
							Level two item
						</button>
					</Menu>
				</Menu>
			</Menu>,
		);
		const item = screen.getByRole('menuitem', { name: 'Level two item' });
		item.focus();

		fireEvent.keyDown(item, { key: 'ArrowLeft' });

		expect(onLevelTwoClose).toHaveBeenCalledTimes(1);
		expect(onLevelOneClose).not.toHaveBeenCalled();
		expect(screen.getByRole('menuitem', { name: 'Level two trigger' })).toHaveFocus();
	});

	it('should close the menu that holds focus on ArrowLeft', () => {
		const onLevelOneClose = jest.fn();
		render(
			<Menu label="Root" onNestedClose={noop}>
				<Menu label="Level one" onNestedClose={onLevelOneClose}>
					<button type="button" role="menuitem">
						Level one item
					</button>
				</Menu>
			</Menu>,
		);
		const item = screen.getByRole('menuitem', { name: 'Level one item' });
		item.focus();

		fireEvent.keyDown(item, { key: 'ArrowLeft' });

		expect(onLevelOneClose).toHaveBeenCalledTimes(1);
	});
});
