/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import AtlaskitLozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context';

import LozengeAction from './lozenge-action';
import type { LozengeProps } from './types';

const stylesOld = css({
	display: 'inline-flex',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'inherit',
});

const styles = css({
	display: 'inline-flex',
	minWidth: 'fit-content',
});

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {LozengeProps} LozengeProps - The props necessary for the Lozenge element.
 * @see State
 */
const Lozenge = ({
	action,
	appearance = 'default',
	name,
	className,
	style,
	text,
	testId = 'smart-element-lozenge',
}: LozengeProps) => {
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

export default Lozenge;
