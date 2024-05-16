import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-styled', rule, {
  valid: [
    {
      code: `
        import { css, jsx } from '@emotion/react';

        const styles = css({ color: 'red' });

        const Component = ({ children }) => {
          return <div css={styles}>{children}</div>;
        };
      `,
    },
    {
      code: `
        import { Box, xcss } from '@atlaskit/primitives';

        const styles = xcss({
          color: 'color.text.subtlest',
        });

        const Component = ({ children }) => {
          return <Box xcss={styles}>{children}</Box>;
        };
      `
    }
  ],
  invalid: [
    {
      code: `
        import styled from 'styled-components';

        const Component = styled.div\`color: red;\`
      `,
      errors: [{ messageId: 'no-styled' }],
    },
    {
      code: `
        import styled from 'styled-components';

        export default styled.div({ color: 'red' });
      `,
      errors: [{ messageId: 'no-styled' }],
    },
    {
      code: `
      import { styled as styled3 } from '@compiled/react';

      export const ComponentTwo = styled3(Component)({ color: 'blue' });
      `,
      errors: [{ messageId: 'no-styled' }],
    },
    {
      code: `
      import styled from 'styled-components';

      export default styled.div.attrs(props => ({ 'data-testid': props.testId }))({ color: 'red' });
      `,
      errors: [{ messageId: 'no-styled' }],
    },
    {
      code: `
      import styled from 'styled-components';

      export default styled.div.attrs(props => ({ 'data-testid': props.testId }))\`color: red\`;
      `,
      errors: [{ messageId: 'no-styled' }],
    }
  ],
});
