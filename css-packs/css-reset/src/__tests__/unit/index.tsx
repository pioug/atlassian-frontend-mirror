import cssResetStyles from '../../index';

describe('@ataskit/css-reset - styleSheet', () => {
  it('should not have [object Object]', () => {
    expect(cssResetStyles).not.toContain('[object Object]');
  });
  it('should not have [Function', () => {
    expect(cssResetStyles).not.toContain('[Function');
  });
});
