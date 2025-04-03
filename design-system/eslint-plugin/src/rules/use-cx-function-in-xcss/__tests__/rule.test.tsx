import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
/**
 * Run the tests
 */

describe('use-cx-function-in-xcss', () => {
	tester.run('basic cases', rule, {
		valid: [
			{
				name: 'No xcss prop',
				code: `
				import { Box } from '@atlaskit/primitives/compiled';
				<Box></Box>
				`,
			},
			{
				name: 'xcss prop with one style only',
				code: `
				import { cssMap, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
				});
				<Box xcss={styles.root}></Box>
				`,
			},
			{
				name: 'xcss prop with cx use',
				code: `
				import { cssMap, cx, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
			},
			{
				name: 'xcss prop combining styles without cx use on non compiled version',
				code: `
				import { Box, xcss } from '@atlaskit/primitives';
				const baseStyles = xcss({
					borderStyle: 'solid',
					borderRadius: '3px',
					borderWidth: 'border.width',
				});
				const specialBoxStyles = xcss({
					borderColor: 'color.border.discovery',
				});
				<Box xcss={[baseStyles, isSpecial && specialBoxStyles]}></Box>
				`,
			},
			{
				name: 'styles in non-primitives are valid with and without cx use',
				code: `
				import { Box, xcss } from '@atlaskit/primitives';
				const baseStyles = xcss({
					borderStyle: 'solid',
					borderRadius: '3px',
					borderWidth: 'border.width',
				});
				const specialBoxStyles = xcss({
					borderColor: 'color.border.discovery',
				});
				<>
					<div css={[baseStyles, isSpecial && specialBoxStyles]}></div>
					<div css={cx(baseStyles, isSpecial && specialBoxStyles)}></div>
				</>
				`,
			},
		],
		invalid: [
			{
				name: 'xcss prop combining styles without cx use - @atlaskit/css import already exists',
				code: `
				import { cssMap, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import { cx, cssMap, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: "xcss prop combining styles without cx use - @atlaskit/css import doesn't exists",
				code: `
				import { cssMap, jsx } from '@react/compiled';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `import { cx } from '@atlaskit/css';

				import { cssMap, jsx } from '@react/compiled';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: 'xcss prop combining styles without cx use - cx import already exists',
				code: `
				import { cssMap, jsx, cx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import { cssMap, jsx, cx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: 'xcss prop combining styles without cx use - cx import already exists but renamed',
				code: `
				import { cssMap, jsx, cx as altNameCx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import { cssMap, jsx, cx as altNameCx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={altNameCx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: 'xcss prop combining styles without cx use - multiple types of imports',
				code: `
				import A, { cssMap, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import A, { cx, cssMap, jsx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: 'xcss prop combining styles without cx use - default import only',
				code: `
				import A from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import A, { cx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box xcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
			{
				name: 'headerXcss prop combining styles without cx use',
				code: `
				import A from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box headerXcss={[styles.root, spacing === 'compact' && styles.compact]}></Box>
				`,
				output: `
				import A, { cx } from '@atlaskit/css';
				import { Box } from '@atlaskit/primitives/compiled';
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					root: {
						padding: token('space.100'),
						color: token('color.text'),
					},
					compact: { padding: token('space.050') },
				});
				<Box headerXcss={cx(styles.root, spacing === 'compact' && styles.compact)}></Box>
				`,
				errors: [
					{
						messageId: 'useCxFunc',
					},
				],
			},
		],
	});
});
