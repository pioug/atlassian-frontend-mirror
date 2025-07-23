import { outdent } from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-unused-css-map',
	// @ts-expect-error typescript-eslint and eslint have slightly different types
	rule,
	{
		valid: [
			{
				name: 'should not report when all styles are used',
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          danger: {
            color: 'red',
          },
          success: {
            color: 'green',
          },
        });

        const Component = () => (
          <div>
            <Box xcss={styles.danger}>Error</Box>
            <Box xcss={styles.success}>Success</Box>
          </div>
        );
      `,
			},
			{
				name: 'should not report when cssMap is not from supported imports',
				code: outdent`
        import React from 'react';
        import { cssMap } from 'some-other-library';

        const styles = cssMap({
          unusedStyle: {
            color: 'red',
          },
        });
      `,
			},
			{
				name: 'should not report when cssMap has no object argument',
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';

        const styles = cssMap();
      `,
			},
			{
				name: 'should not report when cssMap object is empty',
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';

        const styles = cssMap({});
      `,
			},
			{
				name: 'should handle @atlaskit/css import',
				code: outdent`
        import React from 'react';
        import { cssMap } from '@atlaskit/css';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          active: { color: 'blue' },
        });

        const Component = () => <Box xcss={styles.active} />;
      `,
			},
			{
				name: 'should NOT report unused styles when accessed completely dynamically',
				errors: [
					// Should be no errors - dynamic access means all styles could be used
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          red: { color: 'red' },
          blue: { color: 'blue' },
          green: { color: 'green' },
        });

        const Component = ({ color }) => <Box xcss={styles[color]} />;
      `,
			},
		],
		invalid: [
			{
				name: 'should detect single unused style',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unusedStyle' },
					},
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          danger: {
            color: 'red',
          },
          unusedStyle: {
            color: 'blue',
          },
        });

        const Component = () => (
          <Box xcss={styles.danger}>Error</Box>
        );
      `,
			},
			{
				name: 'should detect multiple unused styles',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unusedStyle1' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unusedStyle2' },
					},
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          danger: {
            color: 'red',
          },
          unusedStyle1: {
            color: 'blue',
          },
          unusedStyle2: {
            color: 'green',
          },
        });

        const Component = () => (
          <Box xcss={styles.danger}>Error</Box>
        );
      `,
			},
			{
				name: 'should detect all unused styles when cssMap variable is never used',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'style1' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'style2' },
					},
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          style1: { color: 'red' },
          style2: { color: 'blue' },
        });

        const Component = () => <div>Hello</div>;
      `,
			},
			{
				name: 'should work with @atlaskit/css import',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused' },
					},
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@atlaskit/css';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          active: { color: 'blue' },
          unused: { color: 'red' },
        });

        const Component = () => <Box xcss={styles.active} />;
      `,
			},
			{
				name: 'should work with cx and cssMap',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused2' },
					},
				],
				code: outdent`
        import React from 'react';
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap, cx } from '@atlaskit/css';

        const styles = cssMap({
          active: { color: 'blue' },
          unused: { color: 'red' },
        });
        const styles2 = cssMap({
          active2: { color: 'blue' },
          unused2: { color: 'red' },
        });

        const Component2 = () => <Box xcss={cx(styles.active, styles2.active2)} />;
      `,
			},
			{
				name: 'should work with cx and cssMap and conditional',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'moreUnused' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused2' },
					},
				],
				code: outdent`
        import React from 'react';
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap, cx } from '@atlaskit/css';

        const styles = cssMap({
          active: { color: 'blue' },
          unused: { color: 'red' },
        });
        const styles2 = cssMap({
          moreUnused: { color: 'blue' },
          awesomeStyles: { color: 'green' },
          unused2: { color: 'red' },
        });

        const ifLovesGeorgeCostanza = true;

        const Component2 = () => <Box xcss={cx(styles.active, ifLovesGeorgeCostanza && styles2.awesomeStyles)} />;
      `,
			},
			{
				name: 'should work with cx and cssMap and ternary',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused' },
					},
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused2' },
					},
				],
				code: outdent`
        import React from 'react';
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap, cx } from '@atlaskit/css';

        const styles = cssMap({
          active: { color: 'blue' },
          unused: { color: 'red' },
        });
        const styles2 = cssMap({
          awfulStyles: { color: 'blue' },
          awesomeStyles: { color: 'green' },
          unused2: { color: 'red' },
        });

        const ifLovesGeorgeCostanza = true;

        const Component2 = () => <Box xcss={cx(styles.active, ifLovesGeorgeCostanza ? styles2.awesomeStyles : styles2.awfulStyles)} />;
      `,
			},
			{
				name: 'should be conservative with mixed static and dynamic access',
				errors: [
					{
						messageId: 'unusedCssMapStyle',
						data: { styleName: 'unused' },
					},
				],
				code: outdent`
        import React from 'react';
        import { cssMap } from '@compiled/react';
        import { Box } from '@atlaskit/primitives';

        const styles = cssMap({
          red: { color: 'red' },
          blue: { color: 'blue' },
          possiblyUsed: { color: 'purple' },
        });

        const styles2 = cssMap({
          red: { color: 'red' },
          unused: { color: 'blue' },
        });

        const Component = ({ color }) => (
          <div>
            <Box xcss={styles.red} />
            <Box xcss={styles[color]} />
            <Box xcss={styles2.red} />
          </div>
        );
            `,
			},
		],
	},
);
