import warnOnce from '../warn-once';

describe('#warnOnce', () => {
  it('should outputs a warning message only once per session', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation();
    warnOnce('warnMessage');
    warnOnce('warnMessage');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
