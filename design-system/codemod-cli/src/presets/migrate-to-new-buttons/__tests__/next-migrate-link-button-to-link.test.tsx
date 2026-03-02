import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/next-migrate-link-button-to-link';
import {
	migrateButtonToSubtleLinkButton,
	migrateSubtleButtonToSubtleLinkButton,
} from '../utils/constants';

const check = createCheck(transformer);

describe('Migrate Link buttons to Links', () => {
	check({
		it: 'should migrate link button to default link',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="link"
          href="https://atlassian.design/"
          spacing="none"
        >
          A link
        </LinkButton>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link
          href="https://atlassian.design/"
        >
          A link
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate link button to subtle LinkButton if spacing is not none',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="link"
          href="https://atlassian.design/"
        >
          A link
        </LinkButton>
      );
    `,
		expected: `
    import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          // TODO: (from codemod) ${migrateButtonToSubtleLinkButton}
          appearance="subtle"
          href="https://atlassian.design/"
        >
          A link
        </LinkButton>
      );
    `,
	});

	check({
		it: 'should migrate subtle link button to subtle LinkButton if spacing is not none',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="subtle-link"
          href="https://atlassian.design/"
        >
          A link
        </LinkButton>
      );
    `,
		expected: `
    import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          // TODO: (from codemod) ${migrateSubtleButtonToSubtleLinkButton}
          appearance="subtle"
          href="https://atlassian.design/"
        >
          A link
        </LinkButton>
      );
    `,
	});

	check({
		it: 'should migrate subtle link button to subtle link',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="subtle-link"
          href="https://atlassian.design/"
          spacing="none"
        >
          A subtle link
        </LinkButton>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link
          appearance="subtle"
          href="https://atlassian.design/"
        >
          A subtle link
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate link button with icon before to default link with icon in its children',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="link"
          href="https://atlassian.design/"
          spacing="none"
          iconBefore={AddIcon}
        >
          A link
        </LinkButton>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link
          href="https://atlassian.design/"
        >
          <AddIcon label=""/>
          A link
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate link button with icon after to default link with icon in its children',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          appearance="link"
          href="https://atlassian.design/"
          spacing="none"
          iconAfter={(iconProps) => <AddIcon {...iconProps} primaryColor="red" />}
        >
          A link
        </LinkButton>
      );
    `,
		expected: `
      import Link from '@atlaskit/link';
      const App = () => (
        <Link
          href="https://atlassian.design/"
        >
          A link
        <AddIcon label="" primaryColor="red"/>
        </Link>
      );
    `,
	});

	check({
		it: 'should migrate link button to default link, and keep the IconButton import',
		original: `
      import { LinkButton, IconButton } from '@atlaskit/button/new';
      const App = () => (
      <div>
        <LinkButton
          appearance="link"
          href="https://atlassian.design/"
          spacing="none"
        >
          A link
        </LinkButton>
        <IconButton icon={AddIcon} />
      </div>
      );
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      import Link from '@atlaskit/link';
      const App = () => (
      <div>
        <Link
          href="https://atlassian.design/"
        >
          A link
        </Link>
        <IconButton icon={AddIcon} />
      </div>
      );
    `,
	});
});
