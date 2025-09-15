import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of shape tokens is preferred over the direct application of border radius and border width properties.';

const valid = [
	outdent`
    // ignores styles that don't contain fixable properties
    import { styled } from '@compiled/styled';

    const Container = styled.div({
      display: 'block',
      width: '8px',
    });
  `,

	outdent`
    // ignores styles that use template literal syntax
    import { styled } from '@compiled/styled';

    const Container = styled.div\`
      display: block;
      border-radius: 3px;
    \`;
  `,

	outdent`
    // ignores multi-values
    import { styled } from '@compiled/styled';

    const Container = styled.div({
      borderRadius: '8px 12px',
    });
  `,

	outdent`
    // ignores 0 (to match ensure-design-token-usage)
    import { styled } from 'styled-component';

    const Container = styled.div({
      borderRadius: '0px',
      borderWidth: 0,
      borderRadius: '0rem',
      borderWidth: '0em',
    });
  `,

	outdent`
    // ignores already tokenised values
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({
      borderRadius: token('radius.small'),
      borderWidth: token('border.width.outline'),
    });
  `,

	outdent`
    // ignores CSS global values
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({
      borderRadius: 'unset',
      borderWidth: 'initial',
    });
  `,

	outdent`
    // ignores CSS vars
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({
      borderRadius: 'var(--border-radius)',
    });
  `,

	outdent`
    // ignores complicated values
    import { styled } from 'styled-component';

    const gridSize = '8px';
    const Container = styled.div({
      borderWidth: (width) => \`\${width}px\`,
      borderRadius: borderRadius,
      borderRadius: \`\${borderRadius}\`,
      borderWidth: "calc(-1 * 8px)",
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for styled call with tokenisable entry - radius
      import { styled } from '@compiled/styled';

      const containerStyles = styled.div({
        borderRadius: '3px',
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with tokenisable entry - radius
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';

      const containerStyles = styled.div({
        borderRadius: token('radius.small'),
      });
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call with tokenisable entry - border width
      import { styled } from '@compiled/styled';

      const containerStyles = styled.div({
        borderWidth: '1px',
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with tokenisable entry - border width
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';

      const containerStyles = styled.div({
        borderWidth: token('border.width'),
      });
    `,
	},

	{
		code: outdent`
      // reports on styled array syntax
      import { styled } from '@compiled/styled';
      const containerStyles = styled.div([{ borderRadius: '3px' }]);
    `,
		errors: [error],
		output: outdent`
      // reports on styled array syntax
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';
      const containerStyles = styled.div([{ borderRadius: token('radius.small') }]);
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call with numbers
      import { styled } from '@compiled/styled';
      const containerStyles = styled.div({ borderRadius: 6 });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with numbers
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';
      const containerStyles = styled.div({ borderRadius: token('radius.medium') });
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call with tokenisable entry
      import { styled } from 'styled-components';
      const Container = styled.div({
        borderRadius: '8px',
      });
   `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({
        borderRadius: token('radius.large'),
      });
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call that takes a props function
      import { styled } from 'styled-components';

      const Container = styled.div((props) => ({
        borderRadius: 8,
      }));
      `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call that takes a props function
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';

      const Container = styled.div((props) => ({
        borderRadius: token('radius.large'),
      }));
    `,
	},

	{
		code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { styled } from 'styled-components';
      const Container = styled.div({ borderRadius: '9px' });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // handles nested styles - radius
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          borderRadius: '8px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // handles nested styles - radius
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          borderRadius: token('radius.large'),
        }
      });
    `,
	},

	{
		code: outdent`
      // handles nested styles - border width
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          borderLeftWidth: '1px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // handles nested styles - border width
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          borderLeftWidth: token('border.width'),
        }
      });
    `,
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
