import { batch, batchByKey } from '../../../reaction-store/batched';

describe('batch', () => {
  const func = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const batched = batch(func);

  it('should batch calls during the same cycle', () => {
    batched('abc');
    batched('123');

    jest.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith([['abc'], ['123']]);
  });
});

describe('batchByKey', () => {
  const func = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    func.mockClear();
  });

  const batched = batchByKey(func);

  it('should batch based on the first argument', () => {
    batched('1', 'abc');
    batched('1', '123');

    jest.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('1', [['abc'], ['123']]);
  });

  it('should call twice for different keys', () => {
    batched('1', 'abc');
    batched('2', '123');

    jest.runAllTimers();

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith('1', [['abc']]);

    expect(func).toHaveBeenCalledWith('2', [['123']]);
  });
});
