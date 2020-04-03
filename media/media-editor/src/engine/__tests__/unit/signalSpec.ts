import { Signal } from '../../signal';

interface SignalData {
  message: string;
}

const someData = { message: 'some-message' };

describe('MediaEditor Signal', () => {
  it('should successfully emit with no handler', () => {
    const signal = new Signal<SignalData>();
    signal.emit(someData);
    expect(() => {
      signal.emit(someData);
    }).not.toThrow();
  });

  it('should successfully call reset with no handler', () => {
    const signal = new Signal<SignalData>();
    signal.reset();
    expect(() => {
      signal.reset();
    }).not.toThrow();
  });

  it('should successfully emit with handler', done => {
    const signal = new Signal<SignalData>();
    signal.listen(data => {
      expect(data).toEqual(someData);
      done();
    });
    signal.emit(someData);
  });

  it('should not call handler after reset', () => {
    const signal = new Signal<SignalData>();
    signal.listen(() => {
      throw new Error('This handler must not be called');
    });
    signal.reset();
    signal.emit(someData);
    expect(() => {
      signal.emit(someData);
    }).not.toThrow();
  });

  it('should call second handler after listen twice', done => {
    const signal = new Signal<SignalData>();
    signal.listen(() => {
      throw new Error('This handler must not be called');
    });
    signal.listen(data => {
      expect(data).toEqual(someData);
      done();
    });
    signal.emit(someData);
  });
});
