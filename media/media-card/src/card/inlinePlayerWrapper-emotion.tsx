/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type InlinePlayerWrapperProps } from './types';
import { inlinePlayerWrapperStyles, inlinePlayerClassName } from './inlinePlayerWrapperStyles';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';
import UFOCustomData from '@atlaskit/react-ufo/custom-data';

export const InlinePlayerWrapper = (props: InlinePlayerWrapperProps) => {
	const { testId, selected, dimensions, onClick, innerRef } = props;
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div
			id="inlinePlayerWrapper"
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={inlinePlayerClassName}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={inlinePlayerWrapperStyles({
				selected,
				dimensions,
			})}
			onClick={onClick}
			ref={innerRef}
			{...VcMediaWrapperProps}
		>
			<UFOCustomData data={{ hasMediaComponent: true }} />
			{props.children}
		</div>
	);
};
