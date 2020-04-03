import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

// TODO: remove this override behaviour for @atlaskit/icon-object
export const IconObjectOverrides = `
  & > span {
    height: 16px;
    width: 14px;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 14px;
    & > svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
// TODO: remove this override behaviour for @atlaskit/icon
export const IconOverrides = `
  & > span > span {
    height: 16px;
    width: 14px;
    position: absolute;
    top: 0;
    left: 0;
    & > svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

// Wraps all icons represented in Inline Links. Icons have three sources/types:
// - JSON-LD: from the generator.icon property coming back from ORS.
// - @atlaskit/icon: for lock icons, unauthorized, etc.
// - @atlaskit/icon-object: for object icons, e.g. repository, branch, etc.
// NB: the first set of overrides style icons imported from @atlaskit/icon-object correctly.
// NB: the second set of overrides style icons imported from @atlaskit/icon correctly.
export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  user-select: none;
  ${IconOverrides}
  ${IconObjectOverrides}
`;

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `hyphens` enables hyphenation on word break.
export const IconTitleWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  hyphens: auto;
`;

export const IconTitleHeadNoBreakWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  overflow-wrap: break-word;
`;

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-block;
  vertical-align: 1px;
  & > span {
    margin-left: 4px;
    padding: 2px 0 1px 0;
  }
`;

// The following components are used to absolutely position icons in the vertical center.
// - IconPositionWrapper: the `relative` parent which has no height in itself.
// - IconEmptyWrapper: the child which forces `IconPositionWrapper` to have a height.
export const IconPositionWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-right: 4px;
  position: relative;
  display: inline-block;
`;
export const IconEmptyWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  width: 14px;
  height: 100%;
  display: inline-block;
  opacity: 0;
`;
