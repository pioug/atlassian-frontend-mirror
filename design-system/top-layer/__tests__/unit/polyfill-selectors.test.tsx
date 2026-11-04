import invariant from 'tiny-invariant';

import '../../src/testing/polyfill';

describe('polyfilled selector methods', () => {
	const container = document.createElement('section');

	beforeEach(() => {
		jest.useFakeTimers();
		document.body.appendChild(container);
	});

	afterEach(() => {
		container.querySelectorAll('dialog').forEach((dialog) => dialog.close());
		container.querySelectorAll('[popover]').forEach((popover) => {
			(popover as HTMLElement).hidePopover();
		});
		container.replaceChildren();
		container.remove();
		jest.runAllTimers();
		jest.useRealTimers();
	});

	it('returns modal dialogs in document order, excluding non-modal open dialogs', () => {
		const first = document.createElement('dialog');
		const second = document.createElement('dialog');
		const nonModal = document.createElement('dialog');
		container.append(first, second, nonModal);
		second.showModal();
		first.showModal();
		nonModal.show();

		const result = document.querySelectorAll('dialog:modal');
		expect(result).toBeInstanceOf(NodeList);
		expect(Array.from(result)).toEqual([first, second]);

		first.close();
		expect(Array.from(document.querySelectorAll('dialog:modal'))).toEqual([second]);
		expect(Array.from(result)).toEqual([first, second]);
		expect(first).not.toHaveAttribute('data-top-layer-polyfill-modal');
	});

	it('supports compound selectors, lists, negation and element scope', () => {
		container.innerHTML = '<dialog class="selected"><button></button></dialog><dialog></dialog>';
		const dialog = container.querySelector('dialog');
		invariant(dialog);
		dialog.showModal();

		expect(Array.from(container.querySelectorAll(':scope > dialog:modal.selected'))).toEqual([
			dialog,
		]);
		expect(Array.from(container.querySelectorAll('dialog:modal, .selected'))).toEqual([dialog]);
		expect(container.querySelectorAll('dialog:not(:modal)')).toHaveLength(1);
		expect(container.querySelectorAll('dialog:modal > button')).toHaveLength(1);
		expect(dialog.querySelectorAll('dialog:modal > button')).toHaveLength(1);
	});

	it('preserves quoted selector values and escaped colons', () => {
		container.innerHTML = '<div id=":modal" data-selector=":modal"></div>';

		expect(container.querySelectorAll('[data-selector=":modal"]')).toHaveLength(1);
		expect(container.querySelectorAll('#\\:modal')).toHaveLength(1);
		expect(container.querySelectorAll('[data-selector=":modal"], dialog:modal')).toHaveLength(1);
		expect(() => container.querySelectorAll('dialog:modal:unknown-pseudo')).toThrow();
	});

	it('does not treat removed and reinserted dialogs as modal', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.showModal();
		expect(container.querySelectorAll('dialog:modal')).toHaveLength(1);

		dialog.remove();
		container.append(dialog);
		expect(container.querySelectorAll('dialog:modal')).toHaveLength(0);
	});

	it('supports DocumentFragment queries', () => {
		const fragment = document.createDocumentFragment();
		const dialog = document.createElement('dialog');
		dialog.open = true;
		fragment.append(dialog);

		expect(fragment.querySelectorAll('dialog:modal')).toHaveLength(0);
		expect(Array.from(fragment.querySelectorAll('dialog:not(:modal)'))).toEqual([dialog]);
	});

	it('queries popover state and preserves modal state when a selector is invalid', () => {
		const dialog = document.createElement('dialog');
		const popover = document.createElement('div');
		popover.setAttribute('popover', 'manual');
		dialog.append(popover);
		container.append(dialog);
		dialog.showModal();
		popover.showPopover();

		expect(Array.from(container.querySelectorAll('dialog:modal > :popover-open'))).toEqual([
			popover,
		]);
		expect(() => container.querySelectorAll('dialog:modal[')).toThrow();
		expect(dialog).toHaveAttribute('data-top-layer-polyfill-modal');
		popover.hidePopover();
		expect(container.querySelectorAll(':popover-open')).toHaveLength(0);
	});

	it('finds the first modal through document and element querySelector', () => {
		const first = document.createElement('dialog');
		const second = document.createElement('dialog');
		container.append(first, second);
		second.showModal();
		first.showModal();

		expect(document.querySelector('dialog:modal')).toBe(first);
		expect(container.querySelector(':scope > dialog:modal')).toBe(first);
		first.close();
		expect(container.querySelector('dialog:modal')).toBe(second);
		second.close();
		expect(document.querySelector('dialog:modal')).toBeNull();
	});

	it('matches modal state within compound selectors and finds the closest modal ancestor', () => {
		const dialog = document.createElement('dialog');
		const button = document.createElement('button');
		dialog.className = 'selected';
		dialog.append(button);
		container.append(dialog);
		dialog.showModal();

		expect(dialog.matches(':modal')).toBe(true);
		expect(dialog.matches('dialog.selected:modal')).toBe(true);
		expect(button.matches('dialog:modal > button')).toBe(true);
		expect(button.matches(':modal')).toBe(false);
		expect(dialog.closest('dialog:modal')).toBe(dialog);
		expect(button.closest('dialog.selected:modal')).toBe(dialog);
		expect(button.closest('section:modal')).toBeNull();

		dialog.close();
		expect(dialog.matches(':modal')).toBe(false);
		expect(dialog.matches('dialog:not(:modal)')).toBe(true);
		expect(button.closest('dialog:modal')).toBeNull();
	});

	it('queries and matches popovers through all four methods', () => {
		const popover = document.createElement('div');
		const button = document.createElement('button');
		popover.setAttribute('popover', 'manual');
		popover.append(button);
		container.append(popover);
		popover.showPopover();

		expect(container.querySelector('div:popover-open')).toBe(popover);
		expect(Array.from(container.querySelectorAll('div:popover-open'))).toEqual([popover]);
		expect(popover.matches('div:popover-open')).toBe(true);
		expect(button.closest('div:popover-open')).toBe(popover);

		popover.hidePopover();
		expect(container.querySelector(':popover-open')).toBeNull();
		expect(popover.matches(':popover-open')).toBe(false);
		expect(button.closest(':popover-open')).toBeNull();
	});

	it('preserves fragment querySelector scope and disconnected matching', () => {
		const fragment = document.createDocumentFragment();
		const dialog = document.createElement('dialog');
		fragment.append(dialog);

		expect(fragment.querySelector('dialog:modal')).toBeNull();
		expect(fragment.querySelector('dialog:not(:modal)')).toBe(dialog);
		expect(dialog.matches('dialog:not(:modal)')).toBe(true);
		expect(dialog.closest('dialog:not(:modal)')).toBe(dialog);
	});

	it('preserves ordinary selectors and modal state after invalid selectors in every method', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.showModal();

		expect(container.querySelector('dialog')).toBe(dialog);
		expect(dialog.matches('dialog')).toBe(true);
		expect(dialog.closest('section')).toBe(container);
		expect(container.querySelectorAll('dialog')).toHaveLength(1);
		expect(dialog).toHaveAttribute('data-top-layer-polyfill-modal');
		expect(container.querySelector('dialog:MODAL')).toBe(dialog);
		expect(() => container.querySelector('dialog:modal[')).toThrow();
		expect(() => dialog.matches('dialog:modal[')).toThrow();
		expect(() => dialog.closest('dialog:modal[')).toThrow();
		expect(dialog).toHaveAttribute('data-top-layer-polyfill-modal');
	});

	it('tracks the modal attribute through opening, closing and removal', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.show();
		expect(dialog).not.toHaveAttribute('data-top-layer-polyfill-modal');
		dialog.close();
		dialog.showModal();
		expect(dialog).toHaveAttribute('data-top-layer-polyfill-modal');
		dialog.close();
		expect(dialog).not.toHaveAttribute('data-top-layer-polyfill-modal');

		dialog.showModal();
		dialog.remove();
		expect(dialog.matches(':modal')).toBe(false);
		expect(dialog).not.toHaveAttribute('data-top-layer-polyfill-modal');
	});

	it('does not match a modal dialog after its open attribute is removed', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.showModal();
		dialog.open = false;

		expect(dialog.matches(':modal')).toBe(false);
		expect(container.querySelector('dialog:modal')).toBeNull();
		dialog.open = true;
		dialog.close();
	});

	it('does not mutate attributes while evaluating top-layer selectors', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.showModal();
		const observer = new MutationObserver(() => {});
		observer.observe(dialog, { attributes: true });

		container.querySelector('dialog:modal');
		container.querySelectorAll('dialog:modal');
		dialog.matches('dialog:modal');
		dialog.closest('dialog:modal');

		expect(observer.takeRecords()).toEqual([]);
		observer.disconnect();
	});

	// C3 and other third-party libraries pass non-string selectors. Missing DOMString coercion
	// broke AdminHub chart tests, so these calls deliberately exceed TypeScript's DOM signatures.
	it('coerces array selector lists across all selector methods', () => {
		const first = document.createElement('div');
		const second = document.createElement('div');
		first.className = 'first';
		second.className = 'second';
		first.append(second);
		container.append(first);
		const selector = ['.first', '.second'];

		// @ts-expect-error DOM APIs coerce selector arrays to strings.
		expect(container.querySelector(selector)).toBe(first);
		// @ts-expect-error DOM APIs coerce selector arrays to strings.
		expect(Array.from(container.querySelectorAll(selector))).toEqual([first, second]);
		// @ts-expect-error DOM APIs coerce selector arrays to strings.
		expect(first.matches(selector)).toBe(true);
		// @ts-expect-error DOM APIs coerce selector arrays to strings.
		expect(second.closest(selector)).toBe(second);
	});

	it('translates top-layer selectors after array coercion', () => {
		const dialog = document.createElement('dialog');
		const button = document.createElement('button');
		dialog.append(button);
		container.append(dialog);
		dialog.showModal();
		const selector = ['dialog:modal'];

		// @ts-expect-error DOM APIs coerce selector arrays before parsing selectors.
		expect(container.querySelector(selector)).toBe(dialog);
		// @ts-expect-error DOM APIs coerce selector arrays before parsing selectors.
		expect(Array.from(container.querySelectorAll(selector))).toEqual([dialog]);
		// @ts-expect-error DOM APIs coerce selector arrays before parsing selectors.
		expect(dialog.matches(selector)).toBe(true);
		// @ts-expect-error DOM APIs coerce selector arrays before parsing selectors.
		expect(button.closest(selector)).toBe(dialog);
	});

	it('converts objects with Symbol.toPrimitive exactly once per call', () => {
		const popover = document.createElement('div');
		const button = document.createElement('button');
		popover.setAttribute('popover', 'manual');
		popover.append(button);
		container.append(popover);
		popover.showPopover();
		const toPrimitive = jest.fn(() => ':popover-open');
		const selector = { [Symbol.toPrimitive]: toPrimitive };

		// @ts-expect-error DOMString conversion accepts objects with Symbol.toPrimitive.
		expect(container.querySelector(selector)).toBe(popover);
		// @ts-expect-error DOMString conversion accepts objects with Symbol.toPrimitive.
		expect(Array.from(container.querySelectorAll(selector))).toEqual([popover]);
		// @ts-expect-error DOMString conversion accepts objects with Symbol.toPrimitive.
		expect(popover.matches(selector)).toBe(true);
		// @ts-expect-error DOMString conversion accepts objects with Symbol.toPrimitive.
		expect(button.closest(selector)).toBe(popover);
		expect(toPrimitive.mock.calls).toEqual([['string'], ['string'], ['string'], ['string']]);
	});

	it('converts ordinary objects exactly once per call', () => {
		const selected = document.createElement('div');
		const button = document.createElement('button');
		selected.className = 'selected';
		selected.append(button);
		container.append(selected);
		const toString = jest.fn(() => '.selected');
		const selector = { toString };

		// @ts-expect-error DOMString conversion accepts objects with toString.
		expect(container.querySelector(selector)).toBe(selected);
		// @ts-expect-error DOMString conversion accepts objects with toString.
		expect(Array.from(container.querySelectorAll(selector))).toEqual([selected]);
		// @ts-expect-error DOMString conversion accepts objects with toString.
		expect(selected.matches(selector)).toBe(true);
		// @ts-expect-error DOMString conversion accepts objects with toString.
		expect(button.closest(selector)).toBe(selected);
		expect(toString.mock.calls).toEqual([[], [], [], []]);
	});

	const primitiveSelectors: { selector: unknown; tagName: string }[] = [
		{ selector: null, tagName: 'null' },
		{ selector: undefined, tagName: 'undefined' },
		{ selector: true, tagName: 'true' },
		{ selector: false, tagName: 'false' },
		{ selector: Object('section'), tagName: 'section' },
	];

	it.each(primitiveSelectors)('coerces $tagName selector values', ({ selector, tagName }) => {
		const selected = document.createElement(tagName);
		const button = document.createElement('button');
		selected.append(button);
		container.append(selected);

		// @ts-expect-error DOMString conversion accepts non-string values.
		expect(container.querySelector(selector)).toBe(selected);
		// @ts-expect-error DOMString conversion accepts non-string values.
		expect(Array.from(container.querySelectorAll(selector))).toEqual([selected]);
		// @ts-expect-error DOMString conversion accepts non-string values.
		expect(selected.matches(selector)).toBe(true);
		// @ts-expect-error DOMString conversion accepts non-string values.
		expect(button.closest(selector)).toBe(selected);
	});

	it.each([123, BigInt(123), [], ['['], { toString: () => '[' }])(
		'preserves selector syntax errors after coercing %p',
		(selector) => {
			expect(() => {
				// @ts-expect-error DOMString conversion runs before selector syntax validation.
				container.querySelector(selector);
			}).toThrow(expect.objectContaining({ name: 'SyntaxError' }));
			expect(() => {
				// @ts-expect-error DOMString conversion runs before selector syntax validation.
				container.querySelectorAll(selector);
			}).toThrow(expect.objectContaining({ name: 'SyntaxError' }));
			expect(() => {
				// @ts-expect-error DOMString conversion runs before selector syntax validation.
				container.matches(selector);
			}).toThrow(expect.objectContaining({ name: 'SyntaxError' }));
			expect(() => {
				// @ts-expect-error DOMString conversion runs before selector syntax validation.
				container.closest(selector);
			}).toThrow(expect.objectContaining({ name: 'SyntaxError' }));
		},
	);

	it('rejects omitted selector arguments', () => {
		expect(() => {
			// @ts-expect-error Exercise the native missing-argument error.
			container.querySelector();
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise the native missing-argument error.
			container.querySelectorAll();
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise the native missing-argument error.
			container.matches();
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise the native missing-argument error.
			container.closest();
		}).toThrow(TypeError);
	});

	it('rejects symbols during selector conversion', () => {
		const selector = Symbol('selector');

		expect(() => {
			// @ts-expect-error Exercise DOMString conversion's rejection of symbols.
			container.querySelector(selector);
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise DOMString conversion's rejection of symbols.
			container.querySelectorAll(selector);
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise DOMString conversion's rejection of symbols.
			container.matches(selector);
		}).toThrow(TypeError);
		expect(() => {
			// @ts-expect-error Exercise DOMString conversion's rejection of symbols.
			container.closest(selector);
		}).toThrow(TypeError);
	});

	it('accepts the SVG selector arrays used by C3 charts', () => {
		const namespace = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(namespace, 'svg');
		const chartClip = document.createElementNS(namespace, 'clipPath');
		const gridClip = document.createElementNS(namespace, 'clipPath');
		chartClip.id = 'chart-clip';
		gridClip.id = 'grid-clip';
		svg.append(chartClip, gridClip);
		container.append(svg);

		// @ts-expect-error C3 passes selector arrays, which caused AdminHub failures without coercion.
		const result = svg.querySelectorAll(['#chart-clip', '#grid-clip']);

		expect(Array.from(result)).toEqual([chartClip, gridClip]);
	});

	it('keeps using the original modal state after another polyfill import', () => {
		const dialog = document.createElement('dialog');
		container.append(dialog);
		dialog.showModal();

		const prototypes = [Document.prototype, Element.prototype, DocumentFragment.prototype];
		const matches = Element.prototype.matches;
		const closest = Element.prototype.closest;
		const queryMethods = prototypes.map((prototype) => ({
			querySelector: prototype.querySelector,
			querySelectorAll: prototype.querySelectorAll,
		}));

		jest.isolateModules(() => {
			jest.requireActual('../../src/testing/polyfill');
		});

		expect(Element.prototype.matches).toBe(matches);
		expect(Element.prototype.closest).toBe(closest);
		prototypes.forEach((prototype, index) => {
			expect(prototype.querySelector).toBe(queryMethods[index].querySelector);
			expect(prototype.querySelectorAll).toBe(queryMethods[index].querySelectorAll);
		});

		expect(Array.from(document.querySelectorAll('dialog:modal'))).toEqual([dialog]);
		expect(document.querySelector('dialog:modal')).toBe(dialog);
		expect(dialog.matches('dialog:modal')).toBe(true);
		expect(dialog.closest('dialog:modal')).toBe(dialog);
	});
});
