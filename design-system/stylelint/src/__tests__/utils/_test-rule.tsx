/// <reference types="jest-preset-stylelint" />

// @ts-ignore
import getTestRule from 'jest-preset-stylelint/getTestRule';

const testRule: JestPresetStylelint.TestRule = getTestRule();

export default testRule;
