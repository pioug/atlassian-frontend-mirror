import { getMutatedElements } from './get-mutated-elements';

describe('getMutatedElements', () => {
	let getComputedStyleSpy: jest.SpyInstance;

	beforeEach(() => {
		getComputedStyleSpy = jest
			.spyOn(window, 'getComputedStyle')
			.mockImplementation((elt: Element) => {
				// Use inline style to decide if an element is display: contents in tests
				const display = (elt as HTMLElement).style?.display || 'block';
				return { display } as any;
			});
	});

	afterEach(() => {
		getComputedStyleSpy.mockRestore();
		document.body.innerHTML = '';
	});

	const markAsDisplayContents = (elt: HTMLElement) => {
		elt.style.display = 'contents';
		return elt;
	};

	it('returns the element itself when not display: contents', () => {
		const root = document.createElement('div');
		const child = document.createElement('span');
		root.appendChild(child);

		const result = getMutatedElements(root);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ element: root, isDisplayContentsElementChildren: false });
	});

	it('returns empty array for display: contents element with no children', () => {
		const root = markAsDisplayContents(document.createElement('div'));

		const result = getMutatedElements(root);

		expect(result).toEqual([]);
	});

	it('returns immediate children for display: contents element', () => {
		const root = markAsDisplayContents(document.createElement('div'));
		const a = document.createElement('div');
		const b = document.createElement('span');
		root.append(a, b);

		const result = getMutatedElements(root);

		expect(result).toEqual([
			{ element: a, isDisplayContentsElementChildren: true },
			{ element: b, isDisplayContentsElementChildren: true },
		]);
	});

	it('recursively includes descendants of nested display: contents children (up to max depth)', () => {
		const root = markAsDisplayContents(document.createElement('div'));
		const a = document.createElement('div');
		const b = markAsDisplayContents(document.createElement('div'));
		const c = document.createElement('div');
		root.append(a, b, c);

		const b1 = document.createElement('span');
		const b2 = markAsDisplayContents(document.createElement('div'));
		b.append(b1, b2);

		const b2a = document.createElement('p');
		b2.append(b2a);

		const result = getMutatedElements(root);

		// Order should be: root children first, then recursive results in order
		expect(result).toEqual([
			{ element: a, isDisplayContentsElementChildren: true },
			{ element: b, isDisplayContentsElementChildren: true },
			{ element: c, isDisplayContentsElementChildren: true },
			{ element: b1, isDisplayContentsElementChildren: true },
			{ element: b2, isDisplayContentsElementChildren: true },
			{ element: b2a, isDisplayContentsElementChildren: true },
		]);
	});

	it('does not recurse beyond the maximum nested levels', () => {
		const root = markAsDisplayContents(document.createElement('div'));
		const lvl1 = markAsDisplayContents(document.createElement('div'));
		const lvl2 = markAsDisplayContents(document.createElement('div'));
		const lvl3 = markAsDisplayContents(document.createElement('div'));
		const lvl4 = markAsDisplayContents(document.createElement('div'));
		const leaf = document.createElement('span');

		root.appendChild(lvl1);
		lvl1.appendChild(lvl2);
		lvl2.appendChild(lvl3);
		lvl3.appendChild(lvl4);
		lvl4.appendChild(leaf);

		const result = getMutatedElements(root);

		// We expect lvl1..lvl4 included, but NOT the leaf (depth cut after lvl3)
		expect(result).toEqual([
			{ element: lvl1, isDisplayContentsElementChildren: true },
			{ element: lvl2, isDisplayContentsElementChildren: true },
			{ element: lvl3, isDisplayContentsElementChildren: true },
			{ element: lvl4, isDisplayContentsElementChildren: true },
		]);
		// Ensure leaf is not present
		expect(result.find((r) => r.element === leaf)).toBeUndefined();
	});
});
