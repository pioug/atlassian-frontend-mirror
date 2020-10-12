import createStream from '../../stream';

describe('event-stream', () => {
  describe('next', () => {
    it('should wait for the next call entering the stream', async () => {
      const stream = createStream();
      const sentValue = { some: 'value' };
      const promiseFromStream = stream.next();
      stream(sentValue);
      const valueFromStream = await promiseFromStream;
      expect(valueFromStream).toBe(sentValue);
    });
    it('should be able to return values already sent to the stream', async () => {
      const stream = createStream();
      const sentValue = { some: 'value' };
      stream(sentValue);
      const valueFromStream = await stream.next();
      expect(valueFromStream).toBe(sentValue);
    });
  });
  describe('skip', () => {
    it('should be able to return the skipped values entering the stream', async () => {
      const stream = createStream();
      const skippedValues = ['a', 'b', 'c'];
      const resolvedSkippedValuesPromise = stream.skip(3);
      stream(skippedValues[0]);
      stream(skippedValues[1]);
      stream(skippedValues[2]);
      const resolvedSkippedValues = await resolvedSkippedValuesPromise;
      expect(resolvedSkippedValues).toMatchObject(skippedValues);
    });
    it('should be able to return the skipped values already sent to the stream', async () => {
      const stream = createStream();
      const skippedValues = ['a', 'b', 'c'];
      stream(skippedValues[0]);
      stream(skippedValues[1]);
      stream(skippedValues[2]);
      const resolvedSkippedValues = await stream.skip(3);
      expect(resolvedSkippedValues).toMatchObject(skippedValues);
    });
  });
  it('should both next + skip operations', async () => {
    const stream = createStream();
    const initialValue = 'a';
    const skippedValues = ['a', 'b', 'c'];
    const resolvedInitialValuePromise = stream.next();
    stream(initialValue);
    const resolvedInitialValue = await resolvedInitialValuePromise;
    expect(resolvedInitialValue).toBe(initialValue);
    stream(skippedValues[0]);
    stream(skippedValues[1]);
    stream(skippedValues[2]);
    const resolvedSkippedValues = await stream.skip(3);
    expect(resolvedSkippedValues).toMatchObject(skippedValues);
  });
  it('should both skip + next operations', async () => {
    const stream = createStream();
    const initialValue = 'a';
    const skippedValues = ['a', 'b', 'c'];
    const resolvedInitialValuePromise = stream.next();
    stream(initialValue);
    const resolvedInitialValue = await resolvedInitialValuePromise;
    expect(resolvedInitialValue).toBe(initialValue);
    stream(skippedValues[0]);
    stream(skippedValues[1]);
    stream(skippedValues[2]);
    const resolvedSkippedValues = await stream.skip(3);
    expect(resolvedSkippedValues).toMatchObject(skippedValues);
  });
});
