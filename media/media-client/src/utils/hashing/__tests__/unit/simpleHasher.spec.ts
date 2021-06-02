import { SimpleHasher } from '../../simpleHasher';

describe('SimpleHasher', () => {
  const blob = new Blob(['1234567890']);

  it('should hash simple blob', () =>
    new SimpleHasher().hash(blob).then((hash) => {
      expect(hash).toEqual('01b307acba4f54f55aafc33bb06bbbf6ca803e9a');
    }));

  it('should return rejected promise when invalid input is given', () =>
    new SimpleHasher().hash(null as any).then(
      () => {
        throw new Error('Promise was expected to fail');
      },
      (error) => {
        // This it actually thrown by jsdom, but idea is the same - to test this func to fail
        expect(error).not.toBeUndefined();
      },
    ));
});
