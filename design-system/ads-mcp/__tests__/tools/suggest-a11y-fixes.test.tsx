import { suggestA11yFixesTool } from '../../src/tools/suggest-a11y-fixes';

describe('ads_suggest_a11y_fixes tool', () => {
	it('Gives generic advice if there is not a specific match', async () => {
		const result = await suggestA11yFixesTool({
			violation:
				'This is a completely unknown accessibility violation that does not match any patterns',
			code: '<div>Some code</div>',
			component: 'MyComponent',
			context: 'Testing unknown violations',
		});

		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe('text');

		const parsedResult = JSON.parse(result.content[0].text);
		expect(parsedResult.title).toBe('Table Accessibility Issues');
	});

	it("Returns a piece of advice if the violation exactly matches that advice's key", async () => {
		const result = await suggestA11yFixesTool({
			violation: 'button missing label',
			code: '<button onClick={handleClose}><CloseIcon /></button>',
			component: 'CloseButton',
			context: 'Modal close button',
		});

		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe('text');

		const parsedResult = JSON.parse(result.content[0].text);
		expect(parsedResult.matchedFixType).toBe('button missing label');
		expect(parsedResult.title).toBe('Button Missing Accessible Label');
	});

	it('Returns a best match based on keyword counting if there is no exact match', async () => {
		const result = await suggestA11yFixesTool({
			violation: 'button needs accessible name for screen reader',
			code: '<button><SaveIcon /></button>',
			component: 'SaveButton',
			context: 'Form save action',
		});

		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe('text');

		const parsedResult = JSON.parse(result.content[0].text);
		// Should match 'button missing label' due to keywords 'button', 'accessible', 'name', 'screen reader'
		expect(parsedResult.matchedFixType).toBe('button missing label');
		expect(parsedResult.title).toBe('Button Missing Accessible Label');
	});
});
