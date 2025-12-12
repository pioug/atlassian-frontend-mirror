import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML as fromHTML_ } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { uuid } from '../../../../utils';
import { mention } from '../../../..';

const schema = makeSchema();
const fromHTML = (html: string) => fromHTML_(html, schema);
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema mention node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(mention).toStrictEqual({
			attrs: {
				accessLevel: {
					default: '',
				},
				id: {
					default: '',
				},
				localId: {
					default: null,
				},
				text: {
					default: '',
				},
				userType: {
					default: null,
				},
			},
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'span[data-mention-id]',
				},
			],
			selectable: true,
			toDOM: expect.anything(),
		});
	});

	it('should have mention id and display name when serializing to DOM', () => {
		const html = toHTML(schema.nodes.mention.create({ id: '@bar', text: 'foo bar' }), schema);
		expect(html).toContain('data-mention-id="@bar"');
		expect(html).toContain('contenteditable="false"');
		expect(html).toContain('foo bar');
	});

	it('should have mention id, display name and localId when serializing to DOM', () => {
		const html = toHTML(
			schema.nodes.mention.create({
				id: '@bar',
				text: 'foo bar',
				localId: 'local-id-1',
			}),
			schema,
		);
		expect(html).toContain('data-mention-id="@bar"');
		expect(html).toContain('contenteditable="false"');
		expect(html).toContain('foo bar');
		expect(html).toContain('data-local-id="local-id-1"');
	});

	it('should extract the correct values of mention id and display name', () => {
		const doc = fromHTML("<span data-mention-id='@user-1'>foo bar</span>");
		const mention = doc.firstChild!.firstChild!;

		expect(mention.type.name).toEqual('mention');
		expect(mention.attrs.id).toEqual('@user-1');
		expect(mention.attrs.text).toEqual('foo bar');
	});

	it('should ignore if userType is DEFAULT', () => {
		const html = toHTML(
			schema.nodes.mention.create({
				id: 'id-foo-bar',
				text: '@foo bar',
				userType: 'DEFAULT',
			}),
			schema,
		);
		expect(html).toContain('data-mention-id="id-foo-bar"');
		expect(html).toContain('contenteditable="false"');
		expect(html).toContain('data-user-type="DEFAULT"');
		expect(html).toContain('@foo bar');
	});

	it('should have userType if it is SPECIAL', () => {
		const html = toHTML(
			schema.nodes.mention.create({
				id: 'id-rick',
				text: '@rick',
				userType: 'SPECIAL',
			}),
			schema,
		);
		expect(html).toContain('data-mention-id="id-rick"');
		expect(html).toContain('data-user-type="SPECIAL"');
		expect(html).toContain('@rick');
	});

	it('should have userType if it is APP', () => {
		const html = toHTML(
			schema.nodes.mention.create({
				id: 'id-coffee',
				text: '@coffee',
				userType: 'APP',
			}),
			schema,
		);
		expect(html).toContain('data-mention-id="id-coffee"');
		expect(html).toContain('data-user-type="APP"');
		expect(html).toContain('@coffee');
	});

	it('should extract the valid userTypes - SPECIAL', () => {
		const doc = fromHTML(
			'<span data-mention-id="id-rick" data-user-type="SPECIAL">@Rick Sanchez</span>',
		);
		const mention = doc.firstChild!.firstChild!;

		expect(mention.type.name).toEqual('mention');
		expect(mention.attrs.id).toEqual('id-rick');
		expect(mention.attrs.text).toEqual('@Rick Sanchez');
		expect(mention.attrs.userType).toEqual('SPECIAL');
	});

	it('should extract the valid userTypes - APP', () => {
		const doc = fromHTML('<span data-mention-id="id-coffee" data-user-type="APP">@coffee</span>');
		const mention = doc.firstChild!.firstChild!;

		expect(mention.type.name).toEqual('mention');
		expect(mention.attrs.id).toEqual('id-coffee');
		expect(mention.attrs.text).toEqual('@coffee');
		expect(mention.attrs.userType).toEqual('APP');
	});

	it('should not extract invalid value of userType', () => {
		const doc = fromHTML(
			'<span data-mention-id="id-morty" data-user-type="SIDEKICK">@Morty Smith</span>',
		);
		const mention = doc.firstChild!.firstChild!;

		expect(mention.type.name).toEqual('mention');
		expect(mention.attrs.id).toEqual('id-morty');
		expect(mention.attrs.text).toEqual('@Morty Smith');
		expect(mention.attrs.userType).toEqual(null);
	});

	it('should generate new localId', () => {
		const uuidSpy = jest.spyOn(uuid, 'generate');
		const doc = fromHTML(
			'<span data-mention-id="id-morty" data-user-type="APP" data-local-id="localId">@Morty Smith</span>',
		);
		const mention = doc.firstChild!.firstChild!;

		expect(mention.type.name).toEqual('mention');
		expect(mention.attrs.id).toEqual('id-morty');
		expect(mention.attrs.text).toEqual('@Morty Smith');
		expect(mention.attrs.userType).toEqual('APP');
		expect(mention.attrs.localId).not.toEqual('localId');
		expect(uuidSpy).toHaveBeenCalled();
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'mention'],
	});
}
