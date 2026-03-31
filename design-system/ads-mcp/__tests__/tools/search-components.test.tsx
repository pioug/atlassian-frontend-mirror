import { searchComponentsTool } from '../../src/tools/search-components';

/**
 * Expected names for `searchComponentsTool({ terms, limit: 2 })` (matches tool default).
 * `[[search terms], [component names]]` — grouped by theme for easier scanning.
 */
const expectedComponentResults: [string[], string[]][] = [
	// Common primitives
	[['button'], ['Button', 'ButtonGroup']],
	[['modal'], ['Modal', 'ModalTitle']],
	[['select'], ['Select', 'PopupSelect']],
	[
		['button', 'modal'],
		['Button', 'Modal', 'IconButton', 'Tooltip'],
	],
	[
		['form', 'footer'],
		['Form', 'FormFooter', 'ModalFooter'],
	],

	// Forms & inputs
	[['checkbox'], ['Checkbox', 'CheckboxField']],
	[['radio'], ['Radio', 'RadioGroup']],
	[['textarea'], ['Textarea', 'TextField']],
	[['toggle'], ['Toggle', 'DropdownItemCheckbox']],

	// Navigation & layout
	[['tabs'], ['Tabs', 'CreatableSelect']],
	[['inline'], ['Inline', 'InlineEdit']],
	[['popup'], ['Popup', 'PopupSelect']],
	[['pagination'], ['Pagination', 'Breadcrumbs']],
	[['breadcrumb'], ['BreadcrumbsItem', 'Breadcrumbs']],
	[['menu'], ['MenuGroup', 'DropdownMenu']],
	[['dropdown'], ['DropdownItemCheckbox', 'DropdownItemRadio']],

	// Content & display
	[['avatar'], ['Avatar', 'AvatarTag']],
	[['badge'], ['Badge', 'Lozenge']],
	[['flag'], ['Flag', 'Banner']],
	[['empty'], ['EmptyState', 'InlineEditableTextfield']],
	[['heading'], ['Heading', 'HeadingContextProvider']],
	[['page'], ['PageHeader', 'Pagination']],
	[['link'], ['Link', 'LinkItem']],
	[['tag'], ['Tag', 'TagGroup']],

	// Date & progress
	[['date'], ['DateTimePicker', 'DatePicker']],
	[['calendar'], ['Calendar', 'DatePicker']],
	[['progress'], ['ProgressTracker', 'ProgressIndicator']],

	// Feedback
	[['spinner'], ['Spinner']],

	// Multi-term (merge can return more than two names)
	[
		['tooltip', 'inline'],
		['Tooltip', 'Inline', 'InlineEdit'],
	],
	[
		['grid', 'stack'],
		['Grid', 'Stack'],
	],
	[
		['text', 'field'],
		['Text', 'Field', 'TextField', 'InlineEditableTextfield'],
	],
	[
		['section', 'message'],
		['Section', 'MessageWrapper', 'SectionMessage', 'ErrorMessage'],
	],
];

describe('search_components tool', () => {
	it('Returns empty results if there are no search terms', async () => {
		const result = await searchComponentsTool({ terms: [] });
		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: '[]',
				},
			],
		});
	});

	it('Returns fuse results when there is no exact name match (e.g. package string)', async () => {
		const result = await searchComponentsTool({
			terms: ['@atlaskit/button'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('Button');
	});

	it('returns suggestive results when there are no matches', async () => {
		const result = await searchComponentsTool({
			terms: ['DOES NOT EXIST XYZ123'],
		});
		expect(result).toEqual({
			content: [
				{
					text: expect.stringContaining("Error: No components found for 'DOES NOT EXIST XYZ123'"),
					type: 'text',
				},
			],
		});
	});

	it('Deduplicates input terms so duplicate search strings do not duplicate the same component', async () => {
		const result = await searchComponentsTool({ terms: ['Button', 'Button'], limit: 2 });
		const names = JSON.parse(result.content[0].text as string).map((c: { name: string }) => c.name);
		expect(names.filter((n: string) => n === 'Button')).toHaveLength(1);
	});

	it.each(expectedComponentResults)(
		'returns fuzzy component names in order for query %s',
		async (query, expectedNames) => {
			const result = await searchComponentsTool({ terms: query, limit: 2 });

			const text = result.content[0]?.type === 'text' ? result.content[0].text : '[]';
			const parsed = JSON.parse(text as string) as { name: string }[];
			expect(parsed.map((t) => t.name)).toEqual(expectedNames);
		},
	);
});
