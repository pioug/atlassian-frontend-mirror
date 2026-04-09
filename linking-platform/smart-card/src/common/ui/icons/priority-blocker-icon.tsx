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

const PriorityBlockerIcon: {
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
				d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM6 11a1 1 0 000 2h12a1 1 0 000-2H6z"
				fill="#FF5630"
			/>
		</svg>
	</span>
);

PriorityBlockerIcon.displayName = 'PriorityBlockerIcon';

export default PriorityBlockerIcon;
