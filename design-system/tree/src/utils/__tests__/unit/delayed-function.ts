import DelayedFunction from '../../delayed-function';

jest.useFakeTimers();
const mockCallback = jest.fn();

describe('@atlaskit/tree - utils/delayed-function', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets timer with the given time', () => {
    const timer = new DelayedFunction(5000);
    timer.start(mockCallback);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);
  });

  it('calls the function after the timer expires', () => {
    const timer = new DelayedFunction(5000);
    timer.start(mockCallback);
    jest.runAllTimers();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('does not call if stopped earlier', () => {
    const timer = new DelayedFunction(5000);
    timer.start(mockCallback);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    timer.stop();
    jest.runAllTimers();
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});
