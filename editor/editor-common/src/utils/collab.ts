import { EditorState } from 'prosemirror-state';

export const getParticipantsCount = (editorState?: EditorState) => {
  // TODO: ED-15663
  // Please, do not copy or use this kind of code below
  // @ts-ignore
  if (!editorState || !(editorState as any)['collabEditPlugin$']) {
    return 1;
  }

  const participantsCount =
    (editorState as any)['collabEditPlugin$'].participants?.size() ?? 1;
  return participantsCount;
};
