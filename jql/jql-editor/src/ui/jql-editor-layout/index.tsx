/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React, { type FocusEvent, type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { JQL_EDITOR_MAIN_ID } from '../../common/constants';
import { useEditorThemeContext } from '../../hooks/use-editor-theme/useEditorThemeContext';
import {
	EditorControls,
	EditorFooter,
	EditorMain,
	EditorView,
	EditorViewContainer,
	LineNumberToolbar,
} from './styled';

type Props = {
	/**
	 * React node to render within the editor controls group.
	 */
	EditorControlsContent: ReactNode;
	/**
	 * React node to render within the footer.
	 */
	EditorFooterContent: ReactNode;
	/**
	 * Flag to determine whether the editor view (or autocomplete dropdown) currently has focus.
	 */
	editorViewHasFocus: boolean;
	/**
	 * Flag to determine if there were any JQL parse errors in the last submitted query.
	 */
	editorViewIsInvalid: boolean;
	/**
	 * Flag to determine whether line numbers should be shown in the editor.
	 */
	lineNumbersVisible: boolean;
	/**
	 * ID to assign to the main wrapper of the editor.
	 */
	mainId: string;
	/**
	 * Ref callback to the main wrapper of the editor.
	 */
	onEditorMainRef?: (editorMain: HTMLElement | null) => void;
	/**
	 * Callback when the editor view is blurred.
	 */
	onEditorViewBlur?: () => void;
	/**
	 * Ref callback to the editor view container element.
	 */
	onEditorViewContainerRef?: (editorViewContainer: HTMLElement | null) => void;
	/**
	 * Callback when the editor view is scrolled.
	 */
	onEditorViewContainerScroll?: (event: React.UIEvent<HTMLElement>) => void;
	/**
	 * Callback when the editor view is focused.
	 */
	onEditorViewFocus?: (event: FocusEvent<HTMLElement>) => void;
	/**
	 * Ref callback to the editor view element which the Prosemirror editor will be bound to.
	 */
	onEditorViewRef?: (editorView: HTMLElement | null) => void;
	/**
	 * Callback when the editor view receives a CSS transition end event.
	 */
	onEditorViewTransitionEnd?: () => void;
};

const JQLEditorLayout = (props: Props): React.JSX.Element => {
	const { defaultMaxRows, expandedRows, isSearch, isCompact, defaultRows } =
		useEditorThemeContext();
	const {
		editorViewHasFocus,
		EditorControlsContent,
		EditorFooterContent,
		editorViewIsInvalid,
		lineNumbersVisible,
		mainId,
		onEditorMainRef,
		onEditorViewContainerRef,
		onEditorViewContainerScroll,
		onEditorViewRef,
		onEditorViewBlur,
		onEditorViewFocus,
		onEditorViewTransitionEnd,
	} = props;

	return (
		<EditorMain id={mainId} data-vc={JQL_EDITOR_MAIN_ID} ref={onEditorMainRef}>
			<EditorViewContainer
				editorViewHasFocus={editorViewHasFocus}
				editorViewIsInvalid={editorViewIsInvalid}
				ref={onEditorViewContainerRef}
				onScroll={onEditorViewContainerScroll}
			>
				<LineNumberToolbar lineNumbersVisible={lineNumbersVisible} />
				<EditorView
					defaultMaxRows={defaultMaxRows}
					expandedRows={expandedRows}
					isCompact={isCompact}
					lineNumbersVisible={lineNumbersVisible}
					ref={onEditorViewRef}
					onBlur={onEditorViewBlur}
					onFocus={onEditorViewFocus}
					onTransitionEnd={onEditorViewTransitionEnd}
					defaultRows={defaultRows}
				/>
				<EditorControls
					isSearch={isSearch}
					isCompact={isCompact}
					isVisualRefresh={fg('platform-component-visual-refresh')}
				>
					{EditorControlsContent}
				</EditorControls>
			</EditorViewContainer>
			<EditorFooter>{EditorFooterContent}</EditorFooter>
		</EditorMain>
	);
};

export default JQLEditorLayout;

/**
 * @deprecated Use `import { JQLEditorReadOnly } from '@atlaskit/jql-editor/jql-editor-read-only'` instead.
 */
export { JQLEditorReadOnly } from './JQLEditorReadOnly';
