import { type DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';

export function getCodeBidiWarningDomSpec(
	bidiCharacter: string,
	codeBidiWarningLabel: string,
	tooltipEnabled: boolean,
): DOMOutputSpec {
	const bidiCharacterCode = `U+${bidiCharacter.codePointAt(0)?.toString(16)?.toUpperCase()}`;
	return [
		'span',
		{
			'data-prosemirror-node-name': 'code-bidi-warning',
			dir: 'ltr',
		},
		// Code Bidi Warning Decorator
		[
			'span',
			{
				'data-bidi-component': 'code-bidi-warning-decorator',
				'data-testid': 'code-bidi-warning-decorator',
				'data-bidi-character-code': bidiCharacterCode,
				role: 'mark',
			},
			// Mark the < and > characters as visually hidden for screen readers
			['span', { 'aria-hidden': 'true' }, '<'],
			bidiCharacterCode,
			['span', { 'aria-hidden': 'true' }, '>'],
		],
		// Code Bidi Warning Tooltip
		...(tooltipEnabled
			? [
					[
						'span',
						{
							'data-bidi-component': 'code-bidi-warning-tooltip',
							role: 'tooltip',
						},
						codeBidiWarningLabel,
					],
				]
			: []),
	];
}
