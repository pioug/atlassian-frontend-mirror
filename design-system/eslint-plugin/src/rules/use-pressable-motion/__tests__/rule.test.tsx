import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-pressable-motion', rule, {
	valid: [
		{
			name: 'non-Pressable elements are ignored',
			code: outdent`
				import { css } from '@atlaskit/css';
				const styles = css({ '&:hover': { backgroundColor: 'red' } });
				<Box xcss={styles} />;
			`,
		},
		{
			name: 'Pressable without interactive colour changes is ignored',
			code: outdent`
				import { css } from '@atlaskit/css';
				import { Pressable } from '@atlaskit/primitives/compiled';
				const styles = css({ color: 'red' });
				<Pressable xcss={styles} />;
			`,
		},
		{
			name: 'native button without interactive colour changes is ignored',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({ color: 'red' });
				<button css={styles} />;
			`,
		},
		{
			name: 'custom Button components are ignored',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({ '&:hover': { backgroundColor: 'red' } });
				<Button css={styles} />;
			`,
		},
		{
			name: 'unprovable background is ignored',
			code: outdent`
				import { css } from '@atlaskit/css';
				import { Pressable } from '@atlaskit/primitives/compiled';
				const styles = css({ '&:hover': { background: 'linear-gradient(red, blue)' } });
				<Pressable xcss={styles} />;
			`,
		},
		{
			name: 'recognises a gated motion member providing the hovered transition in an xcss array',
			code: outdent`
				import { Pressable } from '@atlaskit/primitives/${'pressable'}';
				import { xcss } from '@atlaskit/primitives/${'xcss'}';
				import { token } from '@atlaskit/tokens';
				import { fg } from '@atlassian/jira-feature-gating';
				const baseStyles = xcss({ ':hover': { backgroundColor: 'red' } });
				const motionStyles = xcss({ transition: token('motion.listitem.hovered') });
				<Pressable xcss={[baseStyles, fg('platform-dst-motion-uplift-custom-button') && motionStyles]} />;
			`,
		},
		{
			name: 'recognises a gated motion member providing the pressed transition in an xcss array',
			code: outdent`
				import { Pressable } from '@atlaskit/primitives/${'pressable'}';
				import { xcss } from '@atlaskit/primitives/${'xcss'}';
				import { token } from '@atlaskit/tokens';
				import { fg } from '@atlassian/jira-feature-gating';
				const baseStyles = xcss({ ':active': { color: 'red' } });
				const motionStyles = xcss({ ':active': { transition: token('motion.listitem.pressed') } });
				<Pressable xcss={[baseStyles, fg('platform-dst-motion-uplift-custom-button') && motionStyles]} />;
			`,
		},
	],
	invalid: [
		{
			name: 'suggests button and list-item motion for native button css hover and pressed styles',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					'&:hover': { backgroundColor: 'red' },
					'&:active': { backgroundColor: 'blue' },
				});
				<button css={styles} />;
			`,
			errors: [
				{
					messageId: 'missingPressableMotion',
					suggestions: [
						{
							messageId: 'useButtonMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import { css } from '@compiled/react';
								const styles = css({
									'&:hover': { backgroundColor: 'red' },
									'&:active': { backgroundColor: 'blue', transition: token('motion.button.pressed') },
									transition: token('motion.button.hovered'),
								});
								<button css={styles} />;
							`,
						},
						{
							messageId: 'useListItemMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import { css } from '@compiled/react';
								const styles = css({
									'&:hover': { backgroundColor: 'red' },
									'&:active': { backgroundColor: 'blue', transition: token('motion.listitem.pressed') },
									transition: token('motion.listitem.hovered'),
								});
								<button css={styles} />;
							`,
						},
					],
				},
			],
		},
		{
			name: 'suggests button and list-item motion for css hover and pressed styles',
			code: outdent`
				import { css } from '@atlaskit/css';
				import { Pressable } from '@atlaskit/primitives/compiled';
				const styles = css({
					'&:hover': { backgroundColor: 'red' },
					'&:active': { backgroundColor: 'blue' },
				});
				<Pressable xcss={styles} />;
			`,
			errors: [
				{
					messageId: 'missingPressableMotion',
					suggestions: [
						{
							messageId: 'useButtonMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import { css } from '@atlaskit/css';
								import { Pressable } from '@atlaskit/primitives/compiled';
								const styles = css({
									'&:hover': { backgroundColor: 'red' },
									'&:active': { backgroundColor: 'blue', transition: token('motion.button.pressed') },
									transition: token('motion.button.hovered'),
								});
								<Pressable xcss={styles} />;
							`,
						},
						{
							messageId: 'useListItemMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import { css } from '@atlaskit/css';
								import { Pressable } from '@atlaskit/primitives/compiled';
								const styles = css({
									'&:hover': { backgroundColor: 'red' },
									'&:active': { backgroundColor: 'blue', transition: token('motion.listitem.pressed') },
									transition: token('motion.listitem.hovered'),
								});
								<Pressable xcss={styles} />;
							`,
						},
					],
				},
			],
		},
		{
			name: 'suggests list-item motion for cssMap colour changes and aliased imports',
			code: outdent`
				import { cssMap as stylesFor } from '@atlaskit/css';
				import { Pressable as InteractiveSurface } from '@atlaskit/primitives/compiled/pressable';
				import { token as t } from '@atlaskit/tokens';
				const styles = stylesFor({
					root: { '&:hover': { color: 'red', borderColor: 'blue' } },
				});
				<InteractiveSurface xcss={styles.root} />;
			`,
			errors: [
				{
					messageId: 'missingPressableMotion',
					suggestions: [
						{
							messageId: 'useListItemMotion',
							output: outdent`
								import { cssMap as stylesFor } from '@atlaskit/css';
								import { Pressable as InteractiveSurface } from '@atlaskit/primitives/compiled/pressable';
								import { token as t } from '@atlaskit/tokens';
								const styles = stylesFor({
									root: { '&:hover': { color: 'red', borderColor: 'blue' }, transition: t('motion.listitem.hovered') },
								});
								<InteractiveSurface xcss={styles.root} />;
							`,
						},
					],
				},
			],
		},
		{
			name: 'suggests button and list-item motion for legacy Pressable xcss styles',
			code: outdent`
				import Pressable from '@atlaskit/primitives/pressable';
				import { xcss } from '@atlaskit/primitives/xcss';
				const styles = xcss({
					':hover': { backgroundColor: 'red' },
					':active': { backgroundColor: 'blue' },
				});
				<Pressable xcss={styles} />;
			`,
			errors: [
				{
					messageId: 'missingPressableMotion',
					suggestions: [
						{
							messageId: 'useButtonMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import Pressable from '@atlaskit/primitives/pressable';
								import { xcss } from '@atlaskit/primitives/xcss';
								const styles = xcss({
									':hover': { backgroundColor: 'red' },
									':active': { backgroundColor: 'blue', transition: token('motion.button.pressed') },
									transition: token('motion.button.hovered'),
								});
								<Pressable xcss={styles} />;
							`,
						},
						{
							messageId: 'useListItemMotion',
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import Pressable from '@atlaskit/primitives/pressable';
								import { xcss } from '@atlaskit/primitives/xcss';
								const styles = xcss({
									':hover': { backgroundColor: 'red' },
									':active': { backgroundColor: 'blue', transition: token('motion.listitem.pressed') },
									transition: token('motion.listitem.hovered'),
								});
								<Pressable xcss={styles} />;
							`,
						},
					],
				},
			],
		},
		{
			name: 'suggests motion when cssMap styles are declared after Pressable',
			code: outdent`
				import { cssMap } from '@atlaskit/css';
				import { Pressable } from '@atlaskit/primitives/compiled/pressable';
				const Component = () => <Pressable xcss={styles.root} />;
				const styles = cssMap({
					root: { '&:hover': { backgroundColor: 'red' } },
				});
			`,
			errors: [{ messageId: 'missingPressableMotion' }],
		},
		{
			name: 'suggests motion for static xcss array members',
			code: outdent`
				import { Pressable } from '@atlaskit/primitives/${'pressable'}';
				import { xcss } from '@atlaskit/primitives/${'xcss'}';
				const defaultStyles = xcss({ ':hover': { backgroundColor: 'red' } });
				const selectedStyles = xcss({ ':hover': { backgroundColor: 'blue' } });
				<Pressable xcss={[defaultStyles, isSelected && selectedStyles]} />;
			`,
			errors: [{ messageId: 'missingPressableMotion' }, { messageId: 'missingPressableMotion' }],
		},
		{
			name: 'still reports when an xcss array motion member does not cover the hovered transition',
			code: outdent`
				import { Pressable } from '@atlaskit/primitives/${'pressable'}';
				import { xcss } from '@atlaskit/primitives/${'xcss'}';
				import { token } from '@atlaskit/tokens';
				const baseStyles = xcss({ ':hover': { backgroundColor: 'red' } });
				const motionStyles = xcss({ ':active': { transition: token('motion.button.pressed') } });
				<Pressable xcss={[baseStyles, motionStyles]} />;
			`,
			errors: [{ messageId: 'missingPressableMotion' }],
		},
		{
			name: 'reports but does not suggest when a transition already exists',
			code: outdent`
				import { css } from '@atlaskit/css';
				import { Pressable } from '@atlaskit/primitives/compiled';
				const styles = css({
					transition: 'background-color 100ms ease',
					'&:hover': { backgroundColor: 'red' },
				});
				<Pressable xcss={styles} />;
			`,
			errors: [{ messageId: 'missingPressableMotionManual' }],
		},
	],
});
