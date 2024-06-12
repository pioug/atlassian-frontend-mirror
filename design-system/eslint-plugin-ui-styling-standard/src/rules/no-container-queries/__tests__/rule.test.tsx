import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-container-queries',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'Basic valid test',
				code: `
          import { css } from '@compiled/react';
          const containerStyles = css({
            display: 'flex',
            flexDirection: 'column',
          });
        `,
			},
			{
				name: 'Custom import sources (subtractive)',
				code: `
          import { css } from '@compiled/react';
          const styles = css({
            '@container (width > 400px)': {
              h2: {
                fontSize: '1.5rem',
              }
            }
          });
        `,
				options: [
					{
						importSources: [],
					},
				],
			},
		],
		invalid: [
			{
				name: 'Basic test for @container',
				code: `
        import { css } from '@compiled/react';

        const styles = css({
          '@container (width > 400px)': {
            h2: {
              fontSize: '1.5rem',
            }
          }
        });
      `,
				errors: [{ messageId: 'no-container-queries' }],
			},
			{
				name: '@container template literal in styled div',
				code: `
        import { styled } from '@compiled/react';

        const Component = styled.div({
          [\`@container cardContainer (max-width: \${(CARD_MIN_WIDTH + CARD_MARGIN) * 2}px)\`]: {
            ul: {
                gridTemplateColumns: '1fr 1fr',
            },
          },
          [\`@container cardContainer (max-width: \${CARD_MIN_WIDTH}px)\`]: {
              ul: {
                  gridTemplateColumns: '1fr',
              },
          },
        });
      `,
				errors: [{ messageId: 'no-container-queries' }, { messageId: 'no-container-queries' }],
			},
			{
				name: '@container in styled div under feature flag',
				code: `
          import { styled } from "@compiled/react";
          const Container = styled.div(
            {
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: '0',
              '&:empty': {
                display: 'none',
              },
            },
            () =>
            ff('a-feature-flag') && {
              [\`@container cardContainer (max-width: \${DISPLAYING_FIELDS_MIN_CARD_WIDTH}px)\`]: {
                width: 0,
                overflow: 'hidden',
                visibility: 'hidden',
              },
            },
          );
        `,
				errors: [{ messageId: 'no-container-queries' }],
			},
			{
				name: '@container in a styled div with TS type parameter',
				code: `
        import { styled } from "@compiled/react";

        const Component = styled.div<{
          flexGrow?: number;
        }>({
          flexGrow: 1,
          flexBasis: 0,
          "@container AdminCenterPage (min-width: 840px)": {
            flexGrow: (props) => props.flexGrow || 1
          },
        });
      `,
				errors: [{ messageId: 'no-container-queries' }],
			},
			{
				name: '@container in template literal within styled div with TS type parameter',
				code: `
        import { styled } from "@compiled/react";
        const Container = styled.div<{
          paddingBottom: number;
        }>({
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        
            [\`@container cardContainer (max-width: \${DISPLAYING_FIELDS_MIN_CARD_WIDTH}px)\`]: {
                paddingLeft: '10px',
                paddingRight: 0,
            },
        });
      `,
				errors: [{ messageId: 'no-container-queries' }],
			},
		],
	},
);
