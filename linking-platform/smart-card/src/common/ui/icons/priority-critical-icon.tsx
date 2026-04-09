/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';

export interface PriorityIconProps {
	[key: string]: any;
	label?: string;
	testId?: string;
}

const style = cssMap({
	span: { display: 'inline-block', flexShrink: 0 },
	svg: { verticalAlign: 'bottom', maxWidth: '100%', maxHeight: '100%' },
});

const PriorityCriticalIcon: {
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
				d="M4.671 7.165l6.643-3.946a1.372 1.372 0 011.403.002l6.614 3.944c.415.247.669.695.669 1.178v11.253a1.372 1.372 0 01-2.074 1.179l-5.91-3.52-5.944 3.526A1.372 1.372 0 014 19.6V8.345c0-.484.255-.933.671-1.18z"
				fill="#FF5630"
			/>
		</svg>
	</span>
);

PriorityCriticalIcon.displayName = 'PriorityCriticalIcon';

export default PriorityCriticalIcon;
