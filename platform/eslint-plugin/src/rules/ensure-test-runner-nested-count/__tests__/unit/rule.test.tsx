import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('Warning about too many nested test runners', () => {
  tester.run('ensure-test-runner-nested-count', rule, {
    valid: [
      {
        code: `describe('1 FF', () => {
          ffTest('uip.sample.color', () => {
            const { getByText } = render(<SampleComponent />);
            expect(getByText('SampleComponent')).toBeDefined();
          });
        });`,
      },
      {
        code: `describe('2 FFs', () => {
          ffTest(
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
        });`,
      },
      {
        code: `ffTest(
          'uip.sample.color',
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {},
              () => {},
              ff,
            ),
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {},
              () => {},
              ff,
            ),
        );`,
      },
      {
        code: `ffTest(
          'uip.sample.color',
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              ff,
            ),
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              () => {},
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              ff,
            ),
        );`,
      },
      {
        code: `
        ffTest(
          'uip.sample.color',
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              ff,
            ),
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  (ff) =>
                    ffTest(
                      'uip.sample.opacity',
                      () => {},
                      () => {},
                      ff,
                    ),
                  () => {},
                  ff,
                ),
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  (ff) =>
                    ffTest(
                      'uip.sample.opacity',
                      () => {},
                      () => {},
                      ff,
                    ),
                  ff,
                ),
              ff,
            ),
        );`,
      },
    ],
    invalid: [
      {
        code: `
        describe('5 FFs', () => {
          ffTest(
            'uip.sample.color',
            (ff) =>
              ffTest(
                'uip.sample.backgroundColor',
                (ff) =>
                  ffTest(
                    'uip.sample.display',
                    () => {},
                    () => {},
                    ff,
                  ),
                (ff) =>
                  ffTest(
                    'uip.sample.display',
                    () => {},
                    () => {},
                    ff,
                  ),
                ff,
              ),
            (ff) =>
              ffTest(
                'uip.sample.backgroundColor',
                (ff) =>
                  ffTest(
                    'uip.sample.display',
                    (ff) =>
                      ffTest(
                        'uip.sample.opacity',
                        (ff) =>
                          ffTest(
                            'uip.sample.font',
                            () => {},
                            () => {},
                            ff,
                          ),
                        () => {},
                        ff,
                      ),
                    () => {},
                    ff,
                  ),
                (ff) =>
                  ffTest(
                    'uip.sample.display',
                    () => {},
                    (ff) =>
                      ffTest(
                        'uip.sample.opacity',
                        () => {},
                        () => {},
                        ff,
                      ),
                    ff,
                  ),
                ff,
              ),
          );
        });`,
        errors: [
          {
            messageId: 'tooManyNestedTestRunner',
            data: {
              nestedTestRunner: 5,
            },
          },
        ],
      },
      {
        code: `
        ffTest(
          'uip.sample.color',
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  () => {},
                  ff,
                ),
              ff,
            ),
          (ff) =>
            ffTest(
              'uip.sample.backgroundColor',
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  (ff) =>
                    ffTest(
                      'uip.sample.opacity',
                      (ff) =>
                        ffTest(
                          'uip.sample.font',
                          (ff) =>
                            ffTest(
                              'uip.sample.border',
                              () => {},
                              () => {},
                              ff,
                            ),
                          () => {},
                          ff,
                        ),
                      () => {},
                      ff,
                    ),
                  () => {},
                  ff,
                ),
              (ff) =>
                ffTest(
                  'uip.sample.display',
                  () => {},
                  (ff) =>
                    ffTest(
                      'uip.sample.opacity',
                      () => {},
                      () => {},
                      ff,
                    ),
                  ff,
                ),
              ff,
            ),
        );`,
        errors: [
          {
            messageId: 'tooManyNestedTestRunner',
            data: {
              nestedTestRunner: 6,
            },
          },
        ],
      },
    ],
  });
});
