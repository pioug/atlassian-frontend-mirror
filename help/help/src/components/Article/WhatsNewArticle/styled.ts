/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewTypeTitle = styled.span({
	textDecoration: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N300),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body', fontFallback.body.medium),
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewIconContainer = styled.div({
	display: 'block',
	paddingBottom: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewTitleText = styled.span({
	textDecoration: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N800),
	font: token('font.body'),
	fontWeight: token('font.weight.semibold'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
	paddingBottom: token('space.100', '8px'),
	display: 'block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewRelatedLinksTitleText = styled.span({
	textDecoration: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N800),
	font: token('font.body.small'),
	fontWeight: token('font.weight.semibold'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
	paddingBottom: token('space.100', '8px'),
	display: 'block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const RelatedLinkContainer = styled.div({
	marginBottom: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ExternalLinkIconContainer = styled.div({
	display: 'inline-block',
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
});
