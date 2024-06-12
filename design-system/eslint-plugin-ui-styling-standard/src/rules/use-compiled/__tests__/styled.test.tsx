import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('styled API - fixable', rule, {
	valid: [],
	invalid: ['@emotion/styled', 'styled-components'].flatMap((importSource) => [
		{
			name: `[${importSource}] styles are a plain object with literal values`,
			code: `
          import styled from '${importSource}';

          const Component = styled.div({
            color: 'red',
          });
        `,
			output: `
          import { styled } from '@compiled/react';

          const Component = styled.div({
            color: 'red',
          });
        `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
	]),
});

/**
 * These test cases have no auto-fix because we are considering
 * them unsafe to automatically convert.
 */
tester.run('styled API - not fixable', rule, {
	valid: [],
	invalid: ['@emotion/styled', 'styled-components'].flatMap((importSource) => [
		{
			name: `[${importSource}] function as style argument`,
			code: `
        import styled from '${importSource}';

        const Component = styled.div(() => ({
          color: 'red',
        }));
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
		{
			name: `[${importSource}] function as style object value`,
			code: `
        import styled from '${importSource}';

        const Component = styled.div({
          color: () => 'red',
        });
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
		{
			name: `[${importSource}] identifier as style object value`,
			code: `
        import styled from '${importSource}';

        const textColor = 'red';
        const Component = styled.div({
          color: textColor,
        });
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
		{
			/**
			 * We could auto-fix this safely but intentionally
			 * keeping this rule very simple for now.
			 */
			name: `[${importSource}] function call as style object value`,
			code: `
        import styled from '${importSource}';
        import { token } from '@atlaskit/tokens';

        const Component = styled.div({
          color: token('color.text'),
        });
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
		{
			name: `[${importSource}] styled call extends component`,
			code: `
        import styled from '${importSource}';
        import { BaseComponent } from './base-component';

        const Component = styled(BaseComponent)({});
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
		{
			name: `[${importSource}] with unsupported named import`,
			code: `
        import styled, { type CSSObject } from '${importSource}';

        const Component = styled.div({
          color: 'red',
        });
      `,
			errors: [{ messageId: 'use-compiled' }],
			options: [{ canAutoFix: true }],
		},
	]),
});
