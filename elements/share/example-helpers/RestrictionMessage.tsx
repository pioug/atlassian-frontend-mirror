/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import LockFilledIcon from '@atlaskit/icon/core/lock-locked';
import { token } from '@atlaskit/tokens';

const message = 'Restrictions on this page may prevent people from viewing or editing';

export default () => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			maxWidth: '100%',
			color: `${token('color.text.danger', '#de350c')}`,
			display: 'flex',
			'& > div': {
				flexGrow: 1,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 24,
			},
		}}
	>
		<LockFilledIcon color="currentColor" spacing="spacious" label={message} /> <div>{message}</div>
	</div>
);
