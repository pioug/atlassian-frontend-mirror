/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { N0, N50, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { surveyInnerWidth } from '../constants';

interface Props {
	children: React.ReactNode;
	onDismiss: () => void;
}

export default ({ children, onDismiss }: Props) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={css({
				backgroundColor: token('elevation.surface.overlay', N0),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderRadius: `${borderRadius()}px`,
				padding: token('space.300', '24px'),
				boxShadow: token('elevation.shadow.overlay', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				width: `${surveyInnerWidth}px`,
			})}
		>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={css({
					position: 'absolute',
					top: token('space.200', '16px'),
					right: token('space.200', '16px'),
				})}
			>
				<Button
					iconBefore={<CrossIcon label="" color={token('color.icon.subtle', N50)} />}
					aria-label="Dismiss"
					appearance="subtle"
					onClick={onDismiss}
				/>
			</div>
			{children}
		</div>
	);
};
