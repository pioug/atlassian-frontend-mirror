import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

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
  & > * > span {
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
export const IconWrapper = styled.span(
  {
    userSelect: 'none',
  },
  IconOverrides,
  IconObjectOverrides,
);

// Wraps all emoji in Inline Links similar to icon
export const EmojiWrapper = styled.span(
  {
    display: 'inline-block',
    marginRight: token('space.025', '2px'),
    userSelect: 'none',
  },
  IconOverrides,
  IconObjectOverrides,
);

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `word-break` line breaks as soon as an overflow takes place.
export const IconTitleWrapper = styled.span({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
});

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeWrapper = styled.span({
  display: 'inline-block',
  verticalAlign: '1px',
  '& > span': {
    marginLeft: token('space.050', '4px'),
    padding: `${token('space.025', '2px')} 0 ${token('space.025', '2px')} 0`,
  },
});
// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeBlockWrapper = styled.span({
  '& > span': {
    marginLeft: token('space.050', '4px'),
    padding: `${token('space.025', '2px')} 0 ${token('space.025', '2px')} 0`,
  },
});

export const RightIconPositionWrapper = styled.span({
  marginLeft: token('space.025', '2px'),
  marginRight: token('space.050', '4px'),
  position: 'relative',
  display: 'inline-block',
});

// The following components are used to absolutely position icons in the vertical center.
// - IconPositionWrapper: the `relative` parent which has no height in itself.
// - IconEmptyWrapper: the child which forces `IconPositionWrapper` to have a height.
export const IconPositionWrapper = styled.span({
  marginRight: token('space.050', '4px'),
  position: 'relative',
  display: 'inline-block',
});

export const IconEmptyWrapper = styled.span({
  width: '14px',
  height: '100%',
  display: 'inline-block',
  opacity: 0,
});
