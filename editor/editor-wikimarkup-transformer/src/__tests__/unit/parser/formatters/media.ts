/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import WikiMarkupTransformer from '../../../..';

describe('WikiMarkup => ADF Formatters - image media', () => {
	const context = {
		conversion: {
			mediaConversion: {
				'image.jpg': { transform: 'abc-123', embed: true },
			},
		},
	};

	test('should detect image media at beginning of the line', () => {
		const wiki = '!image.jpg! text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should detect image media at end of the line', () => {
		const wiki = `This is a !image.jpg!
another line`;

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should detect image media at end of the input', () => {
		const wiki = 'This is a !image.jpg!';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should detect image media at in between of the line', () => {
		const wiki = 'This is a !image.jpg! text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should detect image media surrounded by non alphanumeric characters', () => {
		const wiki = 'This is a (!image.jpg!) text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should not be a image media if surrounded by non-latin characters', () => {
		const wiki = 'This is not a 牛!image.jpg!牛 text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should not be a image media if there is no space before !', () => {
		const wiki = 'This is not a!image.jpg! text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should not be a image media if there is a space after opening !', () => {
		const wiki = 'This is not a ! image.jpg! text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should not be a image media if there is a space before closing !', () => {
		const wiki = 'This is not a !image.jpg ! text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});

	test('should not be a image media if there is not a space after closing !', () => {
		const wiki = 'This is not a !image.jpg!text';

		const transformer = new WikiMarkupTransformer();
		expect(transformer.parse(wiki, context)).toMatchSnapshot();
	});
});
