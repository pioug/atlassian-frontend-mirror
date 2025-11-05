import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-proper-xcss-usage', rule, {
	valid: [
		`
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap } from '@atlaskit/css';

        const stylesMap = cssMap({
          root: { width: '100%' }
        });

        <Box xcss={stylesMap.root} />
    `,
		`
  		import { Box, Inline } from '@atlaskit/primitives/compiled';
        import { cssMap } from '@compiled/react';

        const stylesMap = cssMap({
          container: { color: 'red' },
          label: { fontSize: '14px' }
        });

        <Box xcss={stylesMap.container} />
    `,
		`
		import { Box, xcss } from '@atlaskit/primitives';

        const oldStyles = xcss({ color: 'blue' });

        <Box xcss={regularStyles} />
    `,
		`
		import { Box } from 'some-other-library';
        import { cssMap } from '@atlaskit/css';

        const styles = cssMap({
          root: { width: '100%' }
        });

        <Box xcss={styles} />
	`,
		`
	    import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap } from '@atlaskit/css';

        const stylesMap = cssMap({
          root: { width: '100%' }
        });

        <Box className="test" />
	`,
		`
	import { cssMap } from '@compiled/react';
	import { Text, xcss } from '@atlaskit/primitives';
    import { Flex } from '@atlaskit/primitives/compiled';

    const textStyles = xcss({
        color: 'red'
    });

	const flexStyles = cssMap({
        root: { color: 'red' }
    });

    <>
        <Flex xcss={flexStyles.root} />
        <Text xcss={textStyles} />
    </>
	`,
		`
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap } from '@atlaskit/css';

        <Box xcss={stylesMap.root} />

				const stylesMap = cssMap({
          root: { width: '100%' }
        });
    `,
		`
        import { Box } from '@atlaskit/primitives';
        import { Box as CompiledBox } from '@atlaskit/primitives/compiled';
        import { xcss } from '@atlaskit/primitives';
        import { cssMap } from '@atlaskit/css';

        const xcssStyles = xcss({
          display: 'flex',
          flexDirection: 'column',
        });

        const styles = cssMap({
          root: {
            borderRadius: 'small',
          },
          container: {
            display: 'flex',
          },
        });

        <>
          <Box xcss={xcssStyles} />
          <CompiledBox xcss={styles.root} />
          <CompiledBox xcss={styles.container} />
        </>
    `,
		`
        import { Box } from '@atlaskit/primitives';
        import { Box as CompiledBox } from '@atlaskit/primitives/compiled';
        import { xcss } from '@atlaskit/primitives';
        import { cssMap } from '@atlaskit/css';

        <>
          <Box xcss={xcssStyles} />
          <CompiledBox xcss={styles.root} />
        </>

        const xcssStyles = xcss({
          display: 'flex',
        });

        const styles = cssMap({
          root: {
            borderRadius: 'small',
          },
        });
    `,
	],
	invalid: [
		{
			code: `
			  import { Box } from '@atlaskit/primitives/compiled';
			  import { cssMap } from '@compiled/react';

			  const stylesMap = cssMap({
				root: { color: 'red' }
			  });

			  <Box xcss={stylesMap} />
			`,
			errors: [
				{
					messageId: 'missingCssMapKey',
					data: { identifier: 'stylesMap' },
				},
			],
		},
		{
			code: `
        import { Box } from '@atlaskit/primitives/compiled';
        import { cssMap } from '@atlaskit/css';

        const styles = cssMap({
          root: { width: '100%' }
        });

        <Box xcss={styles} />
      `,
			errors: [
				{
					messageId: 'missingCssMapKey',
				},
			],
		},
		{
			code: `
			  import { Box } from '@atlaskit/primitives/compiled';
			  import { xcss } from '@atlaskit/primitives';

			  const oldStyles = xcss({
				color: 'red',
			  });

			  <Box xcss={oldStyles} />
			`,
			errors: [
				{
					messageId: 'noXcssWithCompiled',
				},
			],
		},
		{
			code: `
			  import { Box } from '@atlaskit/primitives/compiled';
			  import { xcss } from '@atlaskit/primitives';

			  <Box xcss={oldStyles} />

				const oldStyles = xcss({
				color: 'red',
			  });
			`,
			errors: [
				{
					messageId: 'noXcssWithCompiled',
				},
			],
		},
		{
			code: `
			  import { Box } from '@atlaskit/primitives/compiled';
			  import { xcss } from '@atlaskit/primitives';
			  import { cssMap } from '@atlaskit/css';

			  const oldStyles = xcss({
				color: 'red',
			  });

			  const styles = cssMap({
				root: { width: '100%' }
			  });

			  <div>
				<Box xcss={oldStyles} />
				<Box xcss={styles} />
				<Box xcss={styles.root} />
			  </div>
			`,
			errors: [
				{
					messageId: 'noXcssWithCompiled',
				},
				{
					messageId: 'missingCssMapKey',
				},
			],
		},
	],
});
