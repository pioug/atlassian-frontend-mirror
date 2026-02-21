import React, { type FocusEvent, type ReactNode } from 'react';

import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';

import { JQL_EDITOR_MAIN_ID } from '../../common/constants';
import {
	EditorThemeContext,
	useEditorTheme,
	useEditorThemeContext,
} from '../../hooks/use-editor-theme';
import { splitTextByNewLine } from '../../utils/split-text-by-new-line';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { ReadOnlyControlsContent } from '../jql-editor-controls-content/read-only-controls-content';
import { messages } from '../messages';

import {
	EditorControls,
	EditorFooter,
	EditorMain,
	EditorView,
	EditorViewContainer,
	LineNumberToolbar,
	ReadOnlyEditorView,
	ReadOnlyEditorViewContainer,
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
					{...(fg('list_lovability_improving_filters') ? { defaultRows } : {})}
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

type ReadOnlyProps = {
	query: string;
};

/**
 * A read only version of the JQL Editor which mimics the layout of the complete component, suitable as an intermediary
 * state when rendering the editor asynchronously.
 * In order to minimise bundle size impact on consumers, it is critical that this component (and any child component)
 * only imports the bare minimum dependencies required to replicate the editor layout.
 */
const JQLEditorReadOnlyWithoutTheme = ({ query }: ReadOnlyProps) => {
	const { defaultMaxRows, expandedRows, isSearch, isCompact, defaultRows } =
		useEditorThemeContext();

	const blocks = splitTextByNewLine(query);
	const lineNumbersVisible = blocks.length > 1;

	const { formatMessage } = useIntl();

	return (
		<EditorMain>
			<ReadOnlyEditorViewContainer>
				<LineNumberToolbar lineNumbersVisible={lineNumbersVisible} />
				<ReadOnlyEditorView
					data-testid="jql-editor-read-only"
					role="combobox"
					aria-readonly
					defaultMaxRows={defaultMaxRows}
					expandedRows={expandedRows}
					lineNumbersVisible={lineNumbersVisible}
					isCompact={isCompact}
					// aria-expanded and aria-controls here are placeholders only. This is to avoid a11y violations.
					// This component JQLEditorReadOnlyWithoutTheme is only a loading state
					// Therefore the autocomplete combobox is never shown to the users
					aria-expanded={false}
					aria-controls="dummy-jql-editor-auto-complete-id"
					aria-label={formatMessage(messages.inputLabel)}
					defaultRows={defaultRows}
				>
					{blocks.map((block, index) => (
						<Box as="p" key={index}>
							{block}
						</Box>
					))}
				</ReadOnlyEditorView>
				<EditorControls isSearch={isSearch} isCompact={isCompact}>
					<ReadOnlyControlsContent />
				</EditorControls>
			</ReadOnlyEditorViewContainer>
			<EditorFooter />
		</EditorMain>
	);
};

export const JQLEditorReadOnly = ({
	isSearch,
	isCompact,
	defaultRows,
	...props
}: ReadOnlyProps & {
	defaultRows?: number;
	isCompact?: boolean;
	isSearch?: boolean;
}): React.JSX.Element => {
	const editorTheme = useEditorTheme({ isSearch, isCompact, defaultRows });

	return (
		<EditorThemeContext.Provider value={editorTheme}>
			<JQLEditorReadOnlyWithoutTheme {...props} />
		</EditorThemeContext.Provider>
	);
};

export default JQLEditorLayout;
