import { buildSegmentTree } from './index';

describe('buildSegmentTree', () => {
	it('should correctly build a segment tree from the mock data', () => {
		// Convert mock data to the format expected by buildSegmentTree
		const mockData = [
			[{ name: 'jira-spa', segmentId: 'c33SVJk' }],
			[{ name: 'jira-spa', segmentId: '9JnU2yR' }],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.topNav', segmentId: 'nXMG6AF' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.sidebar', segmentId: 'feYoOOD' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.sidebar', segmentId: 'grBpRbi' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'right-sidebar', segmentId: 'P4kvO3B' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'right-sidebar', segmentId: 'uakkiuX' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'Uj4H4lG' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'yuGaLOm' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'HWkQ8v8' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'HWkQ8v8' },
				{ name: 'post-office-placement', segmentId: '0nkmVwt' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'HWkQ8v8' },
				{ name: 'post-office-placement', segmentId: 'iRoOFZR' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'HWkQ8v8' },
				{ name: 'post-office-placement', segmentId: 'iRoOFZR' },
				{ name: 'post-office-placement', segmentId: 'tP2nj8l' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'post-office-placement', segmentId: 'UhZLWE3' },
				{ name: 'post-office-placement.screen-space-flags', segmentId: 'HWkQ8v8' },
				{ name: 'post-office-placement', segmentId: 'iRoOFZR' },
				{ name: 'post-office-placement', segmentId: 'P07NIR8' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'banner', segmentId: 'l9vGkJH' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'banner', segmentId: 'SoCLLJn' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'shared-global-components' },
				{ name: 'growth.jiraLossAversion', segmentId: 'jNbdFOA' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'shared-global-components' },
				{ name: 'growth.jiraLossAversion', segmentId: 'LmFVDgY' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.sidebar', segmentId: 'grBpRbi' },
				{ name: 'nav4-sidebar-content', segmentId: 'fJUNB75' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.sidebar', segmentId: 'grBpRbi' },
				{ name: 'nav4-sidebar-content', segmentId: 'XGOO3nK' },
			],
			[
				{ name: 'jira-spa', segmentId: '9JnU2yR' },
				{ name: 'nav4.sidebar', segmentId: 'grBpRbi' },
				{ name: 'nav4-sidebar-content', segmentId: 'XGOO3nK' },
				{ name: 'nav4-sidebar-recent', segmentId: 'xWbhNc4' },
			],
		];
		const result = buildSegmentTree(mockData);

		// Check the structure of the tree
		expect(result.r).toHaveProperty('c.c33SVJk.n', 'jira-spa');
		expect(result.r).toHaveProperty('c.9JnU2yR.n', 'jira-spa');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('nXMG6AF.n', 'nav4.topNav');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('feYoOOD.n', 'nav4.sidebar');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('grBpRbi.n', 'nav4.sidebar');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('P4kvO3B.n', 'right-sidebar');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('uakkiuX.n', 'right-sidebar');
		expect(result?.r?.c?.['9JnU2yR'].c).toHaveProperty('Uj4H4lG.n', 'post-office-placement');
		expect(result?.r?.c?.['9JnU2yR']?.c?.['UhZLWE3']?.c).toHaveProperty(
			'yuGaLOm.n',
			'post-office-placement.screen-space-flags',
		);
		expect(result?.r?.c?.['9JnU2yR']?.c?.['UhZLWE3']?.c?.['HWkQ8v8']?.c).toHaveProperty(
			'0nkmVwt.n',
			'post-office-placement',
		);
		expect(result?.r?.c?.['9JnU2yR']?.c?.['UhZLWE3']?.c?.['HWkQ8v8']?.c).toHaveProperty(
			'iRoOFZR.n',
			'post-office-placement',
		);
		expect(
			result?.r?.c?.['9JnU2yR']?.c?.['UhZLWE3']?.c?.['HWkQ8v8']?.c?.['iRoOFZR']?.c,
		).toHaveProperty('tP2nj8l.n', 'post-office-placement');
		expect(result?.r?.c?.['9JnU2yR']?.c).toHaveProperty('l9vGkJH.n', 'banner');
		expect(result?.r?.c?.['9JnU2yR']?.c?.['shared-global-components']?.c).toHaveProperty(
			'jNbdFOA.n',
			'growth.jiraLossAversion',
		);
		expect(result?.r?.c?.['9JnU2yR']?.c?.['grBpRbi']?.c).toHaveProperty(
			'fJUNB75.n',
			'nav4-sidebar-content',
		);
	});

	// Additional tests to ensure robustness
	it('should handle empty label stacks', () => {
		const result = buildSegmentTree([]);
		expect(result).toEqual({ r: { n: 'segment-tree-root', c: {} } });
	});

	it('should handle label stacks with no segmentId', () => {
		const simpleStack = [[{ name: 'root' }, { name: 'child' }]];
		const result = buildSegmentTree(simpleStack);
		expect(result).toEqual({
			r: {
				n: 'segment-tree-root',
				c: {
					root: {
						n: 'root',
						c: {
							child: { n: 'child' },
						},
					},
				},
			},
		});
	});

	it('should handle duplicate paths correctly', () => {
		const duplicateStack = [
			[
				{ name: 'a', segmentId: '1' },
				{ name: 'b', segmentId: '2' },
			],
			[
				{ name: 'a', segmentId: '1' },
				{ name: 'b', segmentId: '2' },
			],
		];
		const result = buildSegmentTree(duplicateStack);
		expect(result).toEqual({
			r: {
				n: 'segment-tree-root',
				c: {
					'1': {
						n: 'a',
						c: {
							'2': { n: 'b' },
						},
					},
				},
			},
		});
	});
});
