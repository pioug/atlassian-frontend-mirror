import React, { useCallback } from 'react';

import { EditorView } from 'prosemirror-view';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';

import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { hideLinkToolbar } from '../../commands';

import { useEscapeClickaway } from './useEscapeClickaway';

/**
 * Returns a type that matches T but where keys (K) are now optional
 */
type OptionalKeys<T extends {}, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export interface EditorLinkPickerProps
  extends OptionalKeys<LinkPickerProps, 'onCancel'> {
  view: EditorView;
}

export const EditorLinkPicker = ({
  view,
  onCancel,
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

  return (
    <div ref={ref}>
      <LinkPicker {...restProps} onCancel={onEscape} />
    </div>
  );
};
