import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-dynamic-styles', rule, {
  valid: [
    {
      name: 'arrow function expression outside of a styling context',
      code: `
        const arrowFunctionExpression = (props) => ({
          width: props.width
        });
      `,
    },
    {
      name: 'function expression outside of a styling context',
      code: `
        const functionExpression = function(props) {
          return {
            height: props.height
          };
        }
      `,
    },
    {
      name: 'function expressions as object values outside of a styling context',
      code: `
        const styles = {
          width: props => props.width,
          height: function(props) { return props.height }
        };
      `,
    },
    {
      name: "importSources doesn't include the styling library",
      code: `
        import { css } from '@compiled/react';

        const styles = css(props => ({
          width: props.width
        }));
      `,
      options: [{ importSources: [] }],
    },
  ],
  invalid: [
    {
      name: 'function as argument to css',
      code: `
        import { css } from '@compiled/react';

        const styles = css(props => ({
          width: props.width
        }));
      `,
      errors: [{ messageId: 'no-dynamic-styles' }],
    },
    {
      name: 'function as argument to styled',
      code: `
        import { styled } from '@compiled/react';

        const Component = styled.div(props => ({
          width: props.width
        }));
      `,
      errors: [{ messageId: 'no-dynamic-styles' }],
    },
    {
      name: 'multiple functions as arguments',
      code: `
        import { styled } from '@compiled/react';

        const Component = styled.div(
          props => ({
            width: props.width
          }),
          { color: 'red' },
          props => ({
            height: props.height
          })
        );
      `,
      errors: [
        { messageId: 'no-dynamic-styles' },
        { messageId: 'no-dynamic-styles' },
      ],
    },
    {
      name: 'functions as values',
      code: `
        import { styled } from '@compiled/react';

        const Component = styled.div({
          width: props => props.width,
          height: function(props) { return props.height; }
        });
      `,
      errors: [
        { messageId: 'no-dynamic-styles' },
        { messageId: 'no-dynamic-styles' },
      ],
    },
    {
      name: 'importSources includes styling library not in built-in list',
      code: `
        import { css } from 'my-package';

        const styles = css(props => ({
          width: props.width
        }));
      `,
      options: [{ importSources: ['my-package'] }],
      errors: [{ messageId: 'no-dynamic-styles' }],
    },
    {
      // This fails type-checking anyway, but doesn't hurt to test
      name: 'arrow function in template literal',
      code: `
        import { css } from '@compiled/react';

        const styles = css({
          height: \`\${(props) => props.height}px\`,
        });
      `,
      errors: [{ messageId: 'no-dynamic-styles' }],
    },
    {
      name: 'dynamic styles when using styled and overriding another component',
      code: `
        import { styled } from '@compiled/react';
        import { BaseComponent } from './base-component';

        const Component = styled(BaseComponent)({
          width: props => props.width,
          height: function(props) { return props.height; }
        });
      `,
      errors: [
        { messageId: 'no-dynamic-styles' },
        { messageId: 'no-dynamic-styles' },
      ],
    },
  ],
});
