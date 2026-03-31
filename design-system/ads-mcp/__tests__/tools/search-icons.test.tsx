import { searchIconsTool } from '../../src/tools/search-icons';

/**
 * Expected componentNames for `searchIconsTool({ terms, limit: 2 })` (matches tool default).
 * `[[search terms], [icon componentName]]`
 */
const expectedIconResults: [string[], string[]][] = [
	// Discovery / actions (core + lab metadata via bundled `icons`)
	[['add'], ['AddIcon', 'PlaylistAddIcon']],
	[['search'], ['AiSearchIcon', 'SearchIcon']],
	[
		['search', 'folder'],
		['AiSearchIcon', 'FolderSharedIcon'],
	],
	[['star'], ['StarStarredIcon', 'StarUnstarredIcon']],
	[['folder'], ['FolderSharedIcon', 'FolderClosedIcon']],
	[['user'], ['PersonIcon', 'MentionIcon']],
	[['calendar'], ['CalendarPlusIcon', 'CalendarIcon']],
	[['settings'], ['SettingsIcon', 'CustomizeIcon']],
	[['delete'], ['DeleteIcon', 'TableRowDeleteIcon']],
	[['copy'], ['CopyIcon', 'TelescopeIcon']],
	[['link'], ['LinkRestrictedAccessIcon', 'LinkIcon']],
	[['video'], ['VideoStrikethroughIcon', 'VideoTheaterModeIcon']],
	[['email'], ['EmailIcon', 'DiagramSymbolSendIcon']],
	[['flag'], ['FlagFilledIcon', 'FlagIcon']],
	[['check'], ['TaskIcon', 'CheckboxCheckedIcon']],
	[['warning'], ['WarningIcon', 'WarningOutlineIcon']],
	[['info'], ['InformationCircleIcon', 'InformationIcon']],
	[['lock'], ['LockUnlockedIcon', 'LockLockedIcon']],
	[['edit'], ['EditBulkIcon', 'EditIcon']],
	[['download'], ['DownloadIcon', 'ChartTrendDownIcon']],
	[['upload'], ['UploadIcon', 'JiraUploadIcon']],
	[['arrow'], ['ArrowCurvedDownLeftIcon', 'ArrowCurvedDownRightIcon']],
	[['chevron'], ['ChevronDownIcon', 'ChevronLeftIcon']],
	[
		['icon', 'close'],
		['CloseIcon', 'AskIcon', 'HandClosedIcon', 'TextConclusionAddIcon'],
	],
	[
		['file', 'image'],
		['FileIcon', 'ImageStrikethroughIcon'],
	],
];

describe('search_icons tool', () => {
	it('Returns empty results if there are no search terms', async () => {
		const result = await searchIconsTool({ terms: [] });
		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: '[]',
				},
			],
		});
	});

	it('Returns fuse results when there is no exact name match', async () => {
		const result = await searchIconsTool({
			terms: ['navigation'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].componentName).toEqual('MenuIcon');
	});

	it('Returns empty results if there are no matches', async () => {
		const result = await searchIconsTool({
			terms: ['DOES NOT EXIST XYZ123'],
		});
		expect(result).toEqual({
			content: [
				{
					text: expect.stringContaining("Error: No icons found for 'DOES NOT EXIST XYZ123'"),
					type: 'text',
				},
			],
		});
	});

	it('Deduplicates input terms so duplicate search strings do not duplicate the same icon', async () => {
		const result = await searchIconsTool({ terms: ['AddIcon', 'AddIcon'], limit: 2 });
		const names = JSON.parse(result.content[0].text as string).map(
			(i: { componentName: string }) => i.componentName,
		);
		expect(names.filter((n: string) => n === 'AddIcon')).toHaveLength(1);
	});

	it.each(expectedIconResults)(
		'returns fuzzy icon componentNames in order for query %s',
		async (query, expectedNames) => {
			const result = await searchIconsTool({ terms: query, limit: 2 });

			const text = result.content[0]?.type === 'text' ? result.content[0].text : '[]';
			const parsed = JSON.parse(text as string) as { componentName: string }[];
			expect(parsed.map((t) => t.componentName)).toEqual(expectedNames);
		},
	);
});
