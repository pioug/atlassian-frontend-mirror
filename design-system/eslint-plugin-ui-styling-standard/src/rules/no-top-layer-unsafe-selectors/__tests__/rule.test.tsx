import { tester } from '../../__tests__/utils/_tester';
import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

tester.run('no-top-layer-unsafe-selectors', rule, {
	valid: [
		{
			name: 'a selector no host can reach',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > span': { color: 'red' },
        });
      `,
		},
		{
			/**
			 * A key with no `&` that opens with a pseudo is the `&` compound itself (`:hover` is
			 * `&:hover`), and `&` is never guarded. Guarding these would stop the component's own
			 * `:focus-visible` style applying whenever it sits inside any popover or dialog.
			 */
			name: 'pseudo-only keys are the component itself and are not guarded',
			code: `
        import { css } from '@compiled/react';

        css({
          ':hover': { color: 'red' },
          ':active': { color: 'red' },
          ':focus-visible': { outline: 'none' },
          ':disabled': { color: 'grey' },
          '::before': { content: '""' },
        });
      `,
		},
		{
			name: 'a keyframes template has no element selectors',
			code: `
        import { keyframes } from '@emotion/react';

        const fade = keyframes\`
          from { opacity: 0; }
          to { opacity: 1; }
        \`;
      `,
		},
		{
			name: 'a class-only child selector',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > .foo': { color: 'red' },
        });
      `,
		},
		{
			name: 'an already-guarded selector is left alone',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
		},
		{
			name: 'the positional family can be silenced with the residue option, because it has no fix',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:first-child': { color: 'red' },
        });
      `,
			/**
			 * Worth knowing: the `of S` family is routed through `no-guard-form`, so turning that
			 * option off hides the whole positional family along with the rest of the residue.
			 */
			options: [{ reportSelectorsWithNoGuardForm: false }],
		},
		{
			name: 'a general sibling a host cannot match is already safe',
			code: `
        import { css } from '@compiled/react';

        css({
          '& ~ span': { color: 'red' },
        });
      `,
		},
		{
			name: 'a declaration is not a selector',
			code: `
        import { css } from '@compiled/react';

        css({
          color: 'red',
          display: 'block',
        });
      `,
		},
		{
			/* Variant names, quoted or not, that would be guarded if they were read as selectors. */
			name: 'cssMap variant names are not selectors',
			code: `
        import { cssMap } from '@atlaskit/css';

        cssMap({
          'div': { color: 'red' },
          'span, *': { color: 'red' },
          svg: { color: 'red' },
          a: { color: 'red' },
        });
      `,
		},
		{
			/* `from` / `to` are keyframe offsets, not selectors, whether quoted or not. */
			name: 'keyframes object blocks are not selectors',
			code: `
        import { keyframes } from '@compiled/react';

        keyframes({
          from: { opacity: 0 },
          '50%': { opacity: 0.5 },
          to: { opacity: 1 },
        });
      `,
		},
		{
			/**
			 * The `keyframes({…})` call above is safe because the style-call walk hides its top
			 * level. The `@keyframes` *at-rule*, nested in an ordinary style object, is a separate
			 * path: `checkProperty` declines the at-rule key itself but the walk used to descend
			 * into the block, so `from` was reported and fixed to `from:not(:where(…))`. That is
			 * not a valid keyframe selector — the keyframe is dropped, the animation stops, and
			 * because the fix is idempotent a re-lint finds nothing to complain about.
			 */
			name: 'a @keyframes at-rule inside a style object is not walked for selectors',
			code: `
        import { css } from '@compiled/react';

        css({
          animationName: 'spin',
          '@keyframes spin': {
            from: { opacity: 0 },
            '50%': { opacity: 0.5 },
            to: { opacity: 1 },
          },
        });
      `,
		},
		{
			name: 'a vendor-prefixed @keyframes at-rule is not walked either',
			code: `
        import { css } from '@compiled/react';

        css({
          '@-webkit-keyframes spin': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        });
      `,
		},
		{
			name: 'a malformed selector is not reported by default',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div[': { color: 'red' },
        });
      `,
		},
		{
			/* A variable key is not a name the rule can read. */
			name: 'a computed identifier key is not read as a selector',
			code: `
        import { css } from '@compiled/react';

        const selector = '& > div';

        css({
          [selector]: { color: 'red' },
        });
      `,
		},
		{
			name: 'an unrelated object is not linted',
			code: `
        const config = {
          '& > div': { color: 'red' },
        };
      `,
		},
		{
			name: 'a dynamic selector is not reported by default',
			code: `
        import { css } from '@compiled/react';

        const suffix = 'div';

        css({
          [\`& > \${suffix}\`]: { color: 'red' },
        });
      `,
		},
		{
			/**
			 * `@media screen and (…)` parses as tag compounds if it is handed to the transform, and
			 * would be "guarded" into an invalid media query. Every `@` key is stepped over.
			 */
			name: 'an at-rule is not a selector',
			code: `
        import { css } from '@compiled/react';

        css({
          '@media (min-width: 100px)': { color: 'red' },
          '@media screen and (min-width: 30rem)': { color: 'red' },
          '@media print': { color: 'red' },
          '@media not all and (hover: hover)': { color: 'red' },
          '@supports not (display: grid)': { color: 'red' },
          '@container sidebar (min-width: 400px)': { color: 'red' },
          [\`@media screen and (min-width: 30rem)\`]: { color: 'red' },
        });
      `,
		},
		{
			name: 'a css prop array with nothing to report',
			code: `
        const Component = () => <div css={[{ '& > span': { color: 'red' } }, undefined]} />;
      `,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		{
			name: 'residue reporting can be turned off',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div:empty': { color: 'red' },
        });
      `,
			options: [{ reportSelectorsWithNoGuardForm: false }],
		},
		{
			/**
			 * An unquoted key is only read as a selector when it is an element name. `selectors` is
			 * a container of the styling API, and `'selectors:not(…)'` would break it.
			 */
			name: 'an unquoted key that is not an element name is not a selector',
			code: `
        import { css } from '@compiled/react';

        css({
          selectors: { '&:hover': { color: 'red' } },
          myWidget: { color: 'red' },
        });
      `,
		},
		{
			/**
			 * A guard appended after a comment would land on the far side of the whitespace around
			 * it and become a descendant selector. Such a key is left alone, as a template selector
			 * with a comment inside it is.
			 */
			name: 'an object key with a comment inside it is left alone',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div /* c */': { color: 'red' },
          '& > /* c */ div': { color: 'red' },
          [\`& > div /* c */\`]: { color: 'red' },
        });
      `,
		},
		{
			name: 'an & inside :is() is the & it spells — & > span needs nothing',
			code: `
        import { css } from '@compiled/react';

        css({
          ':is(& > span)': { color: 'red' },
          ':where(&)': { color: 'red' },
        });
      `,
		},
	],
	invalid: [
		{
			name: 'css() object key — & > *',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > *:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * The `of S` family is reported without a fix: Compiled's extract mode emits no CSS for
			 * a selector carrying an `of` argument, so autofixing here would delete the styling
			 * rather than protect it.
			 */
			name: 'css() object key — a positional selector is reported without a fix',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:first-child': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'an already-rewritten positional selector is reported, not treated as safe',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > :nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'cssMap() nested selector',
			code: `
        import { cssMap } from '@atlaskit/css';

        cssMap({
          root: {
            '& > div': { color: 'red' },
          },
        });
      `,
			output: `
        import { cssMap } from '@atlaskit/css';

        cssMap({
          root: {
            '& > div:not(:where([popover], dialog))': { color: 'red' },
          },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * The real source of `xcss` is the `@atlaskit/primitives` barrel, and the prohibited-barrel
			 * ratchet matches raw text, so it counts that specifier even inside a fixture string. The
			 * only subpath exposing `xcss` is wholly deprecated, and `importSources` is compared
			 * exactly (`hasImportDefinition` in `@atlaskit/eslint-utils/is-supported-import`), so a
			 * subpath would silently stop the rule firing. Naming a stand-in source through the rule's
			 * own `importSources` option exercises the identical `xcss` code path instead.
			 */
			name: 'xcss() selector, from a configured import source',
			code: `
        import { xcss } from 'custom-primitives';

        xcss({
          '& > div': { color: 'red' },
        });
      `,
			output: `
        import { xcss } from 'custom-primitives';

        xcss({
          '& > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			options: [{ importSources: ['custom-primitives'] }],
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'styled.div({}) object syntax',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div({
          '& > div': { color: 'red' },
        });
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div({
          '& > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'styled(Base)({}) object syntax',
			code: `
        import styled from '@emotion/styled';

        const Container = styled(Base)({
          '& > div': { color: 'red' },
        });
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled(Base)({
          '& > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'styled.div`` template literal',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          & > div {
            color: red;
          }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          & > div:not(:where([popover], dialog)) {
            color: red;
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/* The range arithmetic is what is under test here — the selector has to be a fixable
			 * one for the fixer to be exercised at all. */
			name: 'css`` template literal with a declaration before the selector',
			code: `
        import { css } from '@emotion/react';

        const styles = css\`
          color: blue;
          & > div {
            color: red;
          }
        \`;
      `,
			output: `
        import { css } from '@emotion/react';

        const styles = css\`
          color: blue;
          & > div:not(:where([popover], dialog)) {
            color: red;
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'css`` template literal with a positional selector is reported without a fix',
			code: `
        import { css } from '@emotion/react';

        const styles = css\`
          color: blue;
          & > *:first-child {
            color: red;
          }
        \`;
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'template literal — an at-rule block is stepped over, the selector inside is not',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          @media (min-width: 100px) {
            & > div {
              color: red;
            }
          }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          @media (min-width: 100px) {
            & > div:not(:where([popover], dialog)) {
              color: red;
            }
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * The counterpart to the `@keyframes` valid cases: only `@keyframes` hides its
			 * children. Every other at-rule nests real selectors, so the object walk must still
			 * descend. If the skip were ever widened to at-rules in general this stops reporting.
			 */
			name: 'the walk still descends into a @media at-rule in a style object',
			code: `
        import { css } from '@compiled/react';

        css({
          '@media screen': {
            '& > div': { color: 'red' },
          },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '@media screen': {
            '& > div:not(:where([popover], dialog))': { color: 'red' },
          },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'css prop with an inline object',
			code: `
        const Component = () => <div css={{ '& > div': { color: 'red' } }} />;
      `,
			output: `
        const Component = () => <div css={{ '& > div:not(:where([popover], dialog))': { color: 'red' } }} />;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		{
			name: 'xcss prop with an inline object',
			code: `
        const Component = () => <Box xcss={{ '& > div': { color: 'red' } }} />;
      `,
			output: `
        const Component = () => <Box xcss={{ '& > div:not(:where([popover], dialog))': { color: 'red' } }} />;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		{
			name: 'trap 2 — & > div > div reports once and fixes both compounds',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div > div': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > div:not(:where([popover], dialog)) > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'trap 3 — every :has() comma branch is guarded',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:has(button, a)': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '&:has(button:not(:where([popover], dialog, [popover] *, dialog *)), a:not(:where([popover], dialog, [popover] *, dialog *)))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * A key with no `&` that does not open with a pseudo is a descendant of the component
			 * (`span` is `& span`), and the whole surface subtree sits in descendant position.
			 */
			name: 'a tag key with no & is a descendant and takes the wide guard',
			code: `
        import { css } from '@compiled/react';

        css({
          'span': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          'span:not(:where([popover], dialog, [popover] *, dialog *))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * An unquoted key is the same selector as its quoted spelling, and escapes the rule only
			 * by its quoting otherwise. The fix quotes it, because a guard is not a valid identifier.
			 * A declaration such as `color: 'red'` has no object value and is never read as one.
			 */
			name: 'an unquoted identifier key is a selector when its value is a style object',
			code: `
        import { css } from '@compiled/react';

        css({
          color: 'red',
          span: { color: 'red' },
          svg: { fill: 'currentColor' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          color: 'red',
          'span:not(:where([popover], dialog, [popover] *, dialog *))': { color: 'red' },
          'svg:not(:where([popover], dialog, [popover] *, dialog *))': { fill: 'currentColor' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }, { messageId: 'unsafe-selector' }],
		},
		{
			name: 'an unquoted identifier key nested inside a cssMap variant is a selector',
			code: `
        import { cssMap } from '@atlaskit/css';

        cssMap({
          root: {
            a: { color: 'red' },
          },
        });
      `,
			output: `
        import { cssMap } from '@atlaskit/css';

        cssMap({
          root: {
            'a:not(:where([popover], dialog, [popover] *, dialog *))': { color: 'red' },
          },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'an unquoted identifier key in a css prop is a selector',
			code: `
        const Component = () => <div css={{ li: { padding: 0 } }} />;
      `,
			output: `
        const Component = () => <div css={{ 'li:not(:where([popover], dialog, [popover] *, dialog *))': { padding: 0 } }} />;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		{
			/**
			 * `*` in a style object compiles to `._x *`, a scoped universal, not a global reset. It
			 * did not reach a portalled host pre-flag, so the guard restores the pre-flag rendering
			 * whatever the declarations say. The global-reset carve-out only applies to plain
			 * stylesheets.
			 */
			name: 'a bare universal key is a scoped universal and is guarded, reset or not',
			code: `
        import { css } from '@compiled/react';

        css({
          '*': { boxSizing: 'inherit' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '*:not(:where([popover], dialog, [popover] *, dialog *))': { boxSizing: 'inherit' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'a leading child combinator is the nested spelling of & > *',
			code: `
        import { css } from '@compiled/react';

        css({
          '> *': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '> *:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * The guard closes `popover-receives`, but a host inserted between the two siblings
			 * still breaks the adjacency. The transform says so in its `reason`, and the rule must
			 * surface it rather than autofix and fall silent.
			 */
			name: 'an adjacent sibling a host can match is fixed and its residual exposure is reported',
			code: `
        import { css } from '@compiled/react';

        css({
          '& + div': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& + div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [
				{
					messageId: 'unsafe-selector-with-residual-exposure',
					data: {
						reason:
							'The guard closes `popover-receives` on this adjacent sibling combinator, but a host inserted *between* the two siblings still breaks the adjacency for real elements. No guard form restores that; review the site.',
					},
				},
			],
		},
		{
			name: 'a selector list keeps its line layout when fixed',
			code: `
        import { css } from '@compiled/react';

        css({
          [\`& > div,
          & > span,
          & > [data-slot]\`]: { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          [\`& > div:not(:where([popover], dialog)),
          & > span,
          & > [data-slot]:not(:where([popover], dialog))\`]: { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'a css prop array is walked',
			code: `
        const Component = () => <div css={[{ '& > div': { color: 'red' } }, { '& > span': {} }]} />;
      `,
			output: `
        const Component = () => <div css={[{ '& > div:not(:where([popover], dialog))': { color: 'red' } }, { '& > span': {} }]} />;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		{
			name: 'a partial guard inside an anchored :has() argument is merged to the narrow list',
			code: `
        import { css } from '@compiled/react';

        css({
          '&:has(> div:not(:where(dialog)))': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '&:has(> div:not(:where([popover], dialog)))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'trap 4 — :only-child is reported without a fix, like the rest of the `of S` family',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:only-child': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'an existing partial guard is merged, not duplicated',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:not(:where(dialog))': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > *:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'no guard form — :empty is reported without a fix',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div:empty': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'no guard form — *-of-type is reported without a fix',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > *:nth-of-type(2)': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'no guard form — an adjacent sibling a host cannot match',
			code: `
        import { css } from '@compiled/react';

        css({
          '& + span': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'no guard form — :has() with a propagating pseudo',
			code: `
        import { css } from '@compiled/react';

        css({
          '.x:has(div:hover)': { color: 'red' },
        });
      `,
			output: null,
			errors: [{ messageId: 'no-guard-form' }],
		},
		{
			name: 'a bare universal key with unknown declarations is guarded like any scoped universal',
			code: `
        import { css } from '@compiled/react';

        css({
          '*': { color: someToken },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '*:not(:where([popover], dialog, [popover] *, dialog *))': { color: someToken },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'a dynamic selector is reported when opted in',
			code: `
        import { css } from '@compiled/react';

        const suffix = 'div';

        css({
          [\`& > \${suffix}\`]: { color: 'red' },
        });
      `,
			output: null,
			options: [{ reportDynamicSelectors: true }],
			errors: [{ messageId: 'dynamic-selector' }],
		},
		{
			/**
			 * A selector whose text is known but does not parse is an authoring mistake, not a
			 * dynamic selector, and the message must not send the author looking for an interpolation.
			 */
			name: 'a malformed selector is reported as malformed when opted in, not as dynamic',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div[': { color: 'red' },
        });
      `,
			output: null,
			options: [{ reportDynamicSelectors: true }],
			errors: [
				{
					messageId: 'malformed-selector',
					data: {
						reason:
							'The selector has an unterminated argument — its brackets or parentheses do not balance, so it spans more than the text given and cannot be parsed in isolation.',
					},
				},
			],
		},
		{
			name: 'a template-literal selector containing an interpolation is skipped, not guessed at',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          & > \${Child} {
            color: red;
          }
        \`;
      `,
			output: null,
			options: [{ reportDynamicSelectors: true }],
			errors: [{ messageId: 'dynamic-selector' }],
		},
		{
			/* One fixable and one not, in the same object: the fixable one is still fixed, and the
			 * positional one is reported and left exactly as written. */
			name: 'multiple selectors in one object are each reported',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div': { color: 'red' },
          '& > *:first-child': { color: 'blue' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > div:not(:where([popover], dialog))': { color: 'red' },
          '& > *:first-child': { color: 'blue' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }, { messageId: 'no-guard-form' }],
		},
		{
			name: 'a nested selector inside a selector is reported',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div': {
            '& > span > div': { color: 'red' },
          },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > div:not(:where([popover], dialog))': {
            '& > span > div:not(:where([popover], dialog))': { color: 'red' },
          },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }, { messageId: 'unsafe-selector' }],
		},
		{
			name: 'the autofix output is stable — a second pass changes nothing',
			code: `
        import { css } from '@compiled/react';

        css({
          '& > div:not(:where([popover], dialog)) > div': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          '& > div:not(:where([popover], dialog)) > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/* Inside `url(…)` the `//` is part of the address, not a comment. */
			name: 'template literal — a protocol-relative url() does not swallow the selector after it',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          background: url(//cdn.example.com/a.png); & > div { color: red; }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          background: url(//cdn.example.com/a.png); & > div:not(:where([popover], dialog)) { color: red; }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/* A `}` inside the interpolation's own string literal must not end the interpolation. */
			name: 'template literal — a brace in an interpolated string literal does not end the interpolation',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          color: \${(props) => (props.active ? '}' : '')};
          & > div {
            color: red;
          }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          color: \${(props) => (props.active ? '}' : '')};
          & > div:not(:where([popover], dialog)) {
            color: red;
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * A `//` line comment is stripped by Emotion and styled-components before the CSS is
			 * parsed, so the selector on the next line is real. An apostrophe in the comment must
			 * not open a quoted string that swallows the rest of the template.
			 */
			name: 'template literal — a // line comment does not swallow the selector after it',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          // don't guard the wrapper
          & > div {
            color: red;
          }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          // don't guard the wrapper
          & > div:not(:where([popover], dialog)) {
            color: red;
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			/**
			 * `:is(&) > div` is `& > div`: only the div is guarded. Reading `:is(&)` as a bare pseudo
			 * would wide-guard the component's own element and stop the rule applying inside every
			 * surface.
			 */
			name: 'an & inside :is() is never guarded',
			code: `
        import { css } from '@compiled/react';

        css({
          ':is(&) > div': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          ':is(&) > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'template literal — a mixin with no semicolon does not hide the selector after it',
			code: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          \${mixin}
          & > div {
            color: red;
          }
        \`;
      `,
			output: `
        import styled from '@emotion/styled';

        const Container = styled.div\`
          \${mixin}
          & > div:not(:where([popover], dialog)) {
            color: red;
          }
        \`;
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
		{
			name: 'html and body are never guarded',
			code: `
        import { css } from '@compiled/react';

        css({
          'html > body > div': { color: 'red' },
        });
      `,
			output: `
        import { css } from '@compiled/react';

        css({
          'html > body > div:not(:where([popover], dialog))': { color: 'red' },
        });
      `,
			errors: [{ messageId: 'unsafe-selector' }],
		},
	],
});

/**
 * TypeScript wrappers around a `css` prop object. The runtime value is the object either way,
 * so the rule must look through `as`, `satisfies` and the angle-bracket assertion alike.
 */
const guarded = "'& > div:not(:where([popover], dialog))'";

typescriptEslintTester.run(
	'no-top-layer-unsafe-selectors',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'a satisfies-wrapped css prop with nothing to report',
				code: `
        const Component = () => <div css={{ '& > span': { color: 'red' } } satisfies Record<string, unknown>} />;
      `,
			},
		],
		invalid: [
			{
				name: 'css prop wrapped in `as`',
				code: `
        const Component = () => <div css={{ '& > div': { color: 'red' } } as Record<string, unknown>} />;
      `,
				output: `
        const Component = () => <div css={{ ${guarded}: { color: 'red' } } as Record<string, unknown>} />;
      `,
				errors: [{ messageId: 'unsafe-selector' }],
			},
			{
				name: 'css prop wrapped in `satisfies`',
				code: `
        const Component = () => <div css={{ '& > div': { color: 'red' } } satisfies Record<string, unknown>} />;
      `,
				output: `
        const Component = () => <div css={{ ${guarded}: { color: 'red' } } satisfies Record<string, unknown>} />;
      `,
				errors: [{ messageId: 'unsafe-selector' }],
			},
			{
				name: 'css prop wrapped in `satisfies` then `as`',
				code: `
        const Component = () => <div css={{ '& > div': { color: 'red' } } satisfies Record<string, unknown> as Record<string, unknown>} />;
      `,
				output: `
        const Component = () => <div css={{ ${guarded}: { color: 'red' } } satisfies Record<string, unknown> as Record<string, unknown>} />;
      `,
				errors: [{ messageId: 'unsafe-selector' }],
			},
			{
				name: 'xcss prop wrapped in `satisfies`',
				code: `
        const Component = () => <Box xcss={{ '& > div': { color: 'red' } } satisfies Record<string, unknown>} />;
      `,
				output: `
        const Component = () => <Box xcss={{ ${guarded}: { color: 'red' } } satisfies Record<string, unknown>} />;
      `,
				errors: [{ messageId: 'unsafe-selector' }],
			},
		],
	},
);
