import React, { useCallback, useMemo } from 'react';

import { EditorView } from 'prosemirror-view';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';

import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { hideLinkToolbar } from '../../commands';

import { useEscapeClickaway } from './useEscapeClickaway';
import { AnalyticsContext } from '@atlaskit/analytics-next';

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
}

export const EditorLinkPicker = ({
  view,
  onCancel,
  invokeMethod = '_unknown',
  ...restProps
}: EditorLinkPickerProps) => {
  const onEscape = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
    view.dispatch(cardHideLinkToolbar(view.state.tr));
    onCancel?.();
  }, [view, onCancel]);

  const onClickAway = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
    onCancel?.();
  }, [view, onCancel]);

  const ref = useEscapeClickaway<HTMLDivElement>(onEscape, onClickAway);

  const analyticsData = useMemo(
    () => ({
      attributes: {
        invokeMethod,
      },
    }),
    [invokeMethod],
  );

  return (
    <div ref={ref}>
      <AnalyticsContext data={analyticsData}>
        <LinkPicker {...restProps} onCancel={onEscape} />
      </AnalyticsContext>
    </div>
  );
};
