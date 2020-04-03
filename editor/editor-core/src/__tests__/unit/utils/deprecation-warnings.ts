import deprecationWarnings from '../../../utils/deprecation-warnings';

describe('utils -> deprecationWarnings', () => {
  let spy: jest.SpyInstance<any>;
  beforeAll(() => {
    spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    spy.mockRestore();
  });

  beforeEach(() => {
    deprecationWarnings(
      'TestComponent',
      {
        prop1: 'test value 1',
        prop2: null,
        prop3: 'test value 3',
        prop4: 'test value 4',
      },
      [
        { property: 'prop1', description: 'prop1 is moved', type: 'removed' },
        { property: 'prop2', description: 'prop2 is moved', type: '' },
        {
          property: 'prop3',
          description: '',
          type: 'removed',
          condition: props => typeof props['prop3'] === 'string',
        },
        { property: 'prop5', description: 'prop5 is moved', type: '' },
      ],
    );
  });

  it('calls toHaveBeenCalledTimes correct times with correct message', () => {
    expect(global.console.warn).toHaveBeenCalledTimes(3);
    expect(global.console.warn).toHaveBeenCalledWith(
      'prop1 property for TestComponent is deprecated. prop1 is moved [Will be removed in editor-core@1000.0.0]',
    );
    expect(global.console.warn).toHaveBeenCalledWith(
      'prop2 property for TestComponent is deprecated. prop2 is moved [Will be  in editor-core@1000.0.0]',
    );
    expect(global.console.warn).toHaveBeenCalledWith(
      'prop3 property for TestComponent is deprecated.  [Will be removed in editor-core@1000.0.0]',
    );
  });
});
