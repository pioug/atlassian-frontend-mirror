import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { getComponentIdentity } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import type { RegisteredMenuModel, RegisteredMenuSelectionSource } from './types';
import { useRegisteredMenuSelection } from './useRegisteredMenuSelection';

/** An open preview always belongs to the selected item, so only whether it's open is stored. */
type PreviewActivation = {
	model: RegisteredMenuModel;
	resetKey?: string | number | symbol;
	source: 'keyboard' | 'pointer';
};

type Options = {
	model: RegisteredMenuModel;
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
export const useRegisteredMenu = ({ model, resetKey }: Options): RegisteredMenuState => {
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
	const selection = useRegisteredMenuSelection({ identities: selectableItemIdentities, resetKey });
	const { getSelectedIndex, selectedIndex: selectedItemIndex, selectionSource, select } = selection;
	const [activation, setActivation] = useState<PreviewActivation | undefined>();
	const isPreviewOpen = activation?.model === model && activation.resetKey === resetKey;

	useLayoutEffect(() => {
		setActivation(undefined);
	}, [model, resetKey]);

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
	const activateKeyboardItem = useCallback(
		(index: number) => {
			setActivation(hasPreview(index) ? { model, resetKey, source: 'keyboard' } : undefined);
		},
		[hasPreview, model, resetKey],
	);
	const selectNext = useCallback(() => {
		activateKeyboardItem(selection.selectNext());
	}, [selection.selectNext, activateKeyboardItem]);
	const selectPrevious = useCallback(() => {
		activateKeyboardItem(selection.selectPrevious());
	}, [selection.selectPrevious, activateKeyboardItem]);
	const onItemHover = useCallback(
		(index: number) => {
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
		[hasPreview, model, resetKey, select],
	);
	const onItemFocus = useCallback(
		(index: number) => {
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
		[hasPreview, model, resetKey, select, selectedItemIndex, selectionSource],
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
