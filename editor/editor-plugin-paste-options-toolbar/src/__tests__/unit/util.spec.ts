// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { a, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { hasLinkMark } from '../../util';

describe('hasLinkMark', () => {
  it('should return true if input slice has a link mark', () => {
    const link = 'https://jira.atlassian.com/browse/JRACLOUD-72631';
    const state = createEditorState(doc(p(a({ href: link })('Hello, World!'))));

    const sliceWithLinkMark = state.doc.slice(0, state.doc.content.size);
    expect(hasLinkMark(sliceWithLinkMark)).toEqual(true);
  });

  it('should return false if input slice does not have a link mark', () => {
    const state = createEditorState(doc(p('Hello, World!')));

    const sliceWithoutLinkMark = state.doc.slice(0, state.doc.content.size);
    expect(hasLinkMark(sliceWithoutLinkMark)).toEqual(false);
  });
});
