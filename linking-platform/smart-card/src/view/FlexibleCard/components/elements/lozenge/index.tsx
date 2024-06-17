/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import AtlaskitLozenge from '@atlaskit/lozenge';
import LozengeAction from './lozenge-action';
import type { LozengeProps } from './types';
import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context';

const styles = css({
	display: 'inline-flex',
	lineHeight: 'inherit',
});

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {LozengeProps} LozengeProps - The props necessary for the Lozenge element.
 * @see State
 */
const Lozenge: React.FC<LozengeProps> = ({
	action,
	appearance = 'default',
	name,
	overrideCss,
	style,
	text,
	testId = 'smart-element-lozenge',
}) => {
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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			testId={`${testId}-lozenge`}
		>
			{text}
		</AtlaskitLozenge>
	);

	return (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[styles, overrideCss]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-lozenge
			data-testid={testId}
		>
			{lozenge}
		</span>
	);
};

export default Lozenge;
