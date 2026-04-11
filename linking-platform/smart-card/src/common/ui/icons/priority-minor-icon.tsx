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

const PriorityMinorIcon: {
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
				d="M18.449 14.975a1 1 0 011.027 1.716l-6.97 4.173a1 1 0 01-1.03-.002L4.57 16.69a1 1 0 011.034-1.712l6.391 3.862 6.454-3.864z"
				fill="#0065FF"
			/>
			<path
				d="M11.995 12.837l6.454-3.865a1 1 0 011.027 1.716l-6.97 4.174a1 1 0 01-1.03-.002L4.57 10.686a1 1 0 011.034-1.712l6.391 3.863z"
				fill="#2684FF"
			/>
			<path
				d="M11.995 6.823l6.454-3.865a1 1 0 111.027 1.716l-6.97 4.174a1 1 0 01-1.03-.002L4.57 4.672A1 1 0 015.604 2.96l6.391 3.863z"
				fill="#4C9AFF"
			/>
		</svg>
	</span>
);

PriorityMinorIcon.displayName = 'PriorityMinorIcon';

export default PriorityMinorIcon;
