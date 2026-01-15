import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-unused-cssmap-properties', rule, {
	valid: [
		{
			name: 'all properties are used',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        <div css={styles.root} />;
        <div css={styles.active} />;
      `,
		},
		{
			name: 'cssMap is exported (should not check)',
			code: `
        import { cssMap } from '@compiled/react';

        export const styles = cssMap({
          root: { color: 'red' },
          unused: { background: 'blue' },
        });
      `,
		},
		{
			name: 'cssMap is exported via export declaration',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          unused: { background: 'blue' },
        });

        export { styles };
      `,
		},
		{
			name: 'object is used as a whole (spread)',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        const allStyles = { ...styles };
      `,
		},
		{
			name: 'object is passed to a function',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        applyStyles(styles);
      `,
		},
		{
			name: 'properties accessed with bracket notation',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        <div css={styles['root']} />;
        <div css={styles['active']} />;
      `,
		},
		{
			name: 'cssMap from @atlaskit/css',
			code: `
        import { cssMap } from '@atlaskit/css';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        <div css={styles.root} />;
        <div css={styles.active} />;
      `,
		},
		{
			name: 'properties used in conditional',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });

        <div css={[styles.root, isActive && styles.active]} />;
      `,
		},
		{
			name: 'dynamic property access with computed key',
			code: `
        import { cssMap } from '@compiled/react';

        const sizeStyles = cssMap({
          small: { width: '16px' },
          medium: { width: '24px' },
          large: { width: '32px' },
        });

        const MyComponent = ({ size }) => <div css={sizeStyles[size]} />;
      `,
		},
		{
			name: 'dynamic property access with props',
			code: `
        import { cssMap } from '@compiled/react';

        const sizeStyles = cssMap({
          small: { width: '16px' },
          medium: { width: '24px' },
          large: { width: '32px' },
          xlarge: { width: '48px' },
        });

        const MyComponent = (props) => <div css={sizeStyles[props.size]} />;
      `,
		},
		{
			name: 'all properties used inside function component',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
          disabled: { opacity: '0.5' },
        });

        const MyComponent = ({ isActive, isDisabled }) => (
          <div css={[styles.root, isActive && styles.active, isDisabled && styles.disabled]} />
        );
      `,
		},
		{
			name: 'properties used with ternary inside function component',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          first: { borderTop: 'none' },
          notFirst: { borderTop: '1px solid' },
        });

        const MyComponent = ({ isFirst }) => (
          <div css={[styles.root, isFirst ? styles.first : styles.notFirst]} />
        );
      `,
		},
	],
	invalid: [
		{
			name: 'single unused property',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          unused: { background: 'blue' },
        });

        <div css={styles.root} />;
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'unused' },
				},
			],
		},
		{
			name: 'multiple unused properties',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          unused1: { background: 'blue' },
          active: { border: '1px solid' },
          unused2: { padding: '10px' },
        });

        <div css={styles.root} />;
        <div css={styles.active} />;
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'unused1' },
				},
				{
					messageId: 'unused-property',
					data: { propertyName: 'unused2' },
				},
			],
		},
		{
			name: 'all properties unused',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
        });
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'root' },
				},
				{
					messageId: 'unused-property',
					data: { propertyName: 'active' },
				},
			],
		},
		{
			name: 'unused property with @atlaskit/css',
			code: `
        import { cssMap } from '@atlaskit/css';

        const styles = cssMap({
          root: { color: 'red' },
          unused: { background: 'blue' },
        });

        <div css={styles.root} />;
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'unused' },
				},
			],
		},
		{
			name: 'unused property in complex component',
			code: `
        import { cssMap } from '@compiled/react';

        const boxStyles = cssMap({
          root: { borderWidth: '1px' },
          innerBox: { paddingTop: '8px' },
          loadingText: { display: 'inline-block' },
          dots: { display: 'inline-block' },
          unused: { color: 'red' },
        });

        <Box css={boxStyles.root}>
          <Box css={boxStyles.innerBox}>
            <span css={boxStyles.loadingText}>
              Loading <span css={boxStyles.dots}>...</span>
            </span>
          </Box>
        </Box>;
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'unused' },
				},
			],
		},
		{
			name: 'unused property inside function component',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          active: { background: 'blue' },
          unusedStyle: { display: 'none' },
        });

        const MyComponent = ({ isActive }) => (
          <div css={[styles.root, isActive && styles.active]} />
        );
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'unusedStyle' },
				},
			],
		},
		{
			name: 'multiple unused properties with ternary inside function component',
			code: `
        import { cssMap } from '@compiled/react';

        const styles = cssMap({
          root: { color: 'red' },
          isFirstZone: { borderTop: 'none' },
          notFirstZone: { borderTop: '1px solid' },
          isLastZone: { borderBottom: 'none' },
          errorMessage: { textAlign: 'center' },
          unusedStyle: { display: 'none' },
        });

        const MyComponent = ({ isFirst, isLast }) => (
          <div css={[
            styles.root,
            isFirst ? styles.isFirstZone : styles.notFirstZone,
            isLast && styles.isLastZone,
          ]} />
        );
      `,
			errors: [
				{
					messageId: 'unused-property',
					data: { propertyName: 'errorMessage' },
				},
				{
					messageId: 'unused-property',
					data: { propertyName: 'unusedStyle' },
				},
			],
		},
	],
});
