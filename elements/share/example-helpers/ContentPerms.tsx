/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import UnlockIcon from '@atlaskit/icon/core/lock-unlocked';
import { token } from '@atlaskit/tokens';

const message = 'Anyone can view';

export default (): jsx.JSX.Element => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			maxWidth: '100%',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${token('space.500')}`,
			color: `${token('color.text.subtle')}`,
		}}
	>
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={{
				position: 'relative',
				bottom: `${token('space.050')}`,
			}}
		>
			{message}
		</span>
		<UnlockIcon color="currentColor" spacing="spacious" label={message} />
	</div>
);
