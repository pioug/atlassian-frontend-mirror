import { BREAKPOINTS_LIST } from '../../config';

describe('config', () => {
  it('BREAKPOINTS_LIST are in the expected order', () => {
    expect(BREAKPOINTS_LIST).toEqual([
      'xxs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      'xxl',
    ]);
  });
});
