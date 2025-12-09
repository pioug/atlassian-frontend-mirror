/* eslint-disable @atlaskit/design-system/prefer-primitives */
import React, { useCallback, useState } from 'react';

import { DropList, type DropListProps, Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
	DropdownMenuItem,
} from '@atlaskit/editor-common/ui-menu';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { MenuGroup, Section } from '@atlaskit/menu';

import { dragMenuDropdownWidth } from '../consts';

const DropListWithOutsideClickTargetRef = (props: DropListProps) => {
	const setOutsideClickTargetRef = React.useContext(OutsideClickTargetRefContext);
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <DropList onDroplistRef={setOutsideClickTargetRef} {...props} />;
};
const DropListWithOutsideListeners = withReactEditorViewOuterListeners(
	DropListWithOutsideClickTargetRef,
);

type DropdownMenuProps = {
	boundariesElement?: HTMLElement;
	direction?: string;
	/**
	 * use to toggle top level menu keyboard navigation and action keys
	 * e.g. should be false if submenu is rendered as a child to avoid multiple keydown handlers
	 */
	disableKeyboardHandling: boolean;
	fitHeight?: number;
	fitWidth?: number;
	handleClose: (focusTarget: 'editor' | 'handle') => void;
	items: Array<{
		items: MenuItem[];
	}>;
	mountPoint?: HTMLElement;
	offset?: Array<number>;
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
	onMouseEnter: (attrs: { item: MenuItem }) => void;
	onMouseLeave: (attrs: { item: MenuItem }) => void;
	scrollableElement?: HTMLElement;
	section: { hasSeparator?: boolean; title?: string };
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
}: DropdownMenuProps): React.JSX.Element => {
	const [popupPlacement, setPopupPlacement] = useState(['bottom', 'left']);
	const [targetRefDiv, setTargetRefDiv] = useState<HTMLDivElement | null>(null);
	const handleRef = (ref: HTMLDivElement | null) => {
		setTargetRefDiv(ref);
	};

	// more offsets calculation as offsets depend on the direction and updated placement here
	const offsetY = direction === 'row' ? (popupPlacement[0] === 'bottom' ? -8 : -34) : 0;
	const offsetX = direction === 'column' ? (popupPlacement[1] === 'left' ? 0 : -7) : 0;

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
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
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

	const onClose = useCallback(() => handleClose('handle'), [handleClose]);
	const onSelection = useCallback(
		(index: number) => {
			const results = items.flatMap((item) => ('items' in item ? item.items : item));

			// onSelection is called when any focusable element is 'activated'
			// this is an issue as some menu items have toggles, which cause the index value
			// in the callback to be outside of array length.
			// The logic below normalises the index value based on the number
			// of menu items with 2 focusable elements, and adjusts the index to ensure
			// the correct menu item is sent in onItemActivated callback
			const keys = ['row_numbers', 'header_row', 'header_column'];
			let doubleItemCount = 0;

			const firstIndex = results.findIndex((value) => {
				const key = value.key;
				return key !== undefined && keys.includes(key);
			});

			if (firstIndex === -1 || index <= firstIndex) {
				onItemActivated && onItemActivated({ item: results[index] });
				return;
			}

			for (let i = firstIndex; i < results.length; i += 1) {
				const key = results[i].key;
				if (key !== undefined && keys.includes(key)) {
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
		},
		[items, onItemActivated],
	);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div className="drag-dropdown-menu-wrapper">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className="drag-dropdown-menu-popup-ref" ref={handleRef}></div>
			<Popup
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
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
				<ArrowKeyNavigationProvider
					closeOnTab={!disableKeyboardHandling}
					type={ArrowKeyNavigationType.MENU}
					handleClose={onClose}
					onSelection={onSelection}
					// disableKeyboardHandling is linked with isSubmenuOpen in DragMenu
					// When isSubmenuOpen is true, the background color picker palette is open, and the picker is a ColorPaletteArrowKeyNavigationProvider
					// At the same time the MenuArrowKeyNavigationProvider are renderer too, as it is the wrapper for all other DragMenu items
					// In this case we want the ColorPaletteArrowKeyNavigationProvider to handle the keyboard event, not the MenuArrowKeyNavigationProvider
					// Hence set disableArrowKeyNavigation to true when disableKeyboardHandling is true
					disableArrowKeyNavigation={disableKeyboardHandling}
				>
					{innerMenu()}
				</ArrowKeyNavigationProvider>
			</Popup>
		</div>
	);
};
