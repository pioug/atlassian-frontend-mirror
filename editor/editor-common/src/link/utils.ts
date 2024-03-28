import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { Predicate } from '../types';

import {
  productionLinkPreferencesUrl,
  stagingLinkPreferencesUrl,
} from './constants';

export function isTextAtPos(pos: number): Predicate {
  return (state: EditorState) => {
    const node = state.doc.nodeAt(pos);
    return !!node && node.isText;
  };
}

export function isLinkAtPos(pos: number): Predicate {
  return (state: EditorState) => {
    const node = state.doc.nodeAt(pos);
    return !!node && !!state.schema.marks.link.isInSet(node.marks);
  };
}

export const getLinkPreferencesURLFromENV = ():
  | typeof productionLinkPreferencesUrl
  | typeof stagingLinkPreferencesUrl => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.CLOUD_ENV === 'staging'
  ) {
    // only a production CLOUD_ENV staging environment has a different link preferences URL
    return stagingLinkPreferencesUrl;
  } else if (process.env.NODE_ENV === 'production') {
    return productionLinkPreferencesUrl;
  } else {
    return stagingLinkPreferencesUrl;
  }
};
