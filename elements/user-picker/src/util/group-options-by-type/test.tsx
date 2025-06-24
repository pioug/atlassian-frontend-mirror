import { groupOptionsByType } from './index';
import { GroupedOptions } from '../../types';

const expectFormattedMessage = (defaultMessage: string) =>
	expect.objectContaining({
		props: expect.objectContaining({
			defaultMessage,
		}),
	});

describe('groupOptionsByType', () => {
	it('should return original options when groupByTypeOrder is empty', () => {
		const options = [
			{ data: { id: '1', name: 'John Doe', type: 'user' as const }, label: 'John Doe', value: '1' },
		];
		const result = groupOptionsByType(options, []);
		expect(result).toBe(options);
	});

	it('should group options by type in correct order', () => {
		const options = [
			{ data: { id: '1', name: 'John Doe', type: 'user' as const }, label: 'John Doe', value: '1' },
			{ data: { id: '2', name: 'Team A', type: 'team' as const }, label: 'Team A', value: '2' },
			{ data: { id: '3', name: 'Group B', type: 'group' as const }, label: 'Group B', value: '3' },
			{ data: { id: '4', name: 'User C', type: 'user' as const }, label: 'User C', value: '4' },
			{ data: { id: '5', name: 'Team C', type: 'team' as const }, label: 'Team C', value: '5' },
		];
		const groupedOptions = groupOptionsByType(options, ['team', 'user', 'group']);

		expect(groupedOptions).toHaveLength(3);
		expect(groupedOptions).toEqual([
			{
				label: expectFormattedMessage('Teams'),
				options: [
					{ data: { id: '2', name: 'Team A', type: 'team' as const }, label: 'Team A', value: '2' },
					{ data: { id: '5', name: 'Team C', type: 'team' as const }, label: 'Team C', value: '5' },
				],
			},
			{
				label: expectFormattedMessage('People'),
				options: [
					{
						data: { id: '1', name: 'John Doe', type: 'user' as const },
						label: 'John Doe',
						value: '1',
					},
					{ data: { id: '4', name: 'User C', type: 'user' as const }, label: 'User C', value: '4' },
				],
			},
			{
				label: expectFormattedMessage('Groups'),
				options: [
					{
						data: { id: '3', name: 'Group B', type: 'group' as const },
						label: 'Group B',
						value: '3',
					},
				],
			},
		]);
	});

	it('should only include types that are in groupByTypeOrder', () => {
		const options = [
			{ data: { id: '1', name: 'John Doe', type: 'user' as const }, label: 'John Doe', value: '1' },
			{ data: { id: '2', name: 'Team A', type: 'team' as const }, label: 'Team A', value: '2' },
			{ data: { id: '3', name: 'Group B', type: 'group' as const }, label: 'Group B', value: '3' },
		];
		// Only include 'user' and 'team', exclude 'group'
		const groupedOptions = groupOptionsByType(options, ['user', 'team']);

		const groups = groupedOptions as GroupedOptions[];
		expect(groups).toHaveLength(2);
		expect(groups).toEqual([
			{
				label: expectFormattedMessage('People'),
				options: [
					{
						data: { id: '1', name: 'John Doe', type: 'user' as const },
						label: 'John Doe',
						value: '1',
					},
				],
			},
			{
				label: expectFormattedMessage('Teams'),
				options: [
					{ data: { id: '2', name: 'Team A', type: 'team' as const }, label: 'Team A', value: '2' },
				],
			},
		]);
	});
});
