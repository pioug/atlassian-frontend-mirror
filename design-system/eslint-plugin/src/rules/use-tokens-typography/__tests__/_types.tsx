import { type RuleTester } from 'eslint';

type TestsBase = Parameters<RuleTester['run']>[2];
type ValidTests = NonNullable<TestsBase['valid']>;
type InvalidTests = NonNullable<TestsBase['invalid']>;

export type Tests = {
  valid: ValidTests;
  invalid: InvalidTests;
};
