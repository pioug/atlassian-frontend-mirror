/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

import { cssMap, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const pulseBackground = keyframes({
	'50%': {
		backgroundColor: token('color.blanket.danger'),
	},
});

const pulseBackgroundReverse = keyframes({
	'0%': {
		backgroundColor: token('color.blanket.danger'),
	},
	'50%': {
		backgroundColor: 'auto',
	},
	'100%': {
		backgroundColor: token('color.blanket.danger'),
	},
});

const compiledStyles = cssMap({
	flashWrapper: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.-flash > div': {
			animationName: `${pulseBackgroundReverse}`,
			animationDuration: '0.25s',
			animationTimingFunction: 'ease-in-out',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > div': {
			animation: 'none',
		},
	},
	flashWrapperAnimated: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.-flash > div': {
			animationName: `${pulseBackground}`,
			animationDuration: '0.25s',
			animationTimingFunction: 'ease-in-out',
		},
	},
});

export interface Props {
	animate: boolean;
	children?: React.ReactNode;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class WithFlashCompiled extends React.Component<Props> {
	private toggle = false;

	render(): React.JSX.Element {
		const { animate, children } = this.props;
		this.toggle = animate && !this.toggle;

		return (
			// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
			<div
				css={[animate ? compiledStyles.flashWrapperAnimated : compiledStyles.flashWrapper]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={this.toggle ? '-flash' : ''}
			>
				{children}
			</div>
		);
	}
}
