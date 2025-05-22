/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import AtlaskitLozenge, { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LinkLozengeInvokeActions } from '../../../../../../extractors/common/lozenge/types';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import type { ElementProps } from '../../../elements';

import LozengeAction from './lozenge-action';

const stylesOld = css({
	display: 'inline-flex',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'inherit',
});

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
			css={[
				!fg('platform-linking-visual-refresh-v1') && stylesOld,
				fg('platform-linking-visual-refresh-v1') && styles,
			]}
			{...(fg('platform-linking-visual-refresh-v1') ? {} : { ['data-fit-to-content']: true })}
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
