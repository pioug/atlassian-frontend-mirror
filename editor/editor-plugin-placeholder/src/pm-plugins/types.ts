import type { IntlShape } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export interface PlaceHolderState {
	// if true, showOnEmptyParagraph will be true after setTimeout
	canShowOnEmptyParagraph?: boolean;
	contextPlaceholderADF?: DocNode;
	hasPlaceholder: boolean;
	isPlaceholderHidden?: boolean;
	placeholderPrompts?: string[];
	placeholderText?: string;
	pos?: number;
	showOnEmptyParagraph?: boolean;
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
