/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { createPriorityIcon } from './priority-icon';

export interface PriorityIconProps {
	[key: string]: any;
	label?: string;
	testId?: string;
}

const style = cssMap({
	span: { display: 'inline-block', flexShrink: 0 },
	svg: { verticalAlign: 'bottom', maxWidth: '100%', maxHeight: '100%' },
});

const PriorityHighIconLegacy: {
	({ label, testId, ...props }: PriorityIconProps): JSX.Element;
	displayName: string;
} = ({ label, testId, ...props }: PriorityIconProps): JSX.Element => (
	<span
		role={label ? 'img' : undefined}
		aria-label={label}
		aria-hidden={label ? undefined : true}
		data-testid={testId}
		css={style.span}
		{...props}
	>
		<svg width="24" height="24" viewBox="0 0 24 24" role="presentation" css={style.svg}>
			<path
				d="M12.017 11.182l-6.454 3.865a1 1 0 11-1.027-1.716l6.97-4.174a1 1 0 011.03.003l6.906 4.173a1 1 0 01-1.035 1.712l-6.39-3.863z"
				fill="#FF5630"
			/>
		</svg>
	</span>
);

PriorityHighIconLegacy.displayName = 'PriorityHighIcon';

const _default_1: FC<Omit<PriorityIconProps, 'ref'> & Omit<PriorityIconProps, 'ref'>> =
	componentWithFG(
		'platform_sl_icons_refactor',
		createPriorityIcon('PriorityHighIcon', [
			{
				d: 'M12.017 11.182l-6.454 3.865a1 1 0 11-1.027-1.716l6.97-4.174a1 1 0 011.03.003l6.906 4.173a1 1 0 01-1.035 1.712l-6.39-3.863z',
				fill: '#FF5630',
			},
		]),
		PriorityHighIconLegacy,
	);
export default _default_1;
