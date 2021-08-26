import { MentionDescription } from '@atlaskit/mention';
import {
  memoize,
  mentionToTypeaheadItem,
} from '../../../../../plugins/mentions/type-ahead';

describe('memoization', () => {
  // Spy without having to mock the whole import
  const mentionToTypeaheadMock = jest
    .fn()
    .mockImplementation(mentionToTypeaheadItem);
  const memoConversion = memoize(mentionToTypeaheadMock);
  const mention: MentionDescription = {
    id: 'dummy-mention-id',
  };

  beforeEach(() => {
    memoConversion.clear();
    mentionToTypeaheadMock.mockClear();
  });

  it('should provide correct result', () => {
    const actual = memoConversion.call(mention);
    expect(actual).toEqual(
      expect.objectContaining({
        title: mention.id,
      }),
    );
  });

  it('should memoize result', () => {
    const initial = memoConversion.call(mention);
    const memoized = memoConversion.call(mention);
    expect(initial).toEqual(memoized);
  });

  it('should not call backend more than once', () => {
    memoConversion.call(mention);
    memoConversion.call(mention);
    memoConversion.call(mention);
    expect(mentionToTypeaheadMock).toBeCalledTimes(1);
  });

  it('should reset after clear', () => {
    const initial = memoConversion.call(mention);
    memoConversion.clear();
    const memoized = memoConversion.call(mention);

    expect(initial).not.toStrictEqual(memoized);
    expect(initial).toMatchObject({
      title: memoized.title,
    });
    expect(mentionToTypeaheadMock).toBeCalledTimes(2);
  });

  it('should memoize expected value', () => {
    const mentionTwo: MentionDescription = {
      id: 'dummy-mention-id-two',
    };

    const mentionResult = memoConversion.call(mention);
    const mentionTwoResult = memoConversion.call(mentionTwo);

    expect(mentionResult).toMatchObject({
      title: mention.id,
      mention: mention,
    });

    expect(mentionTwoResult).toMatchObject({
      title: mentionTwo.id,
      mention: mentionTwo,
    });
  });
});
