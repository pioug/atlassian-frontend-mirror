export const adfMediaSingle: {
	content: {
		attrs: {
			layout: string;
			width: null;
		};
		content: {
			attrs: {
				alt: string;
				collection: string;
				height: number;
				id: string;
				occurrenceKey: null;
				type: string;
				width: number;
			};
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: null,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
						occurrenceKey: null,
						alt: 'test',
						width: 500,
						height: 374,
					},
				},
			],
		},
	],
};

export const wrappedMediaInsideTable: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
		};
		content: {
			content: {
				attrs: {
					colwidth: number[];
				};
				content: (
					| {
							attrs: {
								layout: string;
								width: number;
							};
							content: {
								attrs: {
									collection: string;
									height: number;
									id: string;
									type: string;
									width: number;
								};
								type: string;
							}[];
							type: string;
					  }
					| {
							attrs: {
								layout: string;
								width?: undefined;
							};
							content: {
								attrs: {
									collection: string;
									height: number;
									id: string;
									type: string;
									width: number;
								};
								type: string;
							}[];
							type: string;
					  }
					| {
							attrs?: undefined;
							content: never[];
							type: string;
					  }
				)[];
				type: string;
			}[];
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [382],
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
								colwidth: [122],
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
								colwidth: [253],
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
								colwidth: [382],
							},
							content: [
								{
									type: 'mediaSingle',
									attrs: {
										width: 15,
										layout: 'wrap-left',
									},
									content: [
										{
											type: 'media',
											attrs: {
												id: 'a559980d-cd47-43e2-8377-27359fcb905f',
												type: 'file',
												collection: 'MediaServicesSample',
												width: 840,
												height: 980,
											},
										},
									],
								},
								{
									type: 'mediaSingle',
									attrs: {
										layout: 'center',
									},
									content: [
										{
											type: 'media',
											attrs: {
												id: 'a559980d-cd47-43e2-8377-27359fcb905f',
												type: 'file',
												collection: 'MediaServicesSample',
												width: 1024,
												height: 683,
											},
										},
									],
								},
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [122],
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
								colwidth: [253],
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
								colwidth: [382],
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
								colwidth: [122],
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
								colwidth: [253],
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
