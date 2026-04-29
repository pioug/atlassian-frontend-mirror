import { outdent } from 'outdent';

import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

/**
 * Import-aware tests for the no-xcss-in-cx rule.
 *
 * The rule disallows passing xcss() results into cx() in an xcss prop,
 * whether xcss() is called inline or via a pre-defined variable.
 * xcss() produces an opaque StyleRule object that is incompatible with cx(),
 * which expects Compiled atomic class name strings.
 *
 * Only flagged when:
 * - xcss() is imported from @atlaskit/primitives
 * - cx() is imported from @atlaskit/css or @compiled/react
 * - The cx() call appears inside an xcss prop
 */
tester.run('no-xcss-in-cx', rule, {
	valid: [
		// ── cssMap + cx (the correct pattern for combining styles) ──────────
		{
			name: 'cssMap styles passed into cx() in xcss prop is allowed',
			code: outdent`
				import { cssMap, cx } from '@atlaskit/css';
				const styles = cssMap({ base: { color: 'red' }, focused: { outline: '2px solid blue' } });
				const el = <Box xcss={cx(styles.base, condition && styles.focused)} />;
			`,
		},
		// ── xcss() passed directly to xcss prop (no cx) ─────────────────────
		{
			name: 'single module-level xcss style in xcss prop (no cx) is allowed',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				const baseStyles = xcss({ color: 'red' });
				const el = <Box xcss={baseStyles} />;
			`,
		},
		// ── xcss() as array elements (no cx wrapping them) ──────────────────
		{
			name: 'xcss array with module-level styles (no cx) is allowed',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				const a = xcss({ color: 'red' });
				const b = xcss({ fontWeight: 'bold' });
				const el = <Box xcss={[a, b]} />;
			`,
		},

		// ── xcss() called inline but NOT inside cx() ────────────────────────
		{
			name: 'xcss() called inline directly as xcss value (not inside cx) is NOT flagged by this rule',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				const el = <Box xcss={xcss({ color: 'red' })} />;
			`,
		},

		// ── xcss() from non-primitives source inside cx() ───────────────────
		{
			name: 'a local function named xcss inside cx() is NOT flagged — not from @atlaskit/primitives',
			code: outdent`
				import { cx } from '@atlaskit/css';
				const xcss = (s) => s;
				const el = <Box xcss={cx(xcss({ color: 'red' }))} />;
			`,
		},

		// ── cx() from non-compiled source ────────────────────────────────────
		{
			name: 'xcss() inside a non-Compiled cx() call is NOT flagged',
			code: outdent`
				import cx from 'classnames';
				import { xcss, Box } from '@atlaskit/primitives';
				const el = <Box xcss={cx(xcss({ color: 'red' }))} />;
			`,
		},

		// ── xcss() inside cx() but NOT in xcss prop ──────────────────────────
		{
			name: 'xcss() inside cx() on className prop (not xcss) is NOT flagged',
			code: outdent`
				import { cx } from '@atlaskit/css';
				import { xcss } from '@atlaskit/primitives';
				const el = <div className={cx(xcss({ color: 'red' }))} />;
			`,
		},
	],
	invalid: [
		// ── xcss() variable references passed into cx() ──────────────────────
		{
			name: 'module-level xcss variables passed into cx() as xcss value is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'red' });
				const boldStyles = xcss({ fontWeight: 'bold' });
				const el = <Box xcss={cx(baseStyles, boldStyles)} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'single module-level xcss variable passed into cx() as xcss value is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'red' });
				const el = <Box xcss={cx(baseStyles)} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss variable in logical && expression inside cx() is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const activeStyles = xcss({ color: 'red' });
				const el = <Box xcss={cx(baseStyles, condition && activeStyles)} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss variable in ternary inside cx() is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const activeStyles = xcss({ color: 'red' });
				const el = <Box xcss={cx(baseStyles, condition ? activeStyles : null)} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss variables in xcss array inside cx() are flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const boldStyles = xcss({ fontWeight: 'bold' });
				const el = <Box xcss={[cx(baseStyles, boldStyles)]} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},

		// ── xcss() inline inside cx() in xcss prop ──────────────────────────
		{
			name: 'xcss() called inline inside cx() as xcss value is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const el = <Box xcss={cx(xcss({ color: 'red' }), xcss({ fontWeight: 'bold' }))} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'single xcss() inline inside cx() as xcss value is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const el = <Box xcss={cx(xcss({ color: 'red' }))} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss() inline inside cx() in xcss array element is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const el = <Box xcss={[cx(baseStyles, xcss({ fontWeight: 'bold' }))]} />;
			`,
			// baseStyles (variable) and inline xcss() are both flagged
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss() inline inside cx() from @compiled/react as xcss value is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@compiled/react';
				const el = <Box xcss={cx(xcss({ color: 'red' }))} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }],
		},

		// ── Aliased xcss import ──────────────────────────────────────────────
		{
			name: 'aliased xcss import inline inside cx() is flagged',
			code: outdent`
				import { xcss as applyStyles, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const el = <Box xcss={cx(applyStyles({ color: 'red' }))} />;
			`,
			errors: [{ messageId: 'noXcssInCx' }],
		},

		// ── Logical/conditional wrappers inside cx() args ────────────────────
		{
			name: 'xcss() inside logical && expression in cx() arg is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const el = <Box xcss={cx(baseStyles, condition && xcss({ color: 'red' }))} />;
			`,
			// baseStyles (variable) and inline xcss() are both flagged
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss() in ternary consequent inside cx() arg is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const el = <Box xcss={cx(baseStyles, condition ? xcss({ color: 'red' }) : null)} />;
			`,
			// baseStyles (variable) and inline xcss() are both flagged
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
		{
			name: 'xcss() in ternary alternate inside cx() arg is flagged',
			code: outdent`
				import { xcss, Box } from '@atlaskit/primitives';
				import { cx } from '@atlaskit/css';
				const baseStyles = xcss({ color: 'blue' });
				const el = <Box xcss={cx(baseStyles, condition ? null : xcss({ color: 'red' }))} />;
			`,
			// baseStyles (variable) and inline xcss() are both flagged
			errors: [{ messageId: 'noXcssInCx' }, { messageId: 'noXcssInCx' }],
		},
	],
});
