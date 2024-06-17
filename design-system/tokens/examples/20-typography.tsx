// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Stack from '@atlaskit/primitives/stack';

import { token } from '../src';

const fonts = [
	'font.heading.xxlarge',
	'font.heading.xlarge',
	'font.heading.large',
	'font.heading.medium',
	'font.heading.small',
	'font.heading.xsmall',
	'font.heading.xxsmall',
] as const;

const body = ['font.body.large', 'font.body', 'font.body.small', 'font.code'] as const;

export default () => {
	return (
		<Stack space="space.100" testId="typography">
			{fonts.map((f) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<span key={f} style={{ font: token(f) }}>
					{f}
				</span>
			))}
			{body.map((f) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<span key={f} style={{ font: token(f) }}>
					{f}
				</span>
			))}
		</Stack>
	);
};
