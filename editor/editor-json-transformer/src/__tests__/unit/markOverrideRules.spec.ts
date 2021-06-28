import { markOverrideRuleFor } from '../../markOverrideRules';
describe('UnsupportedMark Override Rule', () => {
  describe('which allow override', () => {
    const marksWhichAllowOverride = [
      'link',
      'em',
      'strong',
      'strike',
      'subsup',
      'underline',
      'code',
      'textColor',
      'confluenceInlineComment',
      'breakout',
      'alignment',
      'indentation',
    ];
    marksWhichAllowOverride.forEach((markType) => {
      it(`should return true for ${markType} mark`, () => {
        const overrideRule = markOverrideRuleFor(
          markType,
        ).canOverrideUnsupportedMark();
        expect(overrideRule).toBe(true);
      });
    });
  });

  it('should return false as default behaviour when a mark does not have a rule defined', () => {
    const markType = 'some';
    const overrideRule = markOverrideRuleFor(
      markType,
    ).canOverrideUnsupportedMark();
    expect(overrideRule).toBe(false);
  });
});
