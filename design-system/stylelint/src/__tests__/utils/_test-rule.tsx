import { getTestRule, type testRule as styleLintTestRule } from 'jest-preset-stylelint';

const testRule: typeof styleLintTestRule = getTestRule();

export default testRule;
