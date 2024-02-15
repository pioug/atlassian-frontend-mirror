import React, { FocusEvent, ReactNode } from 'react';

import {
  EditorThemeContext,
  useEditorTheme,
  useEditorThemeContext,
} from '../../hooks/use-editor-theme';
import { splitTextByNewLine } from '../../utils/split-text-by-new-line';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { ReadOnlyControlsContent } from '../jql-editor-controls-content/read-only-controls-content';

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
   * React node to render within the footer.
   */
  EditorFooterContent: ReactNode;
  /**
   * React node to render within the editor controls group.
   */
  EditorControlsContent: ReactNode;
  /**
   * Flag to determine whether the editor view (or autocomplete dropdown) currently has focus.
   */
  editorViewHasFocus: boolean;
  /**
   * Flag to determine whether line numbers should be shown in the editor.
   */
  lineNumbersVisible: boolean;
  /**
   * Flag to determine if there were any JQL parse errors in the last submitted query.
   */
  editorViewIsInvalid: boolean;
  /**
   * ID to assign to the main wrapper of the editor.
   */
  mainId: string;
  /**
   * Ref callback to the main wrapper of the editor.
   */
  onEditorMainRef?: (editorMain: HTMLElement | null) => void;
  /**
   * Ref callback to the editor view container element.
   */
  onEditorViewContainerRef?: (editorViewContainer: HTMLElement | null) => void;
  /**
   * Callback when the editor view is scrolled.
   */
  onEditorViewContainerScroll?: (event: React.UIEvent<HTMLElement>) => void;
  /**
   * Ref callback to the editor view element which the Prosemirror editor will be bound to.
   */
  onEditorViewRef?: (editorView: HTMLElement | null) => void;
  /**
   * Callback when the editor view is blurred.
   */
  onEditorViewBlur?: () => void;
  /**
   * Callback when the editor view is focused.
   */
  onEditorViewFocus?: (event: FocusEvent<HTMLElement>) => void;
  /**
   * Callback when the editor view receives a CSS transition end event.
   */
  onEditorViewTransitionEnd?: () => void;
};

const JQLEditorLayout = (props: Props) => {
  const { defaultMaxRows, expandedRows, isSearch, isCompact } =
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
    <EditorMain id={mainId} ref={onEditorMainRef}>
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
        />
        <EditorControls isSearch={isSearch} isCompact={isCompact}>
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
  const { defaultMaxRows, expandedRows, isSearch, isCompact } =
    useEditorThemeContext();

  const blocks = splitTextByNewLine(query);
  const lineNumbersVisible = blocks.length > 1;

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
        >
          {blocks.map((block, index) => (
            <p key={index}>{block}</p>
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
  ...props
}: ReadOnlyProps & {
  isSearch?: boolean;
  isCompact?: boolean;
}) => {
  const editorTheme = useEditorTheme({ isSearch, isCompact });

  return (
    <EditorThemeContext.Provider value={editorTheme}>
      <JQLEditorReadOnlyWithoutTheme {...props} />
    </EditorThemeContext.Provider>
  );
};

export default JQLEditorLayout;
