/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import {
  alignmentPositionMap,
  AlignmentAttributes,
} from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

type MarkWrapperProps = {
  'data-align': AlignmentAttributes['align'];
};

const MarkWrapper: React.FC<
  MarkWrapperProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const styles = props['data-align']
    ? css`
        text-align: ${alignmentPositionMap[props['data-align']]};
      `
    : '';
  return (
    <div css={styles} {...props}>
      {props.children}
    </div>
  );
};

export default function Alignment(props: MarkProps<AlignmentAttributes>) {
  return (
    <MarkWrapper
      className="fabric-editor-block-mark fabric-editor-alignment"
      data-align={props.align}
    >
      {props.children}
    </MarkWrapper>
  );
}
