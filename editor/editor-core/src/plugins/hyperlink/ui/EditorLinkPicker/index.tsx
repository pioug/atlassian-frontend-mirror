import React, { useCallback } from 'react';

import { EditorView } from 'prosemirror-view';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';

import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { hideLinkToolbar } from '../../commands';

import { useEscapeClickaway } from './useEscapeClickaway';

export interface EditorLinkPickerProps
  extends Omit<LinkPickerProps, 'onCancel'> {
  view: EditorView;
}

export const EditorLinkPicker = ({
  view,
  ...restProps
}: EditorLinkPickerProps) => {
  const onEscape = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
    view.dispatch(cardHideLinkToolbar(view.state.tr));
  }, [view]);

  const onClickAway = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
  }, [view]);

  const ref = useEscapeClickaway<HTMLDivElement>(onEscape, onClickAway);

  return (
    <div ref={ref}>
      <LinkPicker {...restProps} onCancel={onEscape} />
    </div>
  );
};
