import getElementName, { type SelectorConfig } from './get-element-name'; // Adjust the import path accordingly

describe('getElementName', () => {
	let divElement: HTMLElement;

	beforeEach(() => {
		divElement = document.createElement('div');
	});

	it('should return "error" if the element is not an instance of HTMLElement', () => {
		const textNode = document.createTextNode('Not an element');
		expect(
			getElementName({ id: true, testId: true, role: true, className: true }, textNode as any),
		).toBe('error');
	});

	it('should return tag name when no attributes or class names match', () => {
		const config: SelectorConfig = { id: false, testId: false, role: false, className: false };
		expect(getElementName(config, divElement)).toBe('unknown > div');
	});

	it('should return tag name with id if id is specified in config', () => {
		divElement.id = 'uniqueId';
		const config: SelectorConfig = { id: true, testId: false, role: false, className: false };
		expect(getElementName(config, divElement)).toBe('div#uniqueId');
	});

	it('should return tag name with data-testid if testId is specified in config', () => {
		divElement.setAttribute('data-testid', 'testId');
		const config: SelectorConfig = { id: false, testId: true, role: false, className: false };
		expect(getElementName(config, divElement)).toBe('div[data-testid="testId"]');
	});

	it('should return tag name with data-test-id if testId is specified in config', () => {
		divElement.setAttribute('data-test-id', 'testId');
		const config: SelectorConfig = { id: false, testId: true, role: false, className: false };
		expect(getElementName(config, divElement)).toBe('div[data-test-id="testId"]');
	});

	it('should return tag name with role if role is specified in config', () => {
		divElement.setAttribute('role', 'button');
		const config: SelectorConfig = { id: false, testId: false, role: true, className: false };
		expect(getElementName(config, divElement)).toBe('div[role="button"]');
	});

	it('should return tag name with class names if className is specified in config', () => {
		divElement.classList.add('class1', 'class2');
		const config: SelectorConfig = { id: false, testId: false, role: false, className: true };
		expect(getElementName(config, divElement)).toBe('div.class1.class2');
	});

	it('should prioritize data-vc over other attributes if specified', () => {
		divElement.setAttribute('data-vc', 'vcValue');
		divElement.id = 'uniqueId';
		const config: SelectorConfig = {
			id: true,
			testId: true,
			role: true,
			className: true,
			dataVC: true,
		};
		expect(getElementName(config, divElement)).toBe('div[data-vc="vcValue"]');
	});

	it('should prioritize data-vc over other attributes if dataVC undefinded', () => {
		divElement.setAttribute('data-vc', 'vcValue');
		divElement.id = 'uniqueId';
		const config: SelectorConfig = {
			id: true,
			testId: true,
			role: true,
			className: true,
			dataVC: undefined,
		};
		expect(getElementName(config, divElement)).toBe('div[data-vc="vcValue"]');
	});

	it('should return parent element name if no attributes match', () => {
		const parentElement = document.createElement('section');
		parentElement.appendChild(divElement);

		const config: SelectorConfig = { id: false, testId: false, role: false, className: false };
		expect(getElementName(config, divElement)).toBe('unknown > section > div');
	});

	it('should combine primary attributes correctly', () => {
		divElement.id = 'uniqueId';
		divElement.setAttribute('role', 'button');
		const config: SelectorConfig = { id: true, testId: false, role: true, className: false };
		expect(getElementName(config, divElement)).toBe('div#uniqueId[role="button"]');
	});

	it('should not include non-existent attributes', () => {
		const config: SelectorConfig = {
			id: true,
			testId: true,
			role: true,
			className: true,
			dataVC: true,
		};
		expect(getElementName(config, divElement)).toBe('unknown > div');
	});

	describe('escape values', () => {
		describe('malformed URIs', () => {
			it('should not throw error on malformed id', () => {
				divElement.id = '\uD800';

				expect(() => {
					const config: SelectorConfig = { id: true, testId: false, role: false, className: false };
					expect(getElementName(config, divElement)).toBe('div#malformed_value');
				}).not.toThrow();
			});

			it('should not throw error on malformed test id', () => {
				divElement.setAttribute('data-testid', '\uD800');

				expect(() => {
					const config: SelectorConfig = { id: false, testId: true, role: false, className: false };
					expect(getElementName(config, divElement)).toBe('div[data-testid="malformed_value"]');
				}).not.toThrow();
			});

			it('should not throw error on malformed role', () => {
				divElement.setAttribute('role', '\uD800');

				expect(() => {
					const config: SelectorConfig = { id: false, testId: false, role: true, className: false };
					expect(getElementName(config, divElement)).toBe('div[role="malformed_value"]');
				}).not.toThrow();
			});

			it('should not throw error on malformed className', () => {
				divElement.classList.add('class1', '\uD800');

				expect(() => {
					const config: SelectorConfig = { id: false, testId: false, role: false, className: true };
					expect(getElementName(config, divElement)).toBe('div.class1.malformed_value');
				}).not.toThrow();
			});

			it('should not throw error on malformed VC', () => {
				divElement.setAttribute('data-vc', '\uD800');

				expect(() => {
					const config: SelectorConfig = {
						id: false,
						testId: false,
						role: false,
						className: false,
						dataVC: true,
					};
					expect(getElementName(config, divElement)).toBe('div[data-vc="malformed_value"]');
				}).not.toThrow();
			});
		});

		it('should encode attribute', () => {
			divElement.setAttribute('data-testid', 't"t');
			const config: SelectorConfig = { id: false, testId: true, role: false, className: false };
			expect(getElementName(config, divElement)).toBe('div[data-testid="t%22t"]');
		});

		it('should encode id', () => {
			divElement.id = 't t';
			const config: SelectorConfig = { id: true, testId: false, role: false, className: false };
			expect(getElementName(config, divElement)).toBe('div#t%20t');
		});

		it('should encode role', () => {
			divElement.setAttribute('role', 't t');

			const config: SelectorConfig = { id: false, testId: false, role: true, className: false };
			expect(getElementName(config, divElement)).toBe('div[role="t%20t"]');
		});

		it('should encode classname', () => {
			divElement.classList.add('class1', 't"t');

			const config: SelectorConfig = { id: false, testId: false, role: false, className: true };
			expect(getElementName(config, divElement)).toBe('div.class1.t%22t');
		});

		it('should encode data-vc', () => {
			divElement.setAttribute('data-vc', 't t');

			const config: SelectorConfig = {
				id: false,
				testId: false,
				role: false,
				className: false,
				dataVC: true,
			};
			expect(getElementName(config, divElement)).toBe('div[data-vc="t%20t"]');
		});
	});
});
