export const buildAdfTrailingSpaces = ({
	node,
}: {
	node: { attrs: { [key: string]: any }; type: string };
}): {
	content: {
		content: (
			| {
					attrs: { [key: string]: any };
					type: string;
			  }
			| {
					text: string;
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
} => {
	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					node,
					{
						type: 'text',
						text: ' ',
					},
					node,
					{
						type: 'text',
						text: ' ',
					},
					node,
					{
						type: 'text',
						text: ' ',
					},
				],
			},
		],
	};
};

export const buildAdfNoTrailingSpaces = ({
	node,
}: {
	node: { attrs: { [key: string]: any }; type: string };
}): {
	content: {
		content: {
			attrs: { [key: string]: any };
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
} => {
	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [node, node, node],
			},
		],
	};
};

export const buildAdfMultipleNodesAcrossLines = ({
	node,
}: {
	node: { attrs: { [key: string]: any }; type: string };
}): {
	content: {
		content: {
			attrs: { [key: string]: any };
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
} => {
	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [],
			},
			{
				type: 'paragraph',
				content: [node, node, node],
			},
			{
				type: 'paragraph',
				content: [node, node, node],
			},
			{
				type: 'paragraph',
				content: [node, node, node],
			},
			{
				type: 'paragraph',
				content: [],
			},
		],
	};
};

export const buildAdfMultiline = ({
	node,
}: {
	node: { attrs: { [key: string]: any }; type: string };
}): {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
			localId: string;
		};
		content: {
			content: {
				attrs: {
					colwidth: number[];
				};
				content: {
					content: {
						attrs: { [key: string]: any };
						type: string;
					}[];
					type: string;
				}[];
				type: string;
			}[];
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
} => {
	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'table',
				attrs: {
					isNumberColumnEnabled: false,
					layout: 'default',
					localId: '704b4aa7-f9a6-49e0-9b14-3c2e010bd4ca',
				},
				content: [
					{
						type: 'tableRow',
						content: [
							{
								type: 'tableHeader',
								attrs: {
									colwidth: [56],
								},
								content: [
									{
										type: 'paragraph',
										content: [node, node, node],
									},
								],
							},
							{
								type: 'tableHeader',
								attrs: {
									colwidth: [346],
								},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableHeader',
								attrs: {
									colwidth: [276],
								},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
						],
					},
					{
						type: 'tableRow',
						content: [
							{
								type: 'tableCell',
								attrs: {
									colwidth: [56],
								},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {
									colwidth: [346],
								},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {
									colwidth: [276],
								},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
						],
					},
				],
			},
		],
	};
};
