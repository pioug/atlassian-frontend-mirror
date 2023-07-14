import evaluateInner from '../../../utils/evaluate-inner';

describe('css-reset evaluateInner', () => {
  it('should handle simple interpolation', () => {
    expect(evaluateInner`.head { color: red; }`).toBe(`.head { color: red; }`);
  });
  it('should handle function interpolation', () => {
    const color = () => '#303030';
    expect(evaluateInner`.head { color: ${color()} }`).toBe(
      `.head { color: #303030 }`,
    );
  });
  it('should handle two level function interpolation', () => {
    const themed = () => () => '#303030';
    const color = themed();
    expect(evaluateInner`.head { color: ${color} }`).toBe(
      `.head { color: #303030 }`,
    );
  });
  it('should handle two level function interpolation which returns template string with interpolation', () => {
    const color = () => '#303030';
    const headStyle = () => () => `color: ${color()}`;
    expect(evaluateInner`.head { ${headStyle} }`).toBe(
      `.head { color: #303030 }`,
    );
  });
});
