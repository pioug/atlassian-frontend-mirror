import type { UserIntent } from '@atlaskit/editor-plugin-user-intent/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

export const isSelectionToolbarSuppressedByUserIntent = (
	currentUserIntent: UserIntent | undefined,
	isCellSelection: boolean,
): boolean =>
	Boolean(
		currentUserIntent &&
		currentUserIntent !== 'default' &&
		!(currentUserIntent === 'dragHandleSelected' && !isCellSelection),
	);
export const isPlainShiftArrowKey = ({
	shiftKey,
	key,
	metaKey,
	ctrlKey,
	altKey,
}: Pick<KeyboardEvent, 'shiftKey' | 'key' | 'metaKey' | 'ctrlKey' | 'altKey'>): boolean =>
	shiftKey && !metaKey && !ctrlKey && !altKey && key.includes('Arrow');
export const hasSelectionChanged = (
	mouseDownSelection: Selection | undefined,
	currentSelection: Selection,
): boolean => Boolean(mouseDownSelection && !mouseDownSelection.eq(currentSelection));
