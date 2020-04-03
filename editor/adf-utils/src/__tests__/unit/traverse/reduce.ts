import { reduce } from '../../../traverse/reduce';
import emojisDoc from './__fixtures__/multiple-emojis.json';

describe('Traverse#reduce', () => {
  it('should return a string text joined', () => {
    expect(
      reduce(
        emojisDoc,
        (acc, node) =>
          node.type === 'emoji'
            ? (acc += `| ${node.attrs!.text}: ${node.attrs!.shortName}`)
            : acc,
        '',
      ),
    ).toEqual(
      '| 😀: :grinning:| 🤦‍♂️: :man_facepalming:| 🇷🇺: :flag_ru:| :wtf:: :wtf:',
    );
  });

  it('should match all elements and return a string', () => {
    expect(
      reduce(
        emojisDoc,
        (acc, node) =>
          (acc +=
            node.type === 'emoji'
              ? `| ${node.attrs!.text}: ${node.attrs!.shortName}`
              : `| ${node.type}`),
        '',
      ),
    ).toEqual(
      '| doc| paragraph| 😀: :grinning:| text| paragraph| 🤦‍♂️: :man_facepalming:| text| paragraph| 🇷🇺: :flag_ru:| text| paragraph| :wtf:: :wtf:| text',
    );
  });
});
