import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { getComponentIdentity } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import type {
	RegisteredMenuActiveItemChangeHandler,
	RegisteredMenuListRenderedHandler,
	RegisteredMenuModel,
	RegisteredMenuSelectionSource,
} from './types';
import { useRegisteredMenuSelection } from './useRegisteredMenuSelection';

/** An open preview always belongs to the selected item, so only whether it's open is stored. */
type PreviewActivation = {
	model: RegisteredMenuModel;
	resetKey?: string | number | symbol;
	source: 'keyboard' | 'pointer';
};

type Options = {
	model: RegisteredMenuModel;
	onActiveItemChange: RegisteredMenuActiveItemChangeHandler | undefined;
	onListRendered: RegisteredMenuListRenderedHandler | undefined;
	resetKey?: string | number | symbol;
};

const getSelectableItemIdentity = (
	item: RegisterMenuItem,
	scope: { sectionKey: string; type: 'section' } | { type: 'fallback' } | { type: 'footer' },
): string =>
	JSON.stringify([
		scope.type,
		scope.type === 'section' ? scope.sectionKey : undefined,
		getComponentIdentity(item),
	]);

export type RegisteredMenuState = {
	/** Whether the selected item shows item-specific feedback, such as a preview. */
	isPreviewOpen: boolean;
	onItemBlur: (index: number) => void;
	onItemFocus: (index: number) => void;
	onItemHover: (index: number) => void;
	onItemLeave: (index: number) => void;
	onItemVisibilityChange: (index: number, isVisible: boolean) => void;
	rows: Array<RegisterMenuItem | RegisterMenuSection>;
	select: (index: number, source: RegisteredMenuSelectionSource) => void;
	selectableItems: RegisterMenuItem[];
	selectedItemIndex: number;
	/** Whether the keyboard or the pointer made the current selection. */
	selectionSource: RegisteredMenuSelectionSource;
	selectNext: () => void;
	selectPrevious: () => void;
};

/**
 * Connects menu rows to keyboard selection and tracks which item is active through
 * keyboard, pointer and focus events. Selection controls navigation; activation lets
 * the caller show item-specific feedback, such as a preview. A changed reset key
 * starts navigation again and clears the active item.
 */
export const useRegisteredMenu = ({
	model,
	onActiveItemChange,
	onListRendered,
	resetKey,
}: Options): RegisteredMenuState => {
	const { rows, selectableItems, selectableItemIdentities } = useMemo(() => {
		const rows: Array<RegisterMenuItem | RegisterMenuSection> = [];
		const selectableItems: RegisterMenuItem[] = [];
		const selectableItemIdentities: string[] = [];
		const appendItem = (
			item: RegisterMenuItem,
			scope: { sectionKey: string; type: 'section' } | { type: 'fallback' },
		) => {
			rows.push(item);
			selectableItems.push(item);
			// A shared item key in another section is a different selection target.
			selectableItemIdentities.push(getSelectableItemIdentity(item, scope));
		};
		model.sections.forEach(([section, ...items]) => {
			rows.push(section);
			items.forEach((item) =>
				appendItem(item, { sectionKey: getComponentIdentity(section), type: 'section' }),
			);
		});
		model.fallbackItems.forEach((item) => appendItem(item, { type: 'fallback' }));
		// The footer participates in navigation but is rendered outside the scrolling rows.
		if (model.footer) {
			selectableItemIdentities.push(getSelectableItemIdentity(model.footer, { type: 'footer' }));
		}
		return { rows, selectableItems, selectableItemIdentities };
	}, [model]);
	const hasRoot = Boolean(model.root);
	const selection = useRegisteredMenuSelection({ identities: selectableItemIdentities, resetKey });
	const { getSelectedIndex, selectedIndex: selectedItemIndex, selectionSource, select } = selection;
	const [activation, setActivation] = useState<PreviewActivation | undefined>();
	const isPreviewOpen = activation?.model === model && activation.resetKey === resetKey;

	useLayoutEffect(() => {
		setActivation(undefined);
	}, [model, resetKey]);

	// Measured from when the hook first renders a model (after the caller builds it), so for the
	// first open it stops one commit before the host shows the popup.
	// eslint-disable-next-line react-hooks/exhaustive-deps -- restart timing for each model
	const renderStart = useMemo(() => performance.now(), [model]);
	// `selectableItems` is rebuilt for each model, so this fires once per model.
	useEffect(() => {
		if (hasRoot) {
			onListRendered?.({
				itemCount: selectableItems.length,
				time: performance.now() - renderStart,
			});
		}
	}, [hasRoot, onListRendered, renderStart, selectableItems]);

	/**
	 * Closes the preview when the event comes from the selected item, optionally only for one source.
	 * Rows report leaving, blur and visibility from effects, including cleanups. Reading the latest
	 * selection keeps this callback stable, so a selection change doesn't re-run those effects and
	 * a row's cleanup can't close the preview that just moved to another row.
	 */
	const closePreviewFor = useCallback(
		(index: number, source?: PreviewActivation['source']) => {
			if (index !== getSelectedIndex()) {
				return;
			}
			setActivation((current) =>
				current && (source === undefined || current.source === source) ? undefined : current,
			);
		},
		[getSelectedIndex],
	);

	// Only listed items show a preview; the footer comes after them.
	const hasPreview = useCallback(
		(index: number) => index < selectableItems.length,
		[selectableItems],
	);
	// Reports only selections the user makes by keyboard, pointer or focus. Opening the menu,
	// changing the query and reordering items move the highlight without reporting.
	const reportActiveItem = useCallback(
		(previousIndex: number, index: number) => {
			if (index !== previousIndex) {
				onActiveItemChange?.({ index, itemCount: selectableItems.length });
			}
		},
		[onActiveItemChange, selectableItems.length],
	);
	// Runs a keyboard move, reports it and shows the new item's preview.
	const moveKeyboardSelection = useCallback(
		(move: () => number) => {
			const previousIndex = getSelectedIndex();
			const index = move();
			reportActiveItem(previousIndex, index);
			setActivation(hasPreview(index) ? { model, resetKey, source: 'keyboard' } : undefined);
		},
		[getSelectedIndex, hasPreview, model, reportActiveItem, resetKey],
	);
	const selectNext = useCallback(
		() => moveKeyboardSelection(selection.selectNext),
		[moveKeyboardSelection, selection.selectNext],
	);
	const selectPrevious = useCallback(
		() => moveKeyboardSelection(selection.selectPrevious),
		[moveKeyboardSelection, selection.selectPrevious],
	);
	const onItemHover = useCallback(
		(index: number) => {
			reportActiveItem(getSelectedIndex(), index);
			select(index, 'pointer');
			setActivation((current) => {
				if (!hasPreview(index)) {
					return undefined;
				}
				if (
					current?.model === model &&
					current.resetKey === resetKey &&
					current.source === 'pointer'
				) {
					return current;
				}
				return { model, resetKey, source: 'pointer' };
			});
		},
		[getSelectedIndex, hasPreview, model, reportActiveItem, resetKey, select],
	);
	const onItemFocus = useCallback(
		(index: number) => {
			reportActiveItem(getSelectedIndex(), index);
			const isSelectedItem = index === selectedItemIndex;
			// A press focuses the item the pointer already selected. Scrolling it then would move it before the click lands.
			select(index, isSelectedItem && selectionSource === 'pointer' ? 'pointer' : 'keyboard');
			setActivation((current) => {
				if (!hasPreview(index)) {
					return undefined;
				}
				if (isSelectedItem && current?.model === model && current.resetKey === resetKey) {
					return current;
				}
				return { model, resetKey, source: 'keyboard' };
			});
		},
		[
			getSelectedIndex,
			hasPreview,
			model,
			reportActiveItem,
			resetKey,
			select,
			selectedItemIndex,
			selectionSource,
		],
	);
	const onItemLeave = useCallback(
		(index: number) => closePreviewFor(index, 'pointer'),
		[closePreviewFor],
	);
	const onItemBlur = useCallback((index: number) => closePreviewFor(index), [closePreviewFor]);
	const onItemVisibilityChange = useCallback(
		(index: number, isVisible: boolean) => {
			if (!isVisible) {
				closePreviewFor(index, 'pointer');
			}
		},
		[closePreviewFor],
	);

	return {
		rows,
		selectableItems,
		selectedItemIndex,
		selectionSource,
		select,
		selectNext,
		selectPrevious,
		isPreviewOpen,
		onItemHover,
		onItemFocus,
		onItemLeave,
		onItemBlur,
		onItemVisibilityChange,
	};
};
