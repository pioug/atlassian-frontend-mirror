export const siteEmojiFoo: {
    category: string; creatorUserId: string; fallback: string; id: string; name: string; order: number; representation: {
        height: number;
        imagePath: string;
        width: number;
    }; searchable: boolean; shortName: string; skinVariations: never[]; type: string;
} = {
	id: 'foo',
	name: 'foo',
	fallback: ':foo:',
	type: 'SITE',
	category: 'CUSTOM',
	order: -1000,
	searchable: true,
	shortName: ':foo:',
	creatorUserId: 'hulk',
	representation: {
		height: 72,
		width: 92,
		imagePath: 'https://image-path-foo.png',
	},
	skinVariations: [],
};
