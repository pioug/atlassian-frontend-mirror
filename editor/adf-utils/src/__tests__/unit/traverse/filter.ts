import { filter } from '../../../traverse/filter';
import emojisDoc from './__fixtures__/multiple-emojis.json';
import marksDoc from './__fixtures__/marks.json';

describe('Traverse#filter', () => {
  it('should return all matched elements', () => {
    expect(
      filter(emojisDoc, (node) => node.type === 'emoji'),
    ).toMatchSnapshot();
  });

  it('should return all matched elements of that are satisfying predicate', () => {
    expect(
      filter(
        emojisDoc,
        (node) => node.type === 'emoji' && node.attrs!.text.startsWith(':'),
      ),
    ).toMatchSnapshot();
  });

  it('should return all nodes with links', () => {
    expect(
      filter(marksDoc, (node) =>
        (node.marks || []).some((m) => m.type === 'link'),
      ),
    ).toMatchSnapshot();
  });
});
