/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedDate } from 'react-intl-next';

import AtlaskitLozenge, { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LinkLozengeInvokeActions } from '../../../../../../extractors/common/lozenge/types';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import type { ElementProps } from '../../../elements';

import LozengeAction from './lozenge-action';

const styles = css({
	display: 'inline-flex',
	minWidth: 'fit-content',
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
	 * Callback fired after lozenge value has changed
	 */
	onAfterChanged?: () => void;

	/**
	 * Determines the custom styles of the Atlaskit lozenge.
	 */
	style?: AtlaskitLozengeProps['style'];

	/**
	 * The text to display within the lozenge.
	 */
	text?: string | React.ReactNode;
};

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {BaseLozengeElementProps} BaseLozengeElementProps - The props necessary for the Lozenge element.
 * @see State
 */
const BaseLozengeElement = ({
	action,
	appearance = 'default',
	name,
	className,
	style,
	text,
	testId = 'smart-element-lozenge',
	onAfterChanged,
}: BaseLozengeElementProps) => {
	const ui = useFlexibleUiOptionContext();
	if (!text) {
		return null;
	}

	const lozenge = action ? (
		<LozengeAction
			action={action}
			appearance={appearance}
			testId={testId}
			text={text}
			zIndex={ui?.zIndex}
			onAfterChanged={onAfterChanged}
		/>
	) : (
		<AtlaskitLozenge
			appearance={appearance}
			{...(fg('platform-component-visual-refresh') ? { isBold: true } : undefined)}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			testId={`${testId}-lozenge`}
		>
			{text}
		</AtlaskitLozenge>
	);

	return (
		<span
			css={[styles]}
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
