/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	B200,
	B300,
	B400,
	B50,
	N10,
	N100,
	N20,
	N30,
	N70,
	N80,
	N900,
	R300,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type LabelProps } from '../types';

const baseStyles = css({
	display: 'grid',
	gridAutoColumns: '1fr',
	gridAutoRows: 'min-content',
	color: token('color.text', N900),
	cursor: 'default',
	font: token('font.body'),
});

const textLabelLayoutStyles = css({
	gap: `${token('space.0', '0px')} ${token('space.050', '4px')}`,
	gridTemplateColumns: 'min-content auto',
});

const disabledStyles = css({
	color: token('color.text.disabled', N80),
	cursor: 'not-allowed',
});

const labelStyles = css({
	/**
	 * Background
	 */
	'--local-background': token('color.background.input', N10),
	'--local-background-active': token('color.background.input.pressed', B50),
	'--local-background-checked': token('color.background.selected.bold', B400),
	'--local-background-checked-hover': token('color.background.selected.bold.hovered', B300),
	'--local-background-disabled': token('color.background.disabled', N20),
	'--local-background-hover': token('color.background.input.hovered', N30),
	/**
	 * Border
	 */
	'--local-border': token('color.border.input', N100),
	'--local-border-active': token('color.border', B50),
	'--local-border-checked': token('color.background.selected.bold', B400),
	'--local-border-checked-hover': token('color.background.selected.bold.hovered', B300),
	'--local-border-checked-invalid': token('color.border.danger', R300),
	'--local-border-disabled': token('color.background.disabled', N20),
	'--local-border-focus': token('color.border.focused', B200),
	'--local-border-hover': token('color.border.input', N100),
	'--local-border-invalid': token('color.border.danger', R300),
	/**
	 * Tick
	 */
	'--local-tick-active': token('color.icon.inverse', B400),
	'--local-tick-checked': token('color.icon.inverse', N10),
	'--local-tick-disabled': token('color.icon.disabled', N70),
	'--local-tick-rest': 'transparent',
});

export default function Label({ children, isDisabled, testId, label, id, xcss }: LabelProps) {
	return (
		<label
			// Because we're using Emotion local jsx namespace we have to coerce xcss prop to a string.
			// When we're fully on Compiled its local jsx namespace accepts the output of xcss prop.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={xcss as string}
			css={[baseStyles, label && textLabelLayoutStyles, isDisabled && disabledStyles, labelStyles]}
			data-testid={testId}
			data-disabled={isDisabled || undefined}
			id={id}
		>
			{children}
		</label>
	);
}
