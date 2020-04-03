import styled, { ThemedOuterStyledProps } from 'styled-components';

import { HTMLAttributes, ComponentClass, LiHTMLAttributes } from 'react';
import { N20, N40, B400, B50 } from '@atlaskit/theme/colors';

export const FilmStripViewWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
  padding: 3px 0;
  border-radius: 3px;

  &:hover .arrow {
    opacity: 1;
  }

  .ellipsed-text {
    white-space: initial;
  }
`;

export const FilmStripListWrapper: ComponentClass<HTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.div`
  width: inherit;
  overflow: hidden;
  padding: 2px 0;
`;

export const FilmStripList: ComponentClass<HTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.ul`
  margin: 0;
  padding: 0;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  white-space: nowrap;
  display: inline-block;
`;

export const FilmStripListItem: ComponentClass<LiHTMLAttributes<{}>> = styled.li`
  list-style-type: none;
  margin: 0;
  padding: 0 4px;
  display: inline-block;
  vertical-align: middle;
  /* Fixes issue with child Cards using inline-block */
  font-size: 0;
`;

export const ArrowWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${N20};
  border-radius: 100%;
  display: flex;
  cursor: pointer;
  transition: opacity 0.3s;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.6);
  color: black;
  width: 30px;
  height: 30px;
  justify-content: center;
  opacity: 0;

  &:hover {
    color: black;
    background-color: ${N40};
  }

  &:active {
    color: ${B400};
    background-color: ${B50};
  }

  svg {
    height: 30px;
    width: 20px;
  }
`;

export const ArrowLeftWrapper: ComponentClass<HTMLAttributes<{}>> = styled(
  ArrowWrapper,
)`
  left: 8px;

  svg {
    padding-right: 2px;
  }
`;

export const ArrowRightWrapper: ComponentClass<HTMLAttributes<{}>> = styled(
  ArrowWrapper,
)`
  right: 8px;

  svg {
    padding-left: 1px;
  }
`;

export const Shadow: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  z-index: 10;
  height: 100%;
  top: 0;
  width: 2px;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ShadowLeft: ComponentClass<HTMLAttributes<{}>> = styled(Shadow)`
  left: 0;
`;

export const ShadowRight: ComponentClass<HTMLAttributes<{}>> = styled(Shadow)`
  right: 0;
`;
