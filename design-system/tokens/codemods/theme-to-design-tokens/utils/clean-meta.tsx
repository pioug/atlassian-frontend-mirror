import { uniqueWordsFromTokens } from '../../utils/unique-words-from-tokens';

export function cleanMeta(meta: string[]): string[] {
	return meta
		.reduce<string[]>(
			(accum, val) => [
				...accum,
				...(typeof val === 'string' ? val.split(/(?=[A-Z])/g).map((e) => e.toLowerCase()) : []),
			],
			[],
		)
		.reduce<string[]>((accum, val) => {
			const cleanVal = val
				.replace(/:/g, '')
				.replace(/,/g, '')
				.replace('grey', 'neutral')
				.replace('skeleton', 'neutral')
				.replace('texts', 'text')
				.replace('red', 'danger')
				.replace('error', 'danger')
				.replace('invalid', 'danger')
				.replace('removed', 'danger')
				.replace('removal', 'danger')
				.replace('remove', 'danger')
				.replace('focus', 'focused')
				.replace('valid', 'success')
				.replace('successful', 'success')
				.replace('risk', 'warning')
				.replace('caution', 'warning')
				.replace('primary', 'bold')
				.replace('secondary', 'subtle')
				.replace('hyperlink', 'link')
				.replace('anchor', 'link')
				.replace('active', 'pressed')
				.replace('hover', 'hovered')
				.replace('card', 'raised')
				.replace('dragged', 'surface overlay')
				.replace('dragging', 'surface overlay')
				.replace('drag', 'surface overlay')
				.replace('background-color', 'background')
				.replace('color', 'text')
				.replace('icons', 'icon')
				.replace('glyph', 'icon')
				.replace('stroke', 'border')
				.replace('border-left', 'border')
				.replace('border-right', 'border')
				.replace('border-top', 'border')
				.replace('border-bottom', 'border')
				.replace('box-shadow', 'shadow');

			accum.push(...cleanVal.split(' '));

			return accum;
		}, [])
		.filter((val) => uniqueWordsFromTokens.includes(val))
		.reduce<string[]>((accum, val) => {
			if (!accum.includes(val)) {
				accum.push(val);
			}

			return accum;
		}, []);
}
