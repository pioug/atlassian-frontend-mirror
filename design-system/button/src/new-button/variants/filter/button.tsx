/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { type ButtonProps } from '../default/button';
import ButtonBase from '../shared/button-base';
import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';

export type FilterButtonProps = Omit<ButtonProps, 'appearance' | 'iconAfter' | 'children'> & {
	/**
	 * The visible button label. Omit for icon-only controls and provide an
	 * accessible name using `aria-label` or `aria-labelledby` instead.
	 */
	children?: React.ReactNode;
	/**
	 * Whether to show a trailing chevron down icon.
	 * @default true
	 */
	hasChevronDown?: boolean;
	/**
	 * The count displayed after the label. Pass a formatted string, such as "99+",
	 * to abbreviate a count. Zero is displayed; omit the prop to hide the metric.
	 */
	trailingMetric?: string | number;
};

// Custom properties let the pill respond to the actual button's interaction states,
// without nested selectors or a second set of pointer/keyboard handlers.
// These properties are outside @atlaskit/css's bounded property set.
// Compiled's style constraint needs a shared CSS property for custom-property-only maps.
// Disallow color: these maps must not override the button's text treatment.
type MetricSurfaceProperties = {
	color?: never;
	'--ds-filter-button-metric-background'?: string;
	'--ds-filter-button-metric-text'?: string;
};
type MetricSurfaceStyle = MetricSurfaceProperties & {
	'&:hover'?: MetricSurfaceProperties;
	'&:active'?: MetricSurfaceProperties;
};
const metricSurfaceStyles = unboundedCssMap<
	Record<'information' | 'neutral' | 'interactive' | 'selected' | 'disabled', MetricSurfaceStyle>
>({
	information: {
		'--ds-filter-button-metric-background': token('color.background.information.subtle'),
		'--ds-filter-button-metric-text': token('color.text.information.bolder'),
	},
	neutral: {
		'--ds-filter-button-metric-background': token('color.background.accent.gray.subtler'),
		'--ds-filter-button-metric-text': token('color.text'),
	},
	interactive: {
		'&:hover': {
			'--ds-filter-button-metric-background': token('color.background.neutral.hovered'),
		},
		'&:active': {
			'--ds-filter-button-metric-background': token('color.background.neutral.hovered'),
		},
	},
	selected: {
		'--ds-filter-button-metric-background': token('color.background.neutral.hovered'),
	},
	disabled: {
		'--ds-filter-button-metric-background': token('color.background.disabled'),
		'--ds-filter-button-metric-text': token('color.text.disabled'),
	},
});

const styles = cssMap({
	iconOnly: {
		alignItems: 'center',
	},
	iconOnlyContent: {
		display: 'flex',
	},
	content: {
		display: 'inline-flex',
		alignItems: 'center',
		columnGap: token('space.100'),
		maxWidth: '100%',
		verticalAlign: 'bottom',
	},
});

const semanticStyles = cssMap({
	content: {
		columnGap: token('space.gap.medium'),
	},
});

// Bounded margin values accept tokens only. These calculations preserve the minimum
// label/count gap after ButtonBase adds its own slot gap.
const metricSpacingStyles = unboundedCssMap({
	withIcons: {
		marginInlineStart: `calc(${token('space.100')} - ${token('space.075')})`,
	},
	withoutIcons: {
		marginInlineStart: `calc(${token('space.100')} - ${token('space.050')})`,
	},
	semanticWithIcons: {
		marginInlineStart: `calc(${token('space.gap.medium')} - ${token('space.gap.small')})`,
	},
	semanticWithoutIcons: {
		marginInlineStart: `calc(${token('space.gap.medium')} - ${token('space.gap.xsmall')})`,
	},
});

// Match Badge/new's geometry and Text typography without importing the Badge package.
// var() values consume the private host surface properties above.
const metricStyles = unboundedCssMap({
	root: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: token('space.300'),
		justifyContent: 'center',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('radius.xsmall'),
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockStart: token('space.0'),
		paddingBlockEnd: token('space.0'),
		backgroundColor: 'var(--ds-filter-button-metric-background)',
		color: 'var(--ds-filter-button-metric-text)',
	},
});

const semanticMetricStyles = cssMap({
	root: {
		paddingInlineStart: token('space.inset.xsmall'),
		paddingInlineEnd: token('space.inset.xsmall'),
		paddingBlockStart: token('space.0'),
		paddingBlockEnd: token('space.0'),
	},
});

/**
 * __Filter button__
 *
 * A default-appearance button with a built-in trailing count for filter controls.
 * Unselected counts are neutral. Selected counts are information blue with Finesse off
 * and neutral when it is on.
 * Use it as a DropdownMenu custom trigger to compose a filter menu.
 */
const FilterButton: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<
		React.PropsWithoutRef<FilterButtonProps> & React.RefAttributes<HTMLButtonElement>
	>
> = React.memo(
	React.forwardRef<HTMLButtonElement, FilterButtonProps>(function FilterButton(
		{
			children,
			trailingMetric,
			iconBefore,
			hasChevronDown = true,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			isLoading = false,
			isDisabled = false,
			isSelected = false,
			type = 'button',
			...rest
		},
		ref,
	) {
		const finesseEnabled = fg('platform-dst-tokens-finesse');
		const isInteractive = !isDisabled && !isLoading;
		const isInformationMetric = !finesseEnabled && isSelected;
		const hasLabel = React.Children.toArray(children).some((child) => child !== '');
		const hasIcons = Boolean(iconBefore) || hasChevronDown;
		const semanticSpacingEnabled = fg('platform-semantic-spacing');
		const metric =
			trailingMetric !== undefined ? (
				<span
					css={[
						metricStyles.root,
						semanticSpacingEnabled && semanticMetricStyles.root,
						hasLabel && hasIcons && metricSpacingStyles.withIcons,
						hasLabel && !hasIcons && metricSpacingStyles.withoutIcons,
						hasLabel && semanticSpacingEnabled && hasIcons && metricSpacingStyles.semanticWithIcons,
						hasLabel &&
							semanticSpacingEnabled &&
							!hasIcons &&
							metricSpacingStyles.semanticWithoutIcons,
					]}
					data-testid={rest.testId && `${rest.testId}--metric`}
				>
					<Text size="small" align="center" color="inherit">
						{trailingMetric}
					</Text>
				</span>
			) : null;

		return (
			<ButtonBase
				{...rest}
				ref={ref}
				appearance="default"
				ariaLabel={ariaLabel}
				ariaLabelledBy={ariaLabelledBy}
				isLoading={isLoading}
				isDisabled={isDisabled}
				isSelected={isSelected}
				hasIconBefore={Boolean(iconBefore)}
				hasIconAfter={hasChevronDown}
				type={type}
				componentName="FilterButton"
				rootXcss={cx(
					!hasLabel && styles.iconOnly,
					isInformationMetric && isInteractive && metricSurfaceStyles.information,
					!isInformationMetric && isInteractive && metricSurfaceStyles.neutral,
					!isInformationMetric && isInteractive && metricSurfaceStyles.interactive,
					finesseEnabled && isSelected && isInteractive && metricSurfaceStyles.selected,
					!isInteractive && metricSurfaceStyles.disabled,
				)}
			>
				{iconBefore && (
					<Content type="icon" position="before" isLoading={isLoading}>
						<IconRenderer icon={iconBefore} />
					</Content>
				)}
				{hasLabel && <Content isLoading={isLoading}>{children}</Content>}
				{hasLabel && metric && (
					<Content type="icon" position="after" isLoading={isLoading}>
						{metric}
					</Content>
				)}
				{!hasLabel && metric && (
					<Content isLoading={isLoading}>
						<span
							css={[
								styles.content,
								semanticSpacingEnabled && semanticStyles.content,
								styles.iconOnlyContent,
							]}
						>
							{metric}
						</span>
					</Content>
				)}
				{hasChevronDown && (
					<Content type="icon" position="after" isLoading={isLoading}>
						<IconRenderer icon={ChevronDownIcon} />
					</Content>
				)}
			</ButtonBase>
		);
	}),
);

FilterButton.displayName = 'FilterButton';

export default FilterButton;
