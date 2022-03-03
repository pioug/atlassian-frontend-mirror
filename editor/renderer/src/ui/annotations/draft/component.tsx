/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';

import { InsertDraftPosition, Position } from '../types';
import { AnnotationsDraftContext } from '../context';
import { splitText, calcTextSplitOffset } from './text';
import { calcInsertDraftPositionOnText } from './position';
import { dataAttributes } from './dom';

import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import { ThemeProps } from '@atlaskit/theme/types';

const markStyles = (props: ThemeProps) => css`
  color: inherit;
  background-color: unset;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  ${AnnotationSharedCSSByState(props).focus};
`;

export const AnnotationDraft: React.FC<{ draftPosition: Position }> = ({
  draftPosition,
  children,
}) => {
  return (
    <mark
      data-renderer-mark={true}
      {...dataAttributes(draftPosition)}
      css={markStyles}
    >
      {children}
    </mark>
  );
};

type ApplyAnnotationsProps = {
  texts: string[];
  shouldApplyAnnotationAt:
    | InsertDraftPosition.INSIDE
    | InsertDraftPosition.START
    | InsertDraftPosition.END;
  draftPosition: Position;
};

export const getAnnotationIndex = (
  annotationPosition: InsertDraftPosition,
  fragmentCount: number,
): number => {
  if (annotationPosition === InsertDraftPosition.START) {
    return 0;
  }

  if (annotationPosition === InsertDraftPosition.END) {
    return fragmentCount - 1;
  }

  if (
    annotationPosition === InsertDraftPosition.INSIDE &&
    fragmentCount === 3
  ) {
    return 1;
  }

  return -1;
};

export const applyAnnotationOnText = ({
  texts,
  shouldApplyAnnotationAt,
  draftPosition,
}: ApplyAnnotationsProps): JSX.Element[] => {
  const annotateIndex = getAnnotationIndex(
    shouldApplyAnnotationAt,
    texts.length,
  );

  return texts.map((value, index) => {
    if (annotateIndex === index) {
      return (
        <AnnotationDraft key={index} draftPosition={draftPosition}>
          {value}
        </AnnotationDraft>
      );
    }

    return <React.Fragment key={index}>{value}</React.Fragment>;
  });
};

type Props = {
  startPos: number;
  endPos: number;
  children: string;
};

export const TextWithAnnotationDraft: React.FC<Props> = ({
  startPos,
  endPos,
  children,
}: Props) => {
  const textPosition = React.useMemo(
    () => ({
      start: startPos,
      end: endPos,
    }),
    [endPos, startPos],
  );
  const nextDraftPosition = React.useContext(AnnotationsDraftContext);
  const shouldApplyAnnotationAt = React.useMemo(() => {
    if (!nextDraftPosition) {
      return false;
    }

    return calcInsertDraftPositionOnText(textPosition, nextDraftPosition);
  }, [nextDraftPosition, textPosition]);

  if (shouldApplyAnnotationAt === false || !nextDraftPosition) {
    return <Fragment>{children}</Fragment>;
  }

  if (shouldApplyAnnotationAt === InsertDraftPosition.AROUND_TEXT) {
    return (
      <AnnotationDraft key={0} draftPosition={nextDraftPosition}>
        {children}
      </AnnotationDraft>
    );
  }

  const offsets = calcTextSplitOffset(
    nextDraftPosition,
    textPosition,
    children,
  );
  const texts = splitText(children, offsets);
  if (!texts) {
    return <Fragment>{children}</Fragment>;
  }

  const components = applyAnnotationOnText({
    texts,
    shouldApplyAnnotationAt,
    draftPosition: nextDraftPosition,
  });

  return <Fragment>{components}</Fragment>;
};
