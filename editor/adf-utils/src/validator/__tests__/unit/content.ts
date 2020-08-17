jest.mock('../../../validator/specs', () => ({
  nodeA: {
    props: {
      type: { type: 'enum', values: ['nodeA'] },
      content: {
        type: 'array',
        items: ['nodeB'],
        minItems: 1,
        maxItems: 2,
      },
    },
  },
  nodeB: {
    props: {
      type: { type: 'enum', values: ['nodeB'] },
    },
  },
}));

import { validator } from '../../../validator/validator';

describe('validate content', () => {
  const validate = validator();

  test('minItems', () => {
    const run = () => {
      validate({
        type: 'nodeA',
        content: [],
      });
    };
    expect(run).toThrowError(`nodeA: 'content' should have more than 1 child.`);
  });

  test('maxItems', () => {
    const run = () => {
      validate({
        type: 'nodeA',
        content: [{ type: 'nodeB' }, { type: 'nodeB' }, { type: 'nodeB' }],
      });
    };
    expect(run).toThrowError(`nodeA: 'content' should have less than 2 child`);
  });
});
