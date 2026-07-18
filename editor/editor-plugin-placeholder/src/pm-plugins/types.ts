import type { IntlShape } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export interface PlaceHolderState {
	// if true, showOnEmptyParagraph will be true after setTimeout
	canShowOnEmptyParagraph?: boolean;
	contextPlaceholderADF?: DocNode;
	hasPlaceholder: boolean;
	isPlaceholderHidden?: boolean;
	multiBodiedExtensionPlaceholderDecorations?: DecorationSet;
	placeholderPrompts?: string[];
	placeholderText?: string;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	sourceSyncBlockPlaceholderDecorations?: DecorationSet;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
}

export type CreatePlaceholderStateProps = {
	bracketPlaceholderText?: string;
	defaultPlaceholderText: string | undefined;
	editorState: EditorState;
	emptyLinePlaceholder?: string;
	intl: IntlShape;
	isEditorFocused: boolean;
	isInitial?: boolean;
	isPlaceholderHidden?: boolean;
	isTypeAheadOpen: ((editorState: EditorState) => boolean) | undefined;
	placeholderADF?: DocNode;
	placeholderPrompts?: string[];
	showOnEmptyParagraph?: boolean;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
	withEmptyParagraph?: boolean;
};

export type UserInteractionState = {
	newEditorState: EditorState;
	oldEditorState?: EditorState;
	placeholderState?: PlaceHolderState;
};
