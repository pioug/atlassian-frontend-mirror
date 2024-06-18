/**@jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const message = 'Anyone can view';

export default () => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			maxWidth: '100%',
			lineHeight: `${token('space.500', '40px')}`,
			color: `${token('color.text.subtle', N300)}`,
		}}
	>
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={{
				position: 'relative',
				bottom: `${token('space.050', '4px')}`,
			}}
		>
			{message}
		</span>
		<UnlockIcon size="medium" label={message} />
	</div>
);
