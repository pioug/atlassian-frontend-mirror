import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { mediaSingleWithCaptionsFixture } from './__fixtures__/media-single-with-captions';
import { ReactSerializer } from '../../../index';

describe('Renderer - ReactSerializer - MediaSingle', () => {
	const createSerializedFragment = (reactSerializer: ReactSerializer) => {
		const docFromSchema = schema.nodeFromJSON(mediaSingleWithCaptionsFixture);
		return reactSerializer.serializeFragment(docFromSchema.content);
	};
	describe('when media props', () => {
		test('allowCaptions is undefined', () => {
			const reactSerializer = new ReactSerializer({});
			const fragment = createSerializedFragment(reactSerializer);

			expect(fragment).not.toBeNull();
			expect(fragment?.props.children[0].props).toEqual(
				expect.objectContaining({
					allowCaptions: undefined,
				}),
			);
		});
		test('allowCaptions is false', () => {
			const reactSerializer = new ReactSerializer({
				media: { allowCaptions: false },
			});
			const fragment = createSerializedFragment(reactSerializer);

			expect(fragment).not.toBeNull();
			expect(fragment?.props.children[0].props).toEqual(
				expect.objectContaining({
					allowCaptions: false,
				}),
			);
		});
		test('allowCaptions is true and captions is passed through', () => {
			const reactSerializer = new ReactSerializer({
				media: { allowCaptions: true },
			});
			const fragment = createSerializedFragment(reactSerializer);

			expect(fragment).not.toBeNull();
			expect(fragment?.props.children[0].props).toEqual(
				expect.objectContaining({
					allowCaptions: true,
				}),
			);
			// React Serializer will always pass this through even if allowCaptions is false
			expect(fragment?.props.children[0].props.content[1]).toEqual(
				expect.objectContaining({
					type: 'caption',
					content: expect.arrayContaining([
						,
						expect.objectContaining({
							type: 'text',
							text: 'My Cool Caption',
						}),
					]),
				}),
			);
		});
	});
});
