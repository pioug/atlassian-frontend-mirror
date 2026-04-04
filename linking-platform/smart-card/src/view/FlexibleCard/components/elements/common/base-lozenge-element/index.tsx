/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedDate } from 'react-intl-next';

import AtlaskitLozenge, { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { SimpleTag as Tag } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

import type { LinkLozengeInvokeActions } from '../../../../../../extractors/common/lozenge/types';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import type { ElementProps } from '../../../elements';

import LozengeAction from './lozenge-action';

const styles = css({
	display: 'inline-flex',
	minWidth: 'fit-content',
});
const dueOnStyles = css({
	marginTop: token('space.negative.050', '-4px'),
	marginRight: token('space.negative.050', '-4px'),
	marginBottom: token('space.negative.050', '-4px'),
	marginLeft: token('space.negative.050', '-4px'),
});

export type LozengeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';

export type BaseLozengeElementProps = ElementProps & {
	/**
	 * Action that can be performed on the element
	 */
	action?: LinkLozengeInvokeActions;
	/**
	 * Determines the appearance of the Atlaskit lozenge.
	 */
	appearance?: LozengeAppearance;
	/**
	 * Determines if the element is a due on element.
	 */
	isDateTag?: boolean;
	/**
	 * Callback fired after lozenge value has changed
	 */
	onAfterChanged?: () => void;
	/**
	 * The text to display within the lozenge.
	 */
	text?: string | React.ReactNode;
	/**
	 * Numeric metric displayed as a trailing badge inside the lozenge.
	 */
	trailingMetric?: string;
} & Pick<AtlaskitLozengeProps, 'maxWidth' | 'style'>;

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {BaseLozengeElementProps} BaseLozengeElementProps - The props necessary for the Lozenge element.
 * @see State
 */
const BaseLozengeElement = ({
	action,
	appearance = 'default',
	className,
	maxWidth,
	name,
	onAfterChanged,
	style,
	text,
	testId = 'smart-element-lozenge',
	isDateTag,
	trailingMetric,
}: BaseLozengeElementProps) => {
	const ui = useFlexibleUiOptionContext();
	if (!text) {
		return null;
	}

	const lozenge = action ? (
		<LozengeAction
			action={action}
			appearance={appearance}
			maxWidth={maxWidth}
			testId={testId}
			text={text}
			zIndex={ui?.zIndex}
			onAfterChanged={onAfterChanged}
			{...(trailingMetric && fg('platform-dst-lozenge-tag-badge-visual-uplifts')
				? { trailingMetric }
				: undefined)}
		/>
	) : isDateTag ? (
		<Tag text={text as string} migration_fallback="lozenge" />
	) : (
		<AtlaskitLozenge
			appearance={appearance}
			isBold
			maxWidth={maxWidth}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			testId={`${testId}-lozenge`}
			{...(trailingMetric && fg('platform-dst-lozenge-tag-badge-visual-uplifts')
				? { trailingMetric }
				: undefined)}
		>
			{text}
		</AtlaskitLozenge>
	);

	return (
		<span
			css={[
				styles,
				isDateTag && fg('platform-dst-lozenge-tag-badge-visual-uplifts') && dueOnStyles,
			]}
			data-smart-element={name}
			data-smart-element-lozenge
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{lozenge}
		</span>
	);
};

export default BaseLozengeElement;

export const toDateLozengeProps = (
	dateString?: string,
): Partial<BaseLozengeElementProps> | undefined => {
	if (dateString) {
		const text = Date.parse(dateString) ? (
			<FormattedDate
				value={new Date(dateString)}
				year="numeric"
				month="short"
				day="numeric"
				formatMatcher="best fit"
			/>
		) : (
			dateString
		);
		return { text };
	}
};
