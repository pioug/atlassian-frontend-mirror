import { name } from '../../../../version.json';
import {
  fromHTML,
  toHTML,
  schema,
  doc,
  p,
  blockquote,
} from '../../../../../test-helpers';

describe(`${name}/schema blockquote node`, () => {
  it('should be possible to create a blockquote with a paragraph', () => {
    const html = toHTML(
      schema.nodes.blockquote.create({}, schema.nodes.paragraph.create()),
      schema,
    );
    expect(html).toEqual('<blockquote><p></p></blockquote>');
  });

  it('should not be possible to have heading inside blockquote', () => {
    const docFromHTML = fromHTML(
      '<blockquote><h2>text</h2></blockquote>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(doc(blockquote(p('text'))).toJSON());
  });

  it('should be possible to have paragraph inside blockquote', () => {
    const docFromHTML = fromHTML(
      '<blockquote><p>text</p></blockquote>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(doc(blockquote(p('text'))).toJSON());
  });

  it('should not be possible to have list inside blockquote', () => {
    const docFromHTML = fromHTML(
      '<blockquote><ol><li>text</li></ol></blockquote>',
      schema,
    );
    expect(docFromHTML.toJSON()).toEqual(doc(blockquote(p('text'))).toJSON());
  });
});
