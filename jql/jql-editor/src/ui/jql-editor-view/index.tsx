import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import throttle from 'lodash/throttle';

import {
  JQL_EDITOR_AUTOCOMPLETE_ID,
  JQL_EDITOR_HELP_CONTENT_ID,
  JQL_EDITOR_INPUT_ID,
  JQL_EDITOR_MAIN_ID,
} from '../../common/constants';
import { useEditorThemeContext } from '../../hooks/use-editor-theme';
import { useEditorViewIsInvalid } from '../../hooks/use-editor-view-is-invalid';
import {
  useAutocomplete,
  useAutocompleteIsOpen,
  useEditorView,
  useEditorViewHasFocus,
  useIntl,
  useLineNumbersVisible,
  useScopedId,
  useStoreActions,
} from '../../state';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { JQLEditorControlsContent } from '../jql-editor-controls-content';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { JQLEditorFooterContent } from '../jql-editor-footer-content';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import JQLEditorLayout from '../jql-editor-layout';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { usePortalActionsContext } from '../jql-editor-portal-provider/context';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { messages } from '../messages';

/**
 * This wraps ProseMirror's EditorView as a React component.
 */
const JQLEditorView = ({
  inputRef,
}: {
  inputRef?: React.Ref<{ focus: () => void }>;
}) => {
  const [editorView, { initialiseEditorView, updateEditorView }] =
    useEditorView();

  const editorViewNodeRef = useRef<HTMLElement | null>(null);
  const [mainId] = useScopedId(JQL_EDITOR_MAIN_ID);
  const [autocompleteId] = useScopedId(JQL_EDITOR_AUTOCOMPLETE_ID);
  const [editorId] = useScopedId(JQL_EDITOR_INPUT_ID);
  const [helpContentId] = useScopedId(JQL_EDITOR_HELP_CONTENT_ID);
  const [intl] = useIntl();
  const portalActions = usePortalActionsContext();

  const [, { setEditorViewContainer, setEditorViewContainerScroll }] =
    useStoreActions();

  const [editorViewHasFocus, { onEditorViewBlur, onEditorViewFocus }] =
    useEditorViewHasFocus();
  const [lineNumbersVisible] = useLineNumbersVisible();
  const [{ selectedOptionId }] = useAutocomplete();
  const [isAutocompleteOpen] = useAutocompleteIsOpen();
  const editorViewIsInvalid = useEditorViewIsInvalid();

  const { expanded } = useEditorThemeContext();
  const previousExpanded = useRef(expanded);

  const onEditorViewTransitionEnd = useCallback(() => {
    if (!expanded && editorViewNodeRef.current) {
      // Clear any fixed heights when the editor is collapsed
      editorViewNodeRef.current.style.height = '';
    }
  }, [expanded, editorViewNodeRef]);

  const onMainRef = useCallback(
    (element: HTMLElement | null) =>
      portalActions.onRegisterPluginContainer('main', element),
    [portalActions],
  );

  const onEditorViewContainerRef = useCallback(
    (editorViewContainer: HTMLElement | null) => {
      if (editorViewContainer) {
        setEditorViewContainer(editorViewContainer);
      }
    },
    [setEditorViewContainer],
  );

  const throttledSetEditorViewContainerScroll = useMemo(
    () =>
      throttle((scrollTop: number) => {
        setEditorViewContainerScroll(scrollTop);
      }, 1000 / 60), // 60 fps
    [setEditorViewContainerScroll],
  );

  const onEditorViewContainerScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const { scrollTop } = event.currentTarget;
      throttledSetEditorViewContainerScroll(scrollTop);
    },
    [throttledSetEditorViewContainerScroll],
  );

  // Compute HTML attributes to be applied to the Prosemirror editor view
  const getAttributes = useCallback(() => {
    return {
      id: editorId,
      'data-testid': 'jql-editor-input',
      // Disable grammarly
      'data-gramm': 'false',
      // Combobox might not be a semantically correct role for the editor,
      // however some browsers like Safari will only announce suggestions when this role is present
      role: 'combobox',
      'aria-expanded': `${isAutocompleteOpen}`,
      'aria-autocomplete': 'list',
      'aria-label': intl.formatMessage(messages.inputLabel),
      'aria-controls': autocompleteId,
      'aria-owns': autocompleteId,
      'aria-describedby': helpContentId,
      ...(selectedOptionId && {
        'aria-activedescendant': selectedOptionId,
      }),
      ...(editorViewIsInvalid && {
        'aria-invalid': 'true',
      }),
    };
  }, [
    editorId,
    isAutocompleteOpen,
    intl,
    autocompleteId,
    helpContentId,
    selectedOptionId,
    editorViewIsInvalid,
  ]);

  // Update attributes on our editor view whenever they have changed
  useEffect(() => {
    updateEditorView(getAttributes());
  }, [getAttributes, updateEditorView]);

  const onEditorViewRef = useCallback(
    (editorViewNode: HTMLElement | null) => {
      if (editorViewNode && !editorView) {
        initialiseEditorView(editorViewNode, getAttributes(), portalActions);
        editorViewNodeRef.current = editorViewNode;
      }
    },
    [editorView, initialiseEditorView, getAttributes, portalActions],
  );

  useEffect(() => {
    if (editorViewNodeRef.current && expanded !== previousExpanded.current) {
      if (expanded) {
        // Set fixed height based on the current element height so we can transition to the expanded height
        editorViewNodeRef.current.style.height =
          editorViewNodeRef.current.clientHeight + 'px';
        requestAnimationFrame(() => {
          if (editorViewNodeRef.current) {
            editorViewNodeRef.current.style.height = '';
            editorViewNodeRef.current.setAttribute('data-expanded', 'true');
          }
        });
      } else {
        if (editorView) {
          requestAnimationFrame(() => {
            if (editorViewNodeRef.current && editorView) {
              // Transition to the default height based on the content of the editor
              editorViewNodeRef.current.style.height =
                editorView.dom.clientHeight + 'px';
              editorViewNodeRef.current.removeAttribute('data-expanded');
            }
          });
        }
      }
    }
    previousExpanded.current = expanded;
  }, [expanded, previousExpanded, editorViewNodeRef, editorView]);

  useImperativeHandle(inputRef, () => ({
    focus: () => {
      if (editorView) {
        editorView.focus();
      }
    },
  }));

  useEffect(() => {
    return () => {
      if (editorView) {
        editorView.destroy();
      }
    };
  }, [editorView]);

  return (
    <JQLEditorLayout
      EditorControlsContent={<JQLEditorControlsContent />}
      EditorFooterContent={<JQLEditorFooterContent />}
      editorViewHasFocus={editorViewHasFocus}
      lineNumbersVisible={lineNumbersVisible}
      editorViewIsInvalid={editorViewIsInvalid}
      mainId={mainId}
      onEditorMainRef={onMainRef}
      onEditorViewContainerRef={onEditorViewContainerRef}
      onEditorViewContainerScroll={onEditorViewContainerScroll}
      onEditorViewRef={onEditorViewRef}
      onEditorViewBlur={onEditorViewBlur}
      onEditorViewFocus={onEditorViewFocus}
      onEditorViewTransitionEnd={onEditorViewTransitionEnd}
    />
  );
};

export default JQLEditorView;
