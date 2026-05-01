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

const PriorityLowIconLegacy: {
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
				d="M11.996 13.861l6.454-3.865a1 1 0 111.027 1.716l-6.97 4.174a1 1 0 01-1.03-.002L4.57 11.71A1 1 0 015.606 10l6.39 3.862z"
				fill="#0065FF"
			/>
		</svg>
	</span>
);

PriorityLowIconLegacy.displayName = 'PriorityLowIcon';

const _default_1: FC<Omit<PriorityIconProps, 'ref'> & Omit<PriorityIconProps, 'ref'>> =
	componentWithFG(
		'platform_sl_icons_refactor',
		createPriorityIcon('PriorityLowIcon', [
			{
				d: 'M11.996 13.861l6.454-3.865a1 1 0 111.027 1.716l-6.97 4.174a1 1 0 01-1.03-.002L4.57 11.71A1 1 0 015.606 10l6.39 3.862z',
				fill: '#0065FF',
			},
		]),
		PriorityLowIconLegacy,
	);
export default _default_1;
