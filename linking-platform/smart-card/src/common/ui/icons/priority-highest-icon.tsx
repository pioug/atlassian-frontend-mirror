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

const PriorityHighestIcon: {
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
				d="M12.005 8.187l-6.453 3.865a1 1 0 01-1.028-1.716l6.97-4.174a1 1 0 011.031.002l6.906 4.174a1 1 0 11-1.035 1.712l-6.39-3.863z"
				fill="#FF5630"
			/>
			<path
				d="M5.552 18.054a1 1 0 11-1.028-1.715l6.97-4.174a1 1 0 011.031.002l6.906 4.174a1 1 0 11-1.035 1.711l-6.39-3.862-6.454 3.864z"
				fill="#FF7452"
			/>
		</svg>
	</span>
);

PriorityHighestIcon.displayName = 'PriorityHighestIcon';

export default PriorityHighestIcon;
