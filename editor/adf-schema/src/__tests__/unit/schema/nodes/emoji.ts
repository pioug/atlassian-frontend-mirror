import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML as fromHTML_, toHTML } from '../../../../../test-helpers';

const schema = makeSchema();
const fromHTML = (html: string) => fromHTML_(html, schema);

describe(`${name}/schema underline emoji node`, () => {
  it('should have all emoji node props when serializing to DOM', () => {
    const html = toHTML(
      schema.nodes.emoji.create({ shortName: 'abc', id: '123', text: 'xyz' }),
      schema,
    );
    expect(html).toContain('data-emoji-short-name="abc"');
    expect(html).toContain('data-emoji-id="123"');
    expect(html).toContain('data-emoji-text="xyz"');
    expect(html).toContain('contenteditable="false"');
  });

  it('should extract the correct values of emoji id', () => {
    const doc = fromHTML(
      '<span data-emoji-short-name="abc" data-emoji-id="123" data-emoji-text="xyz"></span>',
    );
    const emoji = doc.firstChild!.firstChild!;

    expect(emoji.type.name).toEqual('emoji');
    expect(emoji.attrs.shortName).toEqual('abc');
    expect(emoji.attrs.id).toEqual('123');
    expect(emoji.attrs.text).toEqual('xyz');
  });

  it('should have minimal emoji id props when serializing to DOM (minimal representation)', () => {
    const html = toHTML(
      schema.nodes.emoji.create({ shortName: 'abc' }),
      schema,
    );
    expect(html).toContain('data-emoji-short-name="abc"');
    expect(html).toContain('contenteditable="false"');
  });

  it('should extract the correct values of emoji (minimal representation)', () => {
    const doc = fromHTML("<span data-emoji-short-name='abc'></span>");
    const emoji = doc.firstChild!.firstChild!;

    expect(emoji.type.name).toEqual('emoji');
    expect(emoji.attrs.shortName).toEqual('abc');
    expect(emoji.attrs.id).toEqual('');
    expect(emoji.attrs.text).toEqual('');
  });

  it('should extract the correct values of emoji from bitbucket (minimal representation)', () => {
    const doc = fromHTML(
      '<img class="emoji" data-emoji-short-name="abc" data-emoji-id="123" data-emoji-text="xyz"></img>',
    );
    const emoji = doc.firstChild!.firstChild!;

    expect(emoji.type.name).toEqual('emoji');
    expect(emoji.attrs.shortName).toEqual('abc');
    expect(emoji.attrs.id).toEqual('123');
    expect(emoji.attrs.text).toEqual('xyz');
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'emoji'],
  });
}
