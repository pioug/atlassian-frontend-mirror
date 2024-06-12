/* eslint-disable @atlaskit/design-system/prefer-primitives */
import React, { useState } from 'react';

import { DropList, Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
	DropdownMenuItem,
} from '@atlaskit/editor-common/ui-menu';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { MenuGroup, Section } from '@atlaskit/menu';

import { dragMenuDropdownWidth } from '../consts';

const DropListWithOutsideListeners = withReactEditorViewOuterListeners(DropList);

type DropdownMenuProps = {
	items: Array<{
		items: MenuItem[];
	}>;
	/**
	 * use to toggle top level menu keyboard navigation and action keys
	 * e.g. should be false if submenu is rendered as a child to avoid multiple keydown handlers
	 */
	disableKeyboardHandling: boolean;
	section: { hasSeparator?: boolean; title?: string };
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
	handleClose: (focusTarget: 'editor' | 'handle') => void;
	onMouseEnter: (attrs: { item: MenuItem }) => void;
	onMouseLeave: (attrs: { item: MenuItem }) => void;
	fitWidth?: number;
	fitHeight?: number;
	direction?: string;
	offset?: Array<number>;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
};

export const DropdownMenu = ({
	items,
	section,
	disableKeyboardHandling,
	onItemActivated,
	handleClose,
	onMouseEnter,
	onMouseLeave,
	fitWidth,
	fitHeight,
	direction,
	mountPoint,
	boundariesElement,
	scrollableElement,
}: DropdownMenuProps) => {
	const [popupPlacement, setPopupPlacement] = useState(['bottom', 'left']);
	const [targetRefDiv, setTargetRefDiv] = useState<HTMLDivElement | null>(null);
	const handleRef = (ref: HTMLDivElement | null) => {
		setTargetRefDiv(ref);
	};

	// more offsets calculation as offsets depend on the direction and updated placement here
	let offsetY = direction === 'row' ? (popupPlacement[0] === 'bottom' ? -8 : -34) : 0;
	let offsetX = direction === 'column' ? (popupPlacement[1] === 'left' ? 0 : -7) : 0;

	const innerMenu = () => {
		return (
			<DropListWithOutsideListeners
				isOpen
				shouldFitContainer
				position={popupPlacement.join(' ')}
				handleClickOutside={() => handleClose('editor')}
				handleEscapeKeydown={() => {
					if (!disableKeyboardHandling) {
						handleClose('handle');
					}
				}}
				handleEnterKeydown={(e: KeyboardEvent) => {
					if (!disableKeyboardHandling) {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				targetRef={targetRefDiv}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ height: 0, minWidth: dragMenuDropdownWidth }} />
				<MenuGroup role="menu">
					{items.map((group, index) => (
						<Section
							hasSeparator={section?.hasSeparator && index > 0}
							title={section?.title}
							key={index}
						>
							{group.items.map((item) => (
								<DropdownMenuItem
									shouldUseDefaultRole={false}
									key={item.key ?? String(item.content)}
									item={item}
									onItemActivated={onItemActivated}
									onMouseEnter={onMouseEnter}
									onMouseLeave={onMouseLeave}
								/>
							))}
						</Section>
					))}
				</MenuGroup>
			</DropListWithOutsideListeners>
		);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div className="drag-dropdown-menu-wrapper">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="drag-dropdown-menu-popup-ref" ref={handleRef}></div>
			<Popup
				target={targetRefDiv as HTMLElement}
				mountTo={mountPoint}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				onPlacementChanged={(placement: [string, string]) => {
					setPopupPlacement(placement);
				}}
				fitHeight={fitHeight}
				fitWidth={fitWidth}
				zIndex={akEditorFloatingPanelZIndex}
				offset={[offsetX, offsetY]}
				allowOutOfBounds // required as this popup is child of a parent popup, should be allowed to be out of bound of the parent popup, otherwise horizontal offset is not right
			>
				{disableKeyboardHandling ? (
					innerMenu()
				) : (
					<ArrowKeyNavigationProvider
						closeOnTab
						type={ArrowKeyNavigationType.MENU}
						handleClose={() => handleClose('handle')}
						onSelection={(index) => {
							const results = items.flatMap((item) => ('items' in item ? item.items : item));

							// onSelection is called when any focusable element is 'activated'
							// this is an issue as some menu items have toggles, which cause the index value
							// in the callback to be outside of array length.
							// The logic below normalises the index value based on the number
							// of menu items with 2 focusable elements, and adjusts the index to ensure
							// the correct menu item is sent in onItemActivated callback
							const keys = ['row_numbers', 'header_row', 'header_column'];
							let doubleItemCount = 0;

							const firstIndex = results.findIndex((value) => keys.includes(value.key!));

							if (firstIndex === -1 || index <= firstIndex) {
								onItemActivated && onItemActivated({ item: results[index] });
								return;
							}

							for (let i = firstIndex; i < results.length; i += 1) {
								if (keys.includes(results[i].key!)) {
									doubleItemCount += 1;
								}
								if (firstIndex % 2 === 0 && index - doubleItemCount === i) {
									onItemActivated && onItemActivated({ item: results[i] });
									return;
								}

								if (firstIndex % 2 === 1 && index - doubleItemCount === i) {
									onItemActivated && onItemActivated({ item: results[i] });
									return;
								}
							}
						}}
					>
						{innerMenu()}
					</ArrowKeyNavigationProvider>
				)}
			</Popup>
		</div>
	);
};
