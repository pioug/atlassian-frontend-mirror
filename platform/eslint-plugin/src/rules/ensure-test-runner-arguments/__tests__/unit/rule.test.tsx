import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('Feature Flag can only be passed into ffTest as Literal', () => {
  tester.run('ensure-test-runner-arguments', rule, {
    valid: [
      {
        code: `ffTest('sample.feature.flag', () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        });`,
      },
    ],
    invalid: [
      {
        code: `ffTest(myFeatureFlag, () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        });`,
        errors: [
          {
            messageId: 'onlyInlineFeatureFlag',
            data: { identifierName: 'myFeatureFlag' },
          },
        ],
      },
    ],
  });
});

describe('Test functions can only be passed in directly, instead of as variables', () => {
  tester.run('ensure-test-runner-arguments', rule, {
    valid: [
      {
        code: `ffTest('sample.feature.flag', () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        });`,
      },
      {
        code: `ffTest('sample.feature.flag', () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        }, () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('AnotherSampleComponent')).toBeDefined();
        });`,
      },
    ],
    invalid: [
      {
        code: `ffTest('sample.feature.flag', fnToPassIn);`,
        errors: [
          {
            messageId: 'onlyInlineTestFunction',
            data: { identifierName: 'fnToPassIn' },
          },
        ],
      },
      {
        code: `ffTest('sample.feature.flag', () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        }, fnToPassInWhenFlagIsDisabled);`,
        errors: [
          {
            messageId: 'onlyInlineTestFunction',
            data: { identifierName: 'fnToPassInWhenFlagIsDisabled' },
          },
        ],
      },
      {
        code: `ffTest('sample.feature.flag', fnToPassInWhenFlagIsEnabled, () => {
          const { getByText } = render(<SampleComponent />);
          expect(getByText('SampleComponent')).toBeDefined();
        },);`,
        errors: [
          {
            messageId: 'onlyInlineTestFunction',
            data: { identifierName: 'fnToPassInWhenFlagIsEnabled' },
          },
        ],
      },
    ],
  });
});

describe('Verify existing ff overrides are passed down if test runner is nested', () => {
  tester.run('ensure-test-runner-arguments', rule, {
    valid: [
      {
        code: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
      },
    ],
    invalid: [
      {
        code: `ffTest(
          'uip.sample.color',
          () =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
        output: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
        errors: [
          {
            messageId: 'passDownExistingFeatureFlagParam',
          },
        ],
      },
      {
        code: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
        output: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              }, ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
        errors: [
          {
            messageId: 'passDownExistingFeatureFlagArgument',
          },
        ],
      },
      {
        code: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ffExisting,
            ),
        );
        `,
        output: `ffTest(
          'uip.sample.color',
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: red');
              },
              ff,
            ),
          ff =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              () => {
                expect(getByText('SampleComponent')).toHaveStyle('color: blue');
              },
              ff,
            ),
        );
        `,
        errors: [
          {
            messageId: 'passDownExistingFeatureFlagNamesMatch',
          },
        ],
      },
    ],
  });
});
