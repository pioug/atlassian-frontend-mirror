/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

const decoration = cssMap({
	root: {
		'&:hover::before': {
			color: token('color.text.warning'),
			backgroundColor: token('color.background.warning.hovered'),
		},
		'&::before': {
			pointerEvents: 'auto',
			paddingInlineStart: token('space.050'),
			paddingInlineEnd: token('space.050'),
			paddingBlockStart: token('space.0'),
			paddingBlockEnd: token('space.0'),
			font: token('font.body'),
			fontStyle: 'normal',
			fontFamily: token('font.family.code'),
			lineHeight: '18px',
			content: '"<"attr(data-bidi-character-code)">"',

			color: token('color.text.warning'),
			backgroundColor: token('color.background.warning'),
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			display: 'inline-flex',
		},
		// Required as otherwise the following bidi characters cause the span
		// to not receive hover events.
		//
		// U+2066 LEFT-TO-RIGHT ISOLATE (when using pseudo element before)
		// U+202E RIGHT-TO-LEFT OVERRIDE' (when using pseudo element after)
		position: 'relative',
	},
});

export function Decorator({
	bidiCharacter,
	children,
	testId,
}: {
	bidiCharacter: string;
	children: ReactNode;
	testId?: string;
}): JSX.Element {
	const bidiCharacterCode = getBidiCharacterCode(bidiCharacter);
	return (
		<Fragment>
			<span
				css={decoration.root}
				data-testid={testId}
				data-bidi-character-code={bidiCharacterCode}
				// This is set to true so that the content is not read out by
				// screen readers as the content includes angle brackets for
				// visual decoration purposes.
				// We use a visually hidden `mark` element below for screen readers
				aria-hidden="true"
			>
				{children}
			</span>
			<VisuallyHidden testId={testId && `${testId}--visually-hidden`}>
				<mark>{bidiCharacterCode}</mark>
			</VisuallyHidden>
		</Fragment>
	);
}

function getBidiCharacterCode(bidiCharacter: string) {
	const bidiCharacterCode = bidiCharacter.codePointAt(0)?.toString(16);

	return `U+${bidiCharacterCode}`;
}
