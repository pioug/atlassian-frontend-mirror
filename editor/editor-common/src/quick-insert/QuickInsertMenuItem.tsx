import React from 'react';

import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { INPUT_METHOD } from '../analytics';
import type { TypeAheadInsert } from '../types';
import { CompactQuickInsertMenuItem } from './CompactQuickInsertMenuItem';
import { ElementBrowserQuickInsertMenuItem } from './ElementBrowserQuickInsertMenuItem';
import type { QuickInsertPreview } from './preview';
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
	/** Structured preview content for the selected item. */
	preview?: QuickInsertPreview;
	/** Icon displayed beside the preview title. */
	previewIcon?: React.ReactNode;
	/** Retained for existing callers; new callers should pass `preview.image`. */
	previewImageUrls?: { dark?: string; light: string } | null;
	shortcut?: string;
	/** Whether preview title and description are clamped to a fixed number of lines. */
	shouldClampPreview?: boolean;
	/** Disable previews for navigation actions rather than insertable items. */
	shouldShowPreview?: boolean;
	shouldWrapIcon?: boolean;
	title: string;
	/** Rich title content rendered in place of the menu item title. */
	titleContent?: React.ReactNode;
};

export const QuickInsertMenuItem = ({
	ariaLabel,
	description,
	iconBefore,
	isDisabled,
	onSelect,
	preview,
	previewIcon,
	previewImageUrls,
	shortcut,
	titleContent,
	shouldShowPreview,
	shouldClampPreview,
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
			titleContent={titleContent}
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
			preview={preview}
			previewIcon={previewIcon}
			previewImageUrls={previewImageUrls}
			shortcut={shortcut}
			titleContent={titleContent}
			shouldShowPreview={shouldShowPreview}
			shouldClampPreview={shouldClampPreview}
			shouldWrapIcon={shouldWrapIcon}
			title={title}
		/>
	);
};
