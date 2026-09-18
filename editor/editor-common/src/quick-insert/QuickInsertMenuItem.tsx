import React from 'react';

import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { INPUT_METHOD } from '../analytics';
import type { TypeAheadInsert } from '../types';
import { CompactQuickInsertMenuItem } from './CompactQuickInsertMenuItem';
import { ElementBrowserQuickInsertMenuItem } from './ElementBrowserQuickInsertMenuItem';
import { useQuickInsertContext } from './useQuickInsertContext';

export type OnSelectContext = {
	editorView: EditorView;
	insert: TypeAheadInsert;
	source:
		| INPUT_METHOD.ELEMENT_BROWSER
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.TOOLBAR;
};

export type QuickInsertMenuItemProps = {
	ariaLabel?: string;
	description?: string;
	iconBefore?: React.ReactNode;
	isDisabled?: boolean;
	onSelect: (context: OnSelectContext) => Transaction | false | void;
	/** Approved preview images, loaded only while this slash-command item is selected. */
	previewImageUrls?: { dark?: string; light: string } | null;
	shortcut?: string;
	shouldWrapIcon?: boolean;
	title: string;
};

export const QuickInsertMenuItem = ({
	ariaLabel,
	description,
	iconBefore,
	isDisabled,
	onSelect,
	previewImageUrls,
	shortcut,
	shouldWrapIcon,
	title,
}: QuickInsertMenuItemProps): React.JSX.Element => {
	const { surface } = useQuickInsertContext();

	return surface === 'element-browser' ? (
		<ElementBrowserQuickInsertMenuItem
			ariaLabel={ariaLabel}
			description={description}
			iconBefore={iconBefore}
			isDisabled={isDisabled}
			onSelect={onSelect}
			shortcut={shortcut}
			shouldWrapIcon={shouldWrapIcon}
			title={title}
		/>
	) : (
		<CompactQuickInsertMenuItem
			ariaLabel={ariaLabel}
			description={description}
			iconBefore={iconBefore}
			isDisabled={isDisabled}
			onSelect={onSelect}
			previewImageUrls={previewImageUrls}
			shortcut={shortcut}
			shouldWrapIcon={shouldWrapIcon}
			title={title}
		/>
	);
};
