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

const PriorityMediumIconLegacy: {
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
				d="M5 8h14a1 1 0 010 2H5a1 1 0 110-2zm0 6h14a1 1 0 010 2H5a1 1 0 010-2z"
				fill="#FFAB00"
			/>
		</svg>
	</span>
);

PriorityMediumIconLegacy.displayName = 'PriorityMediumIcon';

const _default_1: FC<Omit<PriorityIconProps, 'ref'> & Omit<PriorityIconProps, 'ref'>> =
	componentWithFG(
		'platform_sl_icons_refactor',
		createPriorityIcon('PriorityMediumIcon', [
			{
				d: 'M5 8h14a1 1 0 010 2H5a1 1 0 110-2zm0 6h14a1 1 0 010 2H5a1 1 0 010-2z',
				fill: '#FFAB00',
			},
		]),
		PriorityMediumIconLegacy,
	);
export default _default_1;
