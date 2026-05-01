// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponentClass } from 'styled-components';
import { token } from '@atlaskit/tokens';
import type { HTMLAttributes, DetailedHTMLProps } from 'react';

// eslint-disable-next-line no-barrel-files/no-barrel-files
export { ResultItemAfter } from './result-item-after';
// eslint-disable-next-line no-barrel-files/no-barrel-files
export { ResultItemAfterWrapper } from './result-item-after-wrapper';
// eslint-disable-next-line no-barrel-files/no-barrel-files
export { ResultItemIcon } from './result-item-icon';
// eslint-disable-next-line no-barrel-files/no-barrel-files
export { ResultItemTextAfter } from './result-item-text-after';

// Copied from `@atlaskit/theme` to allow removal of that package
const N200 = '#6B778C';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemCaption: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.span({
	color: N200,
	font: token('font.body.small'),
	marginLeft: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemSubText: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.span({
	font: token('font.body.small'),
	color: N200,
});
