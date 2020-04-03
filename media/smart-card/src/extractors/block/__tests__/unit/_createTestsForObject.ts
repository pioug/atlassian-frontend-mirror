export function createTestsForObject(fixture: any, extractor: Function) {
  const empty = {};

  it('should extract a link when the object has a url', () => {
    expect(extractor(fixture)).toHaveProperty(
      'link',
      'https://www.example.com/',
    );
  });

  it('should not extract a link when the object does not have a url', () => {
    expect(extractor(empty)).not.toHaveProperty('link');
  });

  it('should extract the context text when the object has a generator name', () => {
    expect(extractor(fixture)).toHaveProperty('context.text', 'My app');
  });

  it('should not extract the context text when the object does not have a generator name', () => {
    expect(extractor(empty)).toHaveProperty('context.text', undefined);
  });

  it('should extract the context icon when the object has a generator icon', () => {
    expect(extractor(fixture)).toHaveProperty(
      'context.icon',
      'https://www.example.com/icon.jpg',
    );
  });

  it('should not extract the context icon when the object does not have a generator icon', () => {
    expect(extractor(empty)).toHaveProperty('context.icon', undefined);
  });

  it('should extract the title text when the object has a name', () => {
    expect(extractor(fixture)).toHaveProperty('title', 'Some object');
  });

  it('should extract an empty title text when the object does not have a name', () => {
    expect(extractor(empty)).toHaveProperty('title', '');
  });

  it('should extract the description text when the object has a summary', () => {
    expect(extractor(fixture)).toHaveProperty(
      'description',
      'The object description',
    );
  });

  it('should extract an empty description text when the object does not have a summary', () => {
    expect(extractor(empty)).toHaveProperty('description', '');
  });
}
