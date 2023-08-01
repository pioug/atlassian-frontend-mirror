import { FC, useEffect } from 'react';

import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useSmartLinkEvents } from '@atlaskit/smart-card';

import { registerSmartCardEvents } from '../pm-plugins/actions';

export const EditorSmartCardEvents: FC<{ editorView: EditorView }> = ({
  editorView,
}) => {
  const events = useSmartLinkEvents();
  useEffect(() => {
    if (!events) {
      return;
    }
    editorView.dispatch(registerSmartCardEvents(events)(editorView.state.tr));
  }, [events, editorView]);
  return null;
};
