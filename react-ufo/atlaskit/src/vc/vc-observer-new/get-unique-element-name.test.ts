import getElementName, { SelectorConfig } from './get-unique-element-name'; // Adjust the import path as necessary

describe('getElementName', () => {
	let container: HTMLElement;

	beforeEach(() => {
		// Set up a simple DOM structure for testing
		document.body.innerHTML = `
		<body>
			<div id="%invalid%"></div> <!-- please don't change position, this relies on container.previousElementSibling to be selected -->
			<div id="parent" class="container">
				<div id="child1" class="child" data-vc="vc1"></div>
				<div class="child" data-testid="test-id"></div>
				<div class="child" role="button"></div>
				<div class="child" id="unique-child"></div>
				<div>
					<div>
						<div>
							<div class="deeply-nested">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="%invalid%"></div> <!-- please don't change position, this relies on container.nextElementSibling to be selected -->
		</body>
    `;
		container = document.getElementById('parent')!;
	});

	it('should return a unique selector by ID', () => {
		const element = document.getElementById('unique-child')!;
		const config: SelectorConfig = { id: true, testId: false, role: false, className: false };
		const result = getElementName(config, element);
		expect(result).toBe('div#unique-child');
	});

	it('should return a unique selector by data-vc attribute', () => {
		const element = document.querySelector('[data-vc="vc1"]')!;
		const config: SelectorConfig = {
			id: false,
			dataVC: true,
			testId: false,
			role: false,
			className: false,
		};
		const result = getElementName(config, element);
		expect(result).toBe('div[data-vc="vc1"]');
	});

	it('should return a unique selector by testId', () => {
		const element = document.querySelector('[data-testid="test-id"]')!;
		const config: SelectorConfig = { id: false, testId: true, role: false, className: false };
		const result = getElementName(config, element);
		expect(result).toBe('div[data-testid="test-id"]');
	});

	it('should return a unique selector by role', () => {
		const element = document.querySelector('[role="button"]')!;
		const config: SelectorConfig = { id: false, testId: false, role: true, className: false };
		const result = getElementName(config, element);
		expect(result).toBe('div[role="button"]');
	});

	it('should handle elements without unique identifiers', () => {
		const element = container.querySelector('div.child[role="button"]')!;
		const config: SelectorConfig = { id: true, testId: false, role: false, className: true };
		const result = getElementName(config, element);
		// Expect the result to be a path using nth-child as fallback
		expect(result).toBe('div#parent > div.child:nth-child');
	});

	it('should return "error" for non-HTMLElement inputs', () => {
		const element = document.createTextNode('text');
		const config: SelectorConfig = { id: true, testId: true, role: true, className: true };
		const result = getElementName(config, element as unknown as Element);
		expect(result).toBe('error');
	});

	it('should return a correct unique selector for the elements at the root level', () => {
		const element = container.parentElement;
		const config: SelectorConfig = { id: false, testId: false, role: false, className: false };
		const result = getElementName(config, element!);
		expect(result).toBe('unknown');
	});

	it('should return an :nth-child selector for an element with special characters in the classname', () => {
		const element = container.nextElementSibling; // element with classname "%invalid%"
		const config: SelectorConfig = { id: false, testId: false, role: false, className: true };
		const result = getElementName(config, element!);
		expect(result).toBe('div:nth-child');
	});

	it('should return an :nth-child selector for an element with special characters in the id', () => {
		const element = container.previousElementSibling; // element with id "%invalid%"
		const config: SelectorConfig = { id: true, testId: false, role: false, className: false };
		const result = getElementName(config, element!);
		expect(result).toBe('div:nth-child');
	});

	it('should return a maximum of 3 parent elements in the selector for a deeply nested element', () => {
		const element = container.querySelector('.deeply-nested'); // element with id "%invalid%"
		const config: SelectorConfig = { id: false, testId: false, role: false, className: false };
		const result = getElementName(config, element!);
		expect(result).toBe('div > div > div > div:nth-child');
	});
});
