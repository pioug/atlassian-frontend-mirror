import React from 'react';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common/styles';
import { ReactNodeView, ForwardRef } from '../../../nodeviews';

export class AnnotationNodeView extends ReactNodeView {
  createDomRef() {
    return document.createElement('span');
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.className = 'ak-editor-annotation';
    return { dom };
  }

  render(_props: {}, forwardRef: ForwardRef) {
    return (
      // all inline comment states are now set in decorations at ../pm-plugins/inline-comment.ts
      <span data-mark-type="annotation" ref={forwardRef} />
    );
  }
}

export const getAnnotationViewClassname = (
  isUnresolved: boolean,
  hasFocus: boolean,
): string | undefined => {
  if (!isUnresolved) {
    return;
  }

  return hasFocus
    ? AnnotationSharedClassNames.focus
    : AnnotationSharedClassNames.blur;
};
