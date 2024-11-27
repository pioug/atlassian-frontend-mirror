/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Stack from '@atlaskit/primitives/stack';
import { token } from '@atlaskit/tokens';

export default () => {
	return (
		<Stack space="space.100" testId="typography">
			<span style={{ font: token('font.heading.xxlarge') }}>font.heading.xxlarge</span>
			<span style={{ font: token('font.heading.xlarge') }}>font.heading.xlarge</span>
			<span style={{ font: token('font.heading.large') }}>font.heading.large</span>
			<span style={{ font: token('font.heading.medium') }}>font.heading.medium</span>
			<span style={{ font: token('font.heading.small') }}>font.heading.small</span>
			<span style={{ font: token('font.heading.xsmall') }}>font.heading.xsmall</span>
			<span style={{ font: token('font.heading.xxsmall') }}>font.heading.xxsmall</span>

			<span style={{ font: token('font.body.large') }}>font.body.large</span>
			<span style={{ font: token('font.body') }}>font.body</span>
			<span style={{ font: token('font.body.small') }}>font.body.small</span>
			<span style={{ font: token('font.code') }}>font.code</span>
		</Stack>
	);
};
