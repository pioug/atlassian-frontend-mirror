// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// Wraps all icons represented in Inline Links. Icons have three sources/types:
// - JSON-LD: from the generator.icon property coming back from ORS.
// - @atlaskit/icon: for lock icons, unauthorized, etc.
// - @atlaskit/icon-object: for object icons, e.g. repository, branch, etc.
// NB: the first set of overrides style icons imported from @atlaskit/icon-object correctly.
// NB: the second set of overrides style icons imported from @atlaskit/icon correctly.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766

// TODO: remove this override behaviour for @atlaskit/icon-object
export const IconObjectOverrides = `
  & > span {
    height: 16px;
    width: 16px;
    position: absolute;
    top: 3px;
    left: 0;
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
    width: 16px;
    position: absolute;
    left: 0;
    & > svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconWrapper = styled.span(
	{
		userSelect: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	IconOverrides,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	IconObjectOverrides,
);

// Wraps all emoji in Inline Links similar to icon
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EmojiWrapper = styled.span(
	{
		display: 'inline-block',
		marginRight: token('space.025', '2px'),
		userSelect: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	IconOverrides,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	IconObjectOverrides,
);

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `word-break` line breaks as soon as an overflow takes place.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconTitleWrapper = styled.span({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
	boxDecorationBreak: 'clone',
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

// TODO: Replace overrides with proper AtlasKit solution.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LozengeWrapper = styled.span({
	display: 'inline-block',
	verticalAlign: '1px',
	margin: `0 ${token('space.050', '4px')} 0 ${token('space.025', '2px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const RightIconPositionWrapper = styled.span({
	marginLeft: token('space.025', '2px'),
	position: 'relative',
	display: 'inline-block',
});

// The following components are used to absolutely position icons in the vertical center.
// - IconPositionWrapper: the `relative` parent which has no height in itself.
// - IconEmptyWrapper: the child which forces `IconPositionWrapper` to have a height.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconPositionWrapper = styled.span({
	marginRight: token('space.050', '4px'),
	position: 'relative',
	display: 'inline-block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconEmptyWrapper = styled.span({
	width: '16px',
	height: '100%',
	display: 'inline-block',
	opacity: 0,
});

// With emotion it's not possible to use reference to `TitleWrapper` as part of a selector,
// To achieve same result we use classname instead.
export const TitleWrapperClassName = 'smart-link-title-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-empty-styled-expression -- Ignored via go/DSP-18766
export const TitleWrapper = styled.span({});
