export const presidents: ({
    id: number;
    name: string;
    party: string;
    number: number;
} | {
    id: number;
    name: string;
    party: string;
    number: string;
})[] = [
	{
		id: 1,
		name: 'George Washington',
		party: 'None, Federalist',
		number: -1,
	},
	{
		id: 2,
		name: 'John Adams',
		party: 'Federalist',
		number: 2,
	},
	{
		id: 3,
		name: 'Thomas Jefferson',
		party: 'Democratic-Republican',
		number: -3,
	},
	{
		id: 4,
		name: 'James Madison',
		party: 'Democratic-Republican',
		number: -4,
	},
	{
		id: 5,
		name: 'Jámes Monroe',
		party: 'Democratic-Republican',
		number: -20,
	},
	{
		id: 6,
		name: 'John Quincy Adams',
		party: 'Democratic-Republican',
		number: -1,
	},
	{
		id: 7,
		name: 'Andrew Jackson',
		party: 'Democrat',
		number: -2,
	},
	{
		id: 8,
		name: 'Martin van Buren',
		party: 'Democrat',
		number: -3,
	},
	{
		id: 9,
		name: 'William H. Harrison',
		party: 'Whig',
		number: 0,
	},
	{
		id: 10,
		name: 'John Tyler',
		party: 'Whig',
		number: 5,
	},
	{
		id: 11,
		name: 'Zachary Taylor',
		party: 'Whig',
		number: 0,
	},
	{
		id: 12,
		name: 'Millard Fillmore',
		party: 'Whig',
		number: 4,
	},
	{
		id: 13,
		name: '<Test String 2>',
		party: 'Democrat',
		number: 'test',
	},
	{
		id: 14,
		name: '<Test String 1>',
		party: 'Democrat',
		number: 'a test',
	},

	{
		id: 15,
		name: '<Number as string>',
		party: 'Democrat',
		number: '1',
	},
	{
		id: 16,
		name: '<Number as string 2>',
		party: 'Democrat',
		number: '5',
	},
	{
		id: 17,
		name: '<Number as string 3>',
		party: 'Democrat',
		number: '10',
	},
	{
		id: 18,
		name: '<Empty String>',
		party: 'Democrat',
		number: '',
	},
];
