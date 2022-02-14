import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

const placeholderShimmer = keyframes`
  0% {
    background-position: -20px 0;
  }

  100% {
    background-position: 20px 0;
  }
`;

// TODO: Figure out a more scalable/responsive solution
// for vertical alignment.
// Current rationale: vertically positioned at the top of
// the smart card container (when set to 0). Offset this
// to position it with appropriate whitespace from the top.
export const Icon = styled.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
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
  margin-right: -2px;
`;

export const Shimmer = styled.span`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  border-radius: 2px;
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 40px 14px;
  display: inline-block;

  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${placeholderShimmer};
  animation-timing-function: linear;
`;
