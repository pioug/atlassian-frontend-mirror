import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { EditorView } from 'prosemirror-view';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';

import type { Command, EditorAppearance } from '../../../types';
import { getAnalyticsEditorAppearance } from '../../../utils';

import { useEscapeClickaway } from './useEscapeClickaway';

/**
 * Returns a type that matches T but where keys (K) are now optional
 */
type OptionalKeys<T extends {}, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export interface EditorLinkPickerProps
  extends OptionalKeys<LinkPickerProps, 'onCancel'> {
  view: EditorView;
  /**
   * Used for analytics purposes to describe how the link picker was invoked
   * Should be roughly equivalent to the `inputMethod` analytics value
   */
  invokeMethod?: string;
  editorAppearance?: EditorAppearance;
  /** Callback to execute on unmount */
  onClose?: () => void;
  onEscapeCallback?: Command;
  onClickAwayCallback?: Command;
}

export const EditorLinkPicker = ({
  view,
  onCancel,
  invokeMethod = '_unknown',
  editorAppearance,
  onClose,
  onEscapeCallback,
  onClickAwayCallback,
  ...restProps
}: EditorLinkPickerProps) => {
  /**
   * Track onClose handler in a
   * ref so that we void needing it in the dependency array
   * below
   */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  /**
   * Call onClose on mount, usefull to provide
   * a handler for performing an action after the component has been
   * unmounted (e.g. return focus to the editors)
   */
  useEffect(() => () => onCloseRef.current?.(), []);

  const onEscape = useCallback(() => {
    const { state, dispatch } = view;
    onEscapeCallback?.(state, dispatch);
    onCancel?.();
  }, [view, onCancel, onEscapeCallback]);

  const onClickAway = useCallback(() => {
    const { state, dispatch } = view;
    onClickAwayCallback?.(state, dispatch);
    onCancel?.();
  }, [view, onCancel, onClickAwayCallback]);

  const ref = useEscapeClickaway<HTMLDivElement>(onEscape, onClickAway);
  const analyticsEditorAppearance =
    getAnalyticsEditorAppearance(editorAppearance);

  const analyticsData = useMemo(
    () => ({
      attributes: {
        invokeMethod,
        location: analyticsEditorAppearance,
      },
      // Below is added for the future implementation of Linking Platform namespaced analytic context
      location: analyticsEditorAppearance,
    }),
    [invokeMethod, analyticsEditorAppearance],
  );

  return (
    <div ref={ref}>
      <AnalyticsContext data={analyticsData}>
        <LinkPicker {...restProps} onCancel={onEscape} />
      </AnalyticsContext>
    </div>
  );
};
