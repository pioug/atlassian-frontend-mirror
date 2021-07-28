import React from 'react';
import { getPropsDifference, getShallowPropsDifference } from '../../compare';

describe('#getPropsDifference', () => {
  it('should return added props', () => {
    const oldProps = {
      prop1: 'value1',
      prop2: 'value2',
    };

    const newProps = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
    };

    const difference = getPropsDifference(oldProps, newProps);
    expect(difference.added).toEqual(['prop3']);
    expect(difference.removed.length).toEqual(0);
    expect(difference.changed.length).toEqual(0);
  });

  it('should return deleted props', () => {
    const oldProps = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
    };

    const newProps = {
      prop1: 'value1',
      prop2: 'value2',
    };

    const difference = getPropsDifference(oldProps, newProps);
    expect(difference.removed).toEqual(['prop3']);
    expect(difference.added.length).toEqual(0);
    expect(difference.changed.length).toEqual(0);
  });

  it('keys in keysToIgnore are exempted from comparision', () => {
    const oldProps = {
      prop1: 'value1',
      prop2: 'value21',
      prop3: 'value31',
      prop4: 'value41',
    };

    const newProps = {
      prop1: 'value1',
      prop2: 'value22',
      prop4: 'value42',
    };

    const difference = getPropsDifference(oldProps, newProps, 0, 2, ['prop2']);
    expect(difference.removed).toEqual(['prop3']);
    expect(difference.added.length).toEqual(0);
    expect(difference.changed.length).toEqual(1);
  });

  it('should do reference equality check for react element.', () => {
    const testElement = React.createElement('div');
    const oldProps = {
      prop1: React.createElement('div'),
      prop2: testElement,
    };

    const newProps = {
      prop1: React.createElement('div'),
      prop2: testElement,
    };

    const difference = getPropsDifference(oldProps, newProps);
    expect(difference.added).toEqual([]);
    expect(difference.removed).toEqual([]);
    expect(difference.changed).toEqual([
      {
        key: 'prop1',
        reactElementChanged: true,
      },
    ]);
  });

  describe('changed props', () => {
    it('should return newValue and oldValue for primitive data type.', () => {
      // Want to check with different dummyFunction and dummyObject,
      //  so re-creating dummyFunction and dummyObject in each test.
      function dummyFunction(arg1: string) {
        return arg1;
      }
      const dummyObject = {
        prop1: 'abc',
      };

      const oldProps = {
        prop1: 'value1',
        prop2: 5,
        prop3: 10,
        prop4: 10,
        prop5: dummyObject,
        prop6: function minus(num1: number, num2: number) {
          return num1 - num2;
        },
        prop7: dummyFunction,
      } as any;

      const newProps = {
        prop1: 'newValue1',
        prop2: 10,
        prop3: Symbol('10'),
        prop4: {
          value: 10,
        },
        prop5: dummyObject,
        prop6: function add(num1: number, num2: number) {
          return num1 + num2;
        },
        prop7: dummyFunction,
      } as any;

      const difference = getPropsDifference(oldProps, newProps);
      expect(difference.added.length).toEqual(0);
      expect(difference.removed.length).toEqual(0);
      expect(difference.changed).toEqual([
        {
          key: 'prop1',
          oldValue: 'value1',
          newValue: 'newValue1',
        },
        {
          key: 'prop2',
          oldValue: 5,
          newValue: 10,
        },
        {
          key: 'prop3',
          oldValue: 10,
          newValue: 'Symbol(10)',
        },
        {
          key: 'prop4',
          oldValue: 10,
          newValue: {
            type: 'object',
            keys: ['value'],
          },
        },
        {
          key: 'prop6',
          oldValue: 'function:minus',
          newValue: 'function:add',
        },
      ]);
    });

    it('should return deep compared object different for object type', () => {
      // Want to check with different dummyFunction and dummyObject,
      //  so re-creating dummyFunction and dummyObject in each test.
      function dummyFunction(arg1: string) {
        return arg1;
      }
      const dummyObject = {
        prop1: 'abc',
      };

      const oldProps = {
        prop1: {
          subPropLevel1: {
            subPropLevel2: {
              abc: 'abc',
              xyz: 'xyz',
              subPropLevel31: function minus(num1: number, num2: number) {
                return num1 - num2;
              },
              subPropLevel32: dummyFunction,
            },
            subPropLevel21: 10,
            subPropLevel22: dummyObject,
          },
        },
      } as any;

      const newProps = {
        prop1: {
          subPropLevel1: {
            subPropLevel2: {
              abc: 'newABC',
              pqr: 'pqr',
              subPropLevel31: function add(num1: number, num2: number) {
                return num1 + num2;
              },
              subPropLevel32: dummyFunction,
            },
            subPropLevel21: {
              num1: 10,
              num2: 11,
            },
            subPropLevel22: dummyObject,
          },
        },
      } as any;

      const difference = getPropsDifference(oldProps, newProps);
      expect(difference.added.length).toEqual(0);
      expect(difference.removed.length).toEqual(0);
      expect(difference.changed).toEqual([
        {
          key: 'prop1',
          difference: {
            added: [],
            removed: [],
            changed: [
              {
                key: 'subPropLevel1',
                difference: {
                  added: [],
                  removed: [],
                  changed: [
                    {
                      key: 'subPropLevel2',
                      difference: {
                        added: ['pqr'],
                        removed: ['xyz'],
                        changed: [
                          {
                            key: 'abc',
                            newValue: 'newABC',
                            oldValue: 'abc',
                          },
                          {
                            key: 'subPropLevel31',
                            oldValue: 'function:minus',
                            newValue: 'function:add',
                          },
                        ],
                      },
                    },
                    {
                      key: 'subPropLevel21',
                      oldValue: 10,
                      newValue: {
                        type: 'object',
                        keys: ['num1', 'num2'],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });
  });
});

describe('#getShallowPropsDifference', () => {
  it('should return added props', () => {
    const oldProps = {
      prop1: 'value1',
      prop2: 'value2',
    };

    const newProps = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
    };

    const difference = getShallowPropsDifference(oldProps, newProps);
    expect(difference.added).toEqual(['prop3']);
    expect(difference.removed.length).toEqual(0);
    expect(difference.changed.length).toEqual(0);
  });

  it('should return deleted props', () => {
    const oldProps = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
    };

    const newProps = {
      prop1: 'value1',
      prop2: 'value2',
    };

    const difference = getShallowPropsDifference(oldProps, newProps);
    expect(difference.removed).toEqual(['prop3']);
    expect(difference.added.length).toEqual(0);
    expect(difference.changed.length).toEqual(0);
  });

  it('should return changed props', () => {
    const oldProps = {
      prop2: { a: 10 },
      prop3: 'value3',
    } as any;

    const newProps = {
      prop1: 'value1',
      prop2: { b: 10 },
    } as any;

    const difference = getShallowPropsDifference(oldProps, newProps);
    expect(difference.removed).toEqual(['prop3']);
    expect(difference.added).toEqual(['prop1']);
    expect(difference.changed).toEqual(['prop2']);
  });
});
