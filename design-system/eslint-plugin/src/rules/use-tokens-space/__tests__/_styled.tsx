import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.';

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
      width: 8px;
    \`;
  `,

	outdent`
    // ignores multi-values
    import { styled } from '@compiled/styled';

    const Container = styled.div({ 
      padding: '8px 12px',
    });
  `,

	outdent`
    // ignores 0 (to match ensure-design-token-usage)
    import { styled } from 'styled-component';

    const Container = styled.div({ 
      padding: '0px',
      margin: 0,
      paddingBlock: '0rem',
      paddingInline: '0em',
    });
  `,

	outdent`
    // ignores already tokenised values
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({ 
      padding: token('space.100'),
    });
  `,

	outdent`
    // ignores CSS global values
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({ 
      padding: 'unset',
      margin: 'auto',
    });
  `,

	outdent`
    // ignores CSS vars
    import { styled } from 'styled-component';
    import { token } from '@atlaskit/tokens';

    const Container = styled.div({ 
      padding: 'var(--grid)',
    });
  `,

	outdent`
    // ignores complicated values
    import { styled } from 'styled-component';

    const gridSize = '8px';
    const Container = styled.div({
      paddingBottom: (padding) => \`\${padding}px\`,
      paddingBottom: props => props.margin,
      marginTop: padding ? '8px' : '16px',
      margin: gridSize,
      marginBottom: \`\${gridSize}\`,
      marginTop: "calc(-1 * 8px)",
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for styled call with tokenisable entry
      import { styled } from '@compiled/styled';

      const paddingStyles = styled.div({ padding: '8px' });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';

      const paddingStyles = styled.div({ padding: token('space.100', '8px') });
    `,
	},
	{
		code: outdent`
      // reports on styled array syntax
      import { styled } from '@compiled/styled';
      const paddingStyles = styled.div([{ padding: '8px' }]);
    `,
		errors: [error],
		output: outdent`
      // reports on styled array syntax
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';
      const paddingStyles = styled.div([{ padding: token('space.100', '8px') }]);
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call with numbers
      import { styled } from '@compiled/styled';
      const paddingStyles = styled.div({ padding: 8 });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with numbers
      import { token } from '@atlaskit/tokens';
      import { styled } from '@compiled/styled';
      const paddingStyles = styled.div({ padding: token('space.100', '8') });
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call with tokenisable entry
      import { styled } from 'styled-components';
      const Container = styled.div({ padding: '8px' });
   `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({ padding: token('space.100', '8px') });
    `,
	},

	{
		code: outdent`
      // it suggests token for styled call that takes a props function
      import { styled } from 'styled-components';

      const Container = styled.div((props) => ({
        margin: 8,
      }));
      `,
		errors: [error],
		output: outdent`
      // it suggests token for styled call that takes a props function
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';

      const Container = styled.div((props) => ({
        margin: token('space.100', '8'),
      }));
    `,
	},

	{
		code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { styled } from 'styled-components';
      const Container = styled.div({ padding: '9px' });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it suggests token valid negative values
      import { styled } from 'styled-components';
      const Container = styled.div({
        padding: '-8px',
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token valid negative values
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({
        padding: token('space.negative.100', '-8px'),
      });
    `,
	},

	{
		code: outdent`
      // handles nested styles
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          padding: '8px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // handles nested styles
      import { token } from '@atlaskit/tokens';
      import { styled } from 'styled-components';
      const Container = styled.div({
        '* >': {
          padding: token('space.100', '8px'),
        }
      });
    `,
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
