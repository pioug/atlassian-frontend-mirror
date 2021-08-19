import { FC, useEffect } from 'react';
import { EditorView } from 'prosemirror-view';
import { registerSmartCardEvents } from '../pm-plugins/actions';
import { useSmartLinkEvents } from '@atlaskit/smart-card';

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
