/** @jsx jsx */
import type { MouseEvent } from 'react';
import React, { useMemo, useCallback } from 'react';
import { css, jsx } from '@emotion/react';

import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import type {
  AnnotationId,
  AnnotationDataAttributes,
} from '@atlaskit/adf-schema';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState` is not object-safe
const markStyles = () => css`
  color: inherit;
  background-color: unset;
  -webkit-tap-highlight-color: transparent;

  &[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}'] {
    ${AnnotationSharedCSSByState().blur};

    &:focus,
    &[data-has-focus='true'] {
      ${AnnotationSharedCSSByState().focus};
    }
  }
`;

type MarkComponentProps = {
  id: AnnotationId;
  annotationParentIds: AnnotationId[];
  dataAttributes: AnnotationDataAttributes;
  state: AnnotationMarkStates | null;
  hasFocus: boolean;
  onClick: (props: OnAnnotationClickPayload) => void;
};
export const MarkComponent = ({
  annotationParentIds,
  children,
  dataAttributes,
  id,
  state,
  hasFocus,
  onClick,
}: React.PropsWithChildren<MarkComponentProps>) => {
  const annotationIds = useMemo(
    () => [...new Set([...annotationParentIds, id])],
    [id, annotationParentIds],
  );
  const onMarkClick = useCallback(
    (event: MouseEvent) => {
      // prevents multiple callback on overlapping annotations
      if (event.defaultPrevented || state !== AnnotationMarkStates.ACTIVE) {
        return;
      }

      // prevents from opening link URL inside webView in Safari
      event.preventDefault();

      onClick({ eventTarget: event.target as HTMLElement, annotationIds });
    },
    [annotationIds, onClick, state],
  );

  const overriddenData = !state
    ? dataAttributes
    : {
        ...dataAttributes,
        'data-mark-annotation-state': state,
        'data-has-focus': hasFocus,
      };
  const accessibility =
    state !== AnnotationMarkStates.ACTIVE
      ? { 'aria-disabled': true }
      : {
          'aria-details': annotationIds.join(', '),
        };

  return (
    <mark
      id={id}
      onClick={onMarkClick}
      {...accessibility}
      {...overriddenData}
      css={markStyles}
    >
      {children}
    </mark>
  );
};
