import { createTransformer } from '@atlaskit/codemod-utils';

import { mathToBinaryExpressions } from '../migrations/math-to-binary-expressions';

const transformer = createTransformer([mathToBinaryExpressions]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('convert theme/math', () => {
  const supportedParsers = ['tsx', 'babylon'];

  supportedParsers.forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { math } from '@atlaskit/theme'`,
        ``,
        'should remove entire import statement if `math` is the only named specifier',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { gridSize, math, colors } from '@atlaskit/theme';
        `,
        `import { gridSize, colors } from '@atlaskit/theme';`,
        'should remove `math` import specifier but leave other import specifiers from `@atlaskit/theme`',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { gridSize } from '@atlaskit/theme';
        import { math } from '@atlaskit/theme/math'
        `,
        `import { gridSize } from '@atlaskit/theme';`,
        'should remove `theme/math` entry point import but leave other `@atlaskit/theme` imports',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { multiply, divide } from '@atlaskit/theme/math'`,
        ``,
        'should remove entire import statement if it comes from `@atlaskit/theme/math` entrypoint',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { add } from '@atlaskit/theme/math';

        const padding = add(gridSize, 4);`,
        `const padding = gridSize() + 4;`,
        'should convert add() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { math } from '@atlaskit/theme';
        
        const padding = math.add(gridSize, 4);`,
        `const padding = gridSize() + 4;`,
        'should convert math.add() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { subtract } from '@atlaskit/theme/math';

        const padding = subtract(gridSize, 4);`,
        `const padding = gridSize() - 4;`,
        'should convert subtract() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { math } from '@atlaskit/theme';
        
        const padding = math.subtract(gridSize, 4);`,
        `const padding = gridSize() - 4;`,
        'should convert math.subtract() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { multiply } from '@atlaskit/theme/math';

        const padding = multiply(gridSize, 4);`,
        `const padding = gridSize() * 4;`,
        'should convert multiply() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { math } from '@atlaskit/theme';
        
        const padding = math.multiply(gridSize, 4);`,
        `const padding = gridSize() * 4;`,
        'should convert math.multiply() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { divide } from '@atlaskit/theme/math';

        const padding = divide(gridSize, 4);`,
        `const padding = gridSize() / 4;`,
        'should convert divide() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `import { math } from '@atlaskit/theme';
        
        const padding = math.divide(gridSize, 4);`,
        `const padding = gridSize() / 4;`,
        'should convert math.divide() to basic JS binary expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
        import { add, subtract, multiply, divide } from '@atlaskit/theme/math';

        const ExampleStyle = {
          paddingTop: add(gridSize, 8),
          paddingRight: subtract(gridSize, 6),
          paddingBottom: multiply(gridSize, 4),
          paddingLeft: divide(gridSize, 2)
        }
        `,
        `
        const ExampleStyle = {
          paddingTop: gridSize() + 8,
          paddingRight: gridSize() - 6,
          paddingBottom: gridSize() * 4,
          paddingLeft: gridSize() / 2
        }
        `,
        'converts multiple individually identified math functions (eg. add, divide) to basic JS binary expressions',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
        import { math } from '@atlaskit/theme';

        const ExampleStyle = {
          paddingTop: math.add(gridSize, 8),
          paddingRight: math.subtract(gridSize, 6),
          paddingBottom: math.multiply(gridSize, 4),
          paddingLeft: math.divide(gridSize, 2)
        }
        `,
        `
        const ExampleStyle = {
          paddingTop: gridSize() + 8,
          paddingRight: gridSize() - 6,
          paddingBottom: gridSize() * 4,
          paddingLeft: gridSize() / 2
        }
        `,
        'converts multiple math MemberExpression calls (eg. math.add, math.divide) to basic JS binary expressions',
      );
    });
  });
});
