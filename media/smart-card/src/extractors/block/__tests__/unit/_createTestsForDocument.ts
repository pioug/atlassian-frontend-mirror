import { createTestsForObject } from './_createTestsForObject';

export function createTestsForDocument(
  type: string,
  fixture: any,
  extractor: Function,
) {
  const empty = {};

  createTestsForObject(fixture, extractor);

  it(`should extract comment details when the ${type} has a comment count`, () => {
    expect(extractor(fixture)).toHaveProperty(
      'details',
      expect.arrayContaining([
        expect.objectContaining({
          text: '214',
        }),
      ]),
    );
  });

  it(`should not extract comment details when the ${type} does not have a comment count`, () => {
    expect(extractor(empty)).not.toHaveProperty(
      'details',
      expect.arrayContaining([
        expect.objectContaining({
          text: '214',
        }),
      ]),
    );
  });
}
