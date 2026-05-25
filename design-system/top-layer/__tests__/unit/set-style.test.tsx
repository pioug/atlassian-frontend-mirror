import { setStyle } from '../../src/internal/set-style';

describe('setStyle() - snapshot and restore', () => {
	function makeElement(): HTMLElement {
		const element = document.createElement('div');
		document.body.appendChild(element);
		return element;
	}

	it('applies the requested inline styles', () => {
		const element = makeElement();

		setStyle({
			el: element,
			styles: [
				{ property: 'color', value: 'red' },
				{ property: 'margin-left', value: '8px' },
			],
		});

		expect(element.style.getPropertyValue('color')).toBe('red');
		expect(element.style.getPropertyValue('margin-left')).toBe('8px');
	});

	it('removes properties on cleanup when there was no prior inline value', () => {
		const element = makeElement();

		const cleanup = setStyle({
			el: element,
			styles: [{ property: 'color', value: 'red' }],
		});

		cleanup();

		expect(element.style.getPropertyValue('color')).toBe('');
		expect(element.getAttribute('style')).toBeFalsy();
	});

	it('restores the prior inline value on cleanup instead of stomping it', () => {
		const element = makeElement();
		// Consumer set an inline value before the popover applied its own.
		element.style.setProperty('color', 'blue');

		const cleanup = setStyle({
			el: element,
			styles: [{ property: 'color', value: 'red' }],
		});

		expect(element.style.getPropertyValue('color')).toBe('red');

		cleanup();

		// Prior value is restored, not removed.
		expect(element.style.getPropertyValue('color')).toBe('blue');
	});

	it('handles a mix of prior-inline and not-inline properties on the same element', () => {
		const element = makeElement();
		// `color` had a prior inline value; `margin-left` did not.
		element.style.setProperty('color', 'blue');

		const cleanup = setStyle({
			el: element,
			styles: [
				{ property: 'color', value: 'red' },
				{ property: 'margin-left', value: '12px' },
			],
		});

		cleanup();

		expect(element.style.getPropertyValue('color')).toBe('blue');
		expect(element.style.getPropertyValue('margin-left')).toBe('');
	});
});
