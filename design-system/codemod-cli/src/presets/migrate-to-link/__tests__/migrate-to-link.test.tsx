import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/migrate-to-link';
import {
	genericUnsupportedMigrationComment,
	spreadPropsComment,
	stylePropComment,
} from '../utils/comments';

const check = createCheck(transformer);

describe('Migrates native anchor tags to Link', () => {
	check({
		it: 'should migrate with no attributes',
		original: `
      const App = () => (
        <a>
          Foo
        </a>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link>
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate with href attribute',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com">
          Foo
        </a>
      );
    `,
		expected: `
    	import Link from '@atlaskit/link';
      const App = () => (
        <Link href="https://www.atlassian.com">
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate with target attribute',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" target="_blank">
          Foo
        </a>
      );
    `,
		expected: `
    	import Link from '@atlaskit/link';
      const App = () => (
        <Link href="https://www.atlassian.com" target="_blank">
          Foo
        </Link>
      );
    `,
	});
	check({
		it: 'should ignore React components',
		original: `
      const App = () => (
        <A>
          Foo
        </A>
      );
    `,
		expected: `
      const App = () => (
        <A>
          Foo
        </A>
      );
    `,
	});
});

describe('Migrates HTML elements with role="link"', () => {
	check({
		it: 'should migrate a div with role="link" and remove the role attribute',
		original: `
      const App = () => (
        <div role="link" href="https://www.atlassian.com">
          Foo
        </div>
      );
    `,
		expected: `
    	import Link from '@atlaskit/link';
      const App = () => (
        <Link href="https://www.atlassian.com">
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate a span with role="link" and remove the role attribute',
		original: `
      const App = () => (
        <span role="link" href="https://www.atlassian.com">
          Foo
        </span>
      );
    `,
		expected: `
    	import Link from '@atlaskit/link';
      const App = () => (
        <Link href="https://www.atlassian.com">
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate an anchor with role="link" and remove the role attribute',
		original: `
      const App = () => (
        <a role="link" href="https://www.atlassian.com">
          Foo
        </a>
      );
    `,
		expected: `
    	import Link from '@atlaskit/link';
      const App = () => (
        <Link href="https://www.atlassian.com">
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should not migrate a React component with role="link"',
		original: `
      const App = () => (
        <SomeComponent role="link" href="https://www.atlassian.com">
          Foo
        </SomeComponent>
      );
    `,
		expected: `
      const App = () => (
        <SomeComponent role="link" href="https://www.atlassian.com">
          Foo
        </SomeComponent>
      );
    `,
	});
});

describe('Imports', () => {
	check({
		it: 'should not add import if already present',
		original: `
			import Link from '@atlaskit/link';
      const App = () => (
        <a>
          Foo
        </a>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link>
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should add to existing import if already present, but no default specifier',
		original: `
			import { type LinkProps } from '@atlaskit/link';
      const App = () => (
        <a>
          Foo
        </a>
      );
    `,
		expected: `
      import Link, { type LinkProps } from '@atlaskit/link';
      const App = () => (
        <Link>
          Foo
        </Link>
      );
    `,
	});

	check({
		it: 'should use existing import name if different to "Link"',
		original: `
			import Link182 from '@atlaskit/link';
      const App = () => (
        <a>
          Foo
        </a>
      );
    `,
		expected: `
      import Link182 from '@atlaskit/link';
      const App = () => (
        <Link182>
          Foo
        </Link182>
      );
    `,
	});

	check({
		it: 'should use unique import name if there is a different existing import named "Link"',
		original: `
			import Link from 'another-package';
			import Link1 from 'yet-another-package';
			import Link2 from '@some-other/package';
      const App = () => (
        <a>
          Foo
        </a>
      );
    `,
		expected: `
      import Link from 'another-package';
			import Link1 from 'yet-another-package';
			import Link2 from '@some-other/package';
			import Link3 from '@atlaskit/link';
      const App = () => (
        <Link3>
          Foo
        </Link3>
      );
    `,
	});
});

describe('Unsupported migrations', () => {
	check({
		it: 'should not migrate with css prop and leave a comment with suggestions',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" css={someStyles}>
          Foo
        </a>
      );
    `,
		expected: `
			const App = () => (
        /* TODO: (from codemod)\u0020
        ${stylePropComment({ propName: 'css' })}
${genericUnsupportedMigrationComment('        ')} */
        <a href="https://www.atlassian.com" css={someStyles}>
          Foo
        </a>
      );
    `,
	});

	check({
		it: 'should not migrate with style prop and leave a comment with suggestions',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" style={someStyles}>
          Foo
        </a>
      );
    `,
		expected: `
			const App = () => (
        /* TODO: (from codemod)\u0020
        ${stylePropComment({ propName: 'style' })}
${genericUnsupportedMigrationComment('        ')} */
        <a href="https://www.atlassian.com" style={someStyles}>
          Foo
        </a>
      );
    `,
	});

	check({
		it: 'should not migrate with className prop and leave a comment with suggestions',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" className="someClassName">
          Foo
        </a>
      );
    `,
		expected: `
			const App = () => (
				/* TODO: (from codemod)\u0020
        ${stylePropComment({ propName: 'className' })}
${genericUnsupportedMigrationComment('        ')} */
        <a href="https://www.atlassian.com" className="someClassName">
          Foo
        </a>
      );
    `,
	});

	check({
		it: 'should not migrate with spread props and leave a comment with suggestions',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" {...potentialStyles}>
          Foo
        </a>
      );
    `,
		expected: `
			const App = () => (
				/* TODO: (from codemod)\u0020
        ${spreadPropsComment}
${genericUnsupportedMigrationComment('        ')} */
        <a href="https://www.atlassian.com" {...potentialStyles}>
          Foo
        </a>
      );
    `,
	});

	check({
		it: 'should not migrate when combinations of issues are detected and leave a comment with suggestions',
		original: `
      const App = () => (
        <a href="https://www.atlassian.com" css={someStyles} style={someStyles} className="someClassName" {...potentialStyles}>
          Foo
        </a>
      );
    `,
		expected: `
			const App = () => (
				/* TODO: (from codemod)\u0020
        ${stylePropComment({ propName: 'css' })}
        ${stylePropComment({ propName: 'style' })}
        ${stylePropComment({ propName: 'className' })}
        ${spreadPropsComment}
${genericUnsupportedMigrationComment('        ')} */
       	<a href="https://www.atlassian.com" css={someStyles} style={someStyles} className="someClassName" {...potentialStyles}>
          Foo
        </a>
      );
    `,
	});
});
