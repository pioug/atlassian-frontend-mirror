import Logger from '../../logger';

describe('NavigationNext Services: Logger', () => {
  const groupCollapsed = jest.fn();
  const groupEnd = jest.fn();

  beforeEach(() => {
    jest.spyOn(global.console, 'log');

    Object.defineProperty(global.console, 'groupCollapsed', {
      value: groupCollapsed,
    });

    Object.defineProperty(global.console, 'groupEnd', {
      value: groupEnd,
    });
  });

  afterEach(() => {
    global.console.log.mockRestore();
    Reflect.deleteProperty(global.console, 'groupCollapsed');
    Reflect.deleteProperty(global.console, 'groupEnd');
  });

  it('should use the default params if constructor receive option as an empty object', () => {
    const logger = new Logger({});
    expect(logger.debugEnabled).toBe(false);
    expect(logger.prefix).toBe('');
    expect(logger.groupCount).toBe(0);
  });

  it('should enable debug if debug option is passed', () => {
    const logger = new Logger({
      debug: true,
    });
    expect(logger.debugEnabled).toBe(true);
  });

  it('should have log prefix if prefix option is passed', () => {
    const logger = new Logger({
      prefix: 'logger-prefix',
    });
    expect(logger.prefix).toBe('logger-prefix:');
  });

  describe('#processArgs', () => {
    it('should return `null` if called in a logger with disable debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.processArgs([])).toBe(null);
    });

    it('should add a prefix in the log if it receives a string', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.processArgs('first log')).toEqual(['prefix: first log']);
    });

    it('should return an array with prefix as a first item if it does not receives a string', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.processArgs({ data: 'first log' })).toEqual([
        'prefix:',
        { data: 'first log' },
      ]);
    });
  });

  describe('#debug', () => {
    it('should return `undefined` if called in a logger with disable debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.debug([])).toBe(undefined);
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it('should add a prefix in the log if it receives a string', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      logger.debug('first log');

      expect(global.console.log).toHaveBeenCalledWith('prefix: first log');
    });
  });

  describe('#debugConditional', () => {
    it('should return `undefined` if called in a logger with disable debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.debugConditional(false, [])).toBe(undefined);
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it('should return `undefined` if is NOT a conditional debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.debugConditional(false, [])).toBe(undefined);
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it('should add a prefix in the log if is a conditional debug', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      logger.debugConditional(true, 'first log');

      expect(global.console.log).toHaveBeenCalledWith('prefix: first log');
    });
  });

  describe('#debugGroupCollapsed', () => {
    it('should return `undefined` if called in a logger with disable debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.debugGroupCollapsed([])).toBe(undefined);
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it('should increase the log counter', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.groupCount).toBe(0);

      logger.debugGroupCollapsed('first log');

      expect(logger.groupCount).toBe(1);
    });

    it('should call console.groupCollapsed function', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.groupCount).toBe(0);

      logger.debugGroupCollapsed('first log');

      expect(groupCollapsed.mock.calls[0]).toEqual(['prefix: first log']);
    });
  });

  describe('#debugGroupEnd', () => {
    it('should return `undefined` if called in a logger with disable debug', () => {
      const logger = new Logger({
        debug: false,
      });
      expect(logger.debugGroupEnd([])).toBe(undefined);
      expect(global.console.log).not.toHaveBeenCalled();
    });

    it('should decrease the log counter', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.groupCount).toBe(0);

      logger.debugGroupEnd('first log');

      expect(logger.groupCount).toBe(-1);
    });

    it('should call console.groupEnd function', () => {
      const logger = new Logger({
        debug: true,
        prefix: 'prefix',
      });
      expect(logger.groupCount).toBe(0);

      logger.debugGroupEnd('first log');

      expect(groupEnd.mock.calls[0]).toEqual(['prefix: first log']);
    });
  });
});
