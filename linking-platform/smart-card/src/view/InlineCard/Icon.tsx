import styled from '@emotion/styled';

import { Skeleton } from '@atlaskit/linking-common';
import { token } from '@atlaskit/tokens';
import React from 'react';

// TODO: Figure out a more scalable/responsive solution
// for vertical alignment.
// Current rationale: vertically positioned at the top of
// the smart card container (when set to 0). Offset this
// to position it with appropriate whitespace from the top.
export const Icon = styled.img`
  height: 14px;
  width: 14px;
  margin-right: ${token('space.050', '4px')};
  border-radius: 2px;
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// Used for 'untrue' icons which claim to be 16x16 but
// are less than that in height/width.
// TODO: Replace this override with proper AtlasKit solution.
export const AKIconWrapper = styled.span`
  margin-right: calc(-1 * ${token('space.025', '2px')});
`;

export const Shimmer = ({ testId }: { testId: string }) => {
  const skeletonCustomStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    marginRight: 4,
  };

  return (
    <Skeleton
      width={14}
      height={14}
      borderRadius={2}
      testId={testId}
      style={skeletonCustomStyles}
    />
  );
};
