import { name } from '../../../../version.json';
import {
  toHTML,
  fromHTML,
  doc,
  ol,
  li,
  p,
  schema,
} from '../../../../../test-helpers';

describe(`${name}/schema listItem node`, () => {
  it('should be possible to create a list item with a single paragraph', () => {
    const html = toHTML(
      schema.nodes.listItem.create({}, schema.nodes.paragraph.create()),
      schema,
    );
    expect(html).toContain('<li><p></p></li>');
  });

  it('should not be possible to have blockquote inside list', () => {
    const docFromHTML = fromHTML(
      '<ol><li><blockquote>text</blockquote></li></ol>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(doc(ol(li(p('text')))).toJSON());
  });

  it('should be possible to have paragraph inside list', () => {
    const docFromHTML = fromHTML('<ol><li><p>text</p></li></ol>', schema);
    expect(docFromHTML.toJSON()).toEqual(doc(ol(li(p('text')))).toJSON());
  });

  it('should be possible to have sublist inside list', () => {
    const docFromHTML = fromHTML(
      '<ol><li><p>text</p><ol><li><p>sublist</p></li></ol></li></ol>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(
      doc(ol(li(p('text'), ol(li(p('sublist')))))).toJSON(),
    );
  });

  it('should not be possible to have sublist and first child inside list', () => {
    const docFromHTML = fromHTML(
      '<ol><li><ol><li><p>sublist</p></li></ol><p>text</p></li></ol>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(
      doc(ol(li(p('sublist'), p('text')))).toJSON(),
    );
  });
});
