import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-container-queries',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'typed named dimension query matching a local container',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';

				  const styles = cssMap({
				    root: { containerName: 'sidebar', containerType: 'inline-size' },
				    content: {
				    ['@container sidebar (width > 300px)' satisfies ContainerQuery]: {},
				    },
				  });
				`,
			},
			{
				name: 'container query with a chained satisfies expression and local container',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';

				  const styles = cssMap({
				    root: { containerName: 'sidebar', containerType: 'inline-size' },
				    content: {
				    ['@container sidebar (width > 300px)' satisfies ContainerQuery satisfies string]: {},
				    },
				  });
				`,
			},
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
				name: 'typed query without a matching local container name',
				code: `
				  import { css } from '@compiled/react';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';
				  css({ ['@container sidebar (width > 300px)' satisfies ContainerQuery]: {} });
				`,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
			{
				name: 'container name and query name must match exactly',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';
				  const styles = cssMap({
				    root: { containerName: 'sidebar', containerType: 'inline-size' },
				    content: { ['@container card (width > 300px)' satisfies ContainerQuery]: {} },
				  });
				`,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
			{
				name: 'dynamic container names are not statically bound',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';
				  const name = 'card';
				  const styles = cssMap({
				    root: { containerName: name, containerType: 'inline-size' },
				    content: { ['@container card (width > 300px)' satisfies ContainerQuery]: {} },
				  });
				`,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
			{
				name: 'typed style query is rejected',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';
				  const styles = cssMap({
				    root: { containerName: 'card', containerType: 'normal' },
				    content: { ['@container card style(--density: compact)' satisfies ContainerQuery]: {} },
				  });
				`,
				errors: [{ messageId: 'no-container-style-queries' }],
			},
			{
				name: 'typed query with a non-dimension condition is rejected',
				code: `
				  import { cssMap } from '@atlaskit/css';
				  import type ContainerQuery from '@atlaskit/css/at-rules/container';
				  const styles = cssMap({
				    root: { containerName: 'card', containerType: 'normal' },
				    content: { ['@container card (orientation: landscape)' satisfies ContainerQuery]: {} },
				  });
				`,
				errors: [{ messageId: 'no-non-dimension-container-queries' }],
			},
			{
				name: 'container query with an unrelated satisfies type',
				code: `
          import { css } from '@compiled/react';

          css({
            ['@container sidebar (width > 300px)' satisfies string]: {},
          });
        `,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
			{
				name: 'container query with a type from another entrypoint',
				code: `
          import { css } from '@compiled/react';
          import type ContainerQuery from './container-query';

          css({
            ['@container sidebar (width > 300px)' satisfies ContainerQuery]: {},
          });
        `,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
			{
				name: 'container query with an as assertion',
				code: `
          import { css } from '@compiled/react';

          css({
            ['@container sidebar (width > 300px)' as string]: {},
          });
        `,
				errors: [{ messageId: 'no-mismatched-container-name' }],
			},
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
				errors: [{ messageId: 'no-unbound-container-queries' }],
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
				errors: [{ messageId: 'no-mismatched-container-name' }],
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
