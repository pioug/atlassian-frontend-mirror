/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Switcher from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';

import Button from '../src';

const Component = React.forwardRef((props, ref: React.Ref<HTMLElement>) => (
	<header
		{...props}
		ref={ref}
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.accent.red.subtler'),
		}}
	/>
));

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div className="sample">
		<Button iconBefore={<Switcher label="" />} component={Component}>
			App Switcher custom component
		</Button>
	</div>
);
