/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

import { css, jsx, type StrictXCSSProp } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { token } from '@atlaskit/tokens';
import Tooltip, { type TriggerProps } from '@atlaskit/tooltip';

import { type BreadcrumbsItemProps } from '../../types';

import Step from './step';

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	alignItems: 'center',
	flexDirection: 'row',
	alignSelf: 'center',
	fontFamily: token('font.family.body'),
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
	'&::after': {
		width: '8px',
		flexShrink: 0,
		alignSelf: 'baseline',
		color: token('color.text.subtlest'),
		content: '"/"',
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
});

export type BreadcrumbsItemBaseProps = Pick<
	BreadcrumbsItemProps,
	| 'analyticsContext'
	| 'aria-label'
	| 'aria-labelledby'
	| 'elemBefore'
	| 'href'
	| 'iconAfter'
	| 'iconBefore'
	| 'onClick'
	| 'target'
	| 'testId'
	| 'text'
	| 'title'
	| 'truncationWidth'
> & {
	'aria-current'?: 'page' | boolean;
	/**
	 * Ref for measuring the rendered control.
	 */
	stepRef?: Ref<HTMLElement>;
	/**
	 * Bounded style overrides applied to the wrapping list item.
	 */
	xcss?: StrictXCSSProp<'display', never>;
	/**
	 * Controls whether a tooltip is shown around the item text.
	 */
	shouldShowTooltip?: boolean;
	onTooltipShown?: () => void;
};

const BreadcrumbsItemBase: import('react').ForwardRefExoticComponent<
	import('react').PropsWithoutRef<BreadcrumbsItemBaseProps> &
		import('react').RefAttributes<HTMLLIElement>
> = forwardRef<HTMLLIElement, BreadcrumbsItemBaseProps>(
	(
		{
			analyticsContext,
			elemBefore,
			href,
			iconAfter,
			iconBefore,
			onClick,
			onTooltipShown,
			target,
			testId,
			text,
			title,
			truncationWidth,
			shouldShowTooltip,
			stepRef,
			xcss,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			'aria-current': ariaCurrent,
		},
		ref,
	) => {
		const resolvedElemBefore = elemBefore ?? iconBefore;

		const renderStep = (triggerProps?: TriggerProps) => {
			const { ref: tooltipRef, testId: _testId, ...tooltipTriggerProps } = triggerProps ?? {};
			return (
				<Step
					ref={tooltipRef ? mergeRefs<HTMLElement>([stepRef, tooltipRef]) : stepRef}
					analyticsContext={analyticsContext}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					aria-current={ariaCurrent}
					elemBefore={resolvedElemBefore}
					href={href}
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					onClick={onClick}
					target={target}
					testId={testId}
					title={title}
					triggerProps={triggerProps ? tooltipTriggerProps : undefined}
					truncationWidth={truncationWidth}
				>
					{text}
				</Step>
			);
		};

		const step = renderStep();

		return (
			<li
				css={itemWrapperStyles}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- required for public xcss passthrough
				className={xcss}
			>
				{shouldShowTooltip ? (
					<Tooltip content={text} position="bottom" onShow={onTooltipShown}>
						{renderStep}
					</Tooltip>
				) : (
					step
				)}
			</li>
		);
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItemBase;
