/** @jsx jsx */

import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { cssVar } from '../../../constants';

interface BeforeProps {
	elemBefore?: ReactNode;
}

const beforeElementStyles = css({
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `var(${cssVar.borderRadius})`,
	insetBlockStart: token('space.0', '0px'),
});

const Before = ({ elemBefore }: BeforeProps) =>
	elemBefore ? <span css={beforeElementStyles}>{elemBefore}</span> : null;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Before;
