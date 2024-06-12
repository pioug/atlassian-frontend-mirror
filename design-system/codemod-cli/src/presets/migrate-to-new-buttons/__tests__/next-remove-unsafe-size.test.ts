import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/next-remove-unsafe-size';

const check = createCheck(transformer);

describe('Migrate unsafe size APIs', () => {
	describe('from bounded to render props', () => {
		check({
			it: 'should replace UNSAFE_iconAfter_size with render prop',
			original: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconAfter={MoreIcon} UNSAFE_iconAfter_size="small">Button</Button>
            <LinkButton iconAfter={MoreIcon} UNSAFE_iconAfter_size="small">LinkButton</LinkButton>
          </>
        );
      `,
			expected: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconAfter={(iconProps) => <MoreIcon {...iconProps} size="small" />}>Button</Button>
            <LinkButton iconAfter={(iconProps) => <MoreIcon {...iconProps} size="small" />}>LinkButton</LinkButton>
          </>
        );
      `,
		});

		check({
			it: 'should replace UNSAFE_iconBefore_size with render prop',
			original: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconBefore={MoreIcon} UNSAFE_iconBefore_size="small">Button</Button>
            <LinkButton iconBefore={MoreIcon} UNSAFE_iconBefore_size="small">LinkButton</LinkButton>
          </>
        );
      `,
			expected: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}>Button</Button>
            <LinkButton iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}>LinkButton</LinkButton>
          </>
        );
      `,
		});

		check({
			it: 'should replace UNSAFE_iconBefore_size and UNSAFE_iconAfter_size with render prop',
			original: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button
              iconBefore={MoreIcon}
              UNSAFE_iconBefore_size="small"
              iconAfter={StarIcon}
              UNSAFE_iconAfter_size="large"
            >
              Button
            </Button>
            <LinkButton
              iconBefore={MoreIcon}
              UNSAFE_iconBefore_size="small"
              iconAfter={StarIcon}
              UNSAFE_iconAfter_size="large"
            >
              LinkButton
            </LinkButton>
          </>
        );
      `,
			expected: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button
              iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}
              iconAfter={(iconProps) => <StarIcon {...iconProps} size="large" />}
            >
              Button
            </Button>
            <LinkButton
              iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}
              iconAfter={(iconProps) => <StarIcon {...iconProps} size="large" />}
            >
              LinkButton
            </LinkButton>
          </>
        );
      `,
		});

		check({
			it: 'should replace UNSAFE_size with render prop',
			original: `
        import { IconButton } from '@atlaskit/button/new';
        const App = () => (
          <IconButton label="More" icon={MoreIcon} UNSAFE_size="small" />
        );
      `,
			expected: `
        import { IconButton } from '@atlaskit/button/new';
        const App = () => (
          <IconButton
            label="More"
            icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
          />
        );
      `,
		});

		check({
			it: 'should account for named imports',
			original: `
        import { IconButton as AKIconButton } from '@atlaskit/button/new';
        import { IconButton  } from '../product-icon-button';
        const App = () => (
          <>
            <AKIconButton label="More" icon={MoreIcon} UNSAFE_size="small" />
            <IconButton label="More" icon={MoreIcon} UNSAFE_size="small" />
          </>
        );
      `,
			expected: `
        import { IconButton as AKIconButton } from '@atlaskit/button/new';
        import { IconButton  } from '../product-icon-button';
        const App = () => (
          <>
            <AKIconButton
              label="More"
              icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
            />
            <IconButton label="More" icon={MoreIcon} UNSAFE_size="small" />
          </>
        );
      `,
		});
	});

	describe('from unbounded to render props', () => {
		check({
			it: 'should move UNSAFE_iconAfter_size to size on render prop',
			original: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconAfter={(iconProps) => <MoreIcon {...iconProps} />} UNSAFE_iconAfter_size="small">Button</Button>
            <Button iconAfter={(iconProps) => <MoreIcon {...iconProps} size="large" />} UNSAFE_iconAfter_size="small">Button</Button>
            <LinkButton iconAfter={(iconProps) => <MoreIcon {...iconProps} />} UNSAFE_iconAfter_size="small">LinkButton</LinkButton>
          </>
        );
      `,
			expected: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconAfter={(iconProps) => <MoreIcon {...iconProps} size="small" />}>Button</Button>
            <Button iconAfter={(iconProps) => <MoreIcon {...iconProps} size="large" />}>Button</Button>
            <LinkButton iconAfter={(iconProps) => <MoreIcon {...iconProps} size="small" />}>LinkButton</LinkButton>
          </>
        );
      `,
		});

		check({
			it: 'should move UNSAFE_iconBefore_size to size on render prop',
			original: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconBefore={(iconProps) => <MoreIcon {...iconProps} />} UNSAFE_iconBefore_size="small">Button</Button>
            <Button iconBefore={(iconProps) => <MoreIcon {...iconProps} size="large" />} UNSAFE_iconBefore_size="small">Button</Button>
            <LinkButton iconBefore={(iconProps) => <MoreIcon {...iconProps} />} UNSAFE_iconBefore_size="small">LinkButton</LinkButton>
          </>
        );
      `,
			expected: `
        import Button, { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}>Button</Button>
            <Button iconBefore={(iconProps) => <MoreIcon {...iconProps} size="large" />}>Button</Button>
            <LinkButton iconBefore={(iconProps) => <MoreIcon {...iconProps} size="small" />}>LinkButton</LinkButton>
          </>
        );
      `,
		});

		check({
			it: 'should move UNSAFE_size to size on render prop',
			original: `
        import { IconButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <IconButton icon={(iconProps) => <MoreIcon {...iconProps} />} UNSAFE_size="small" />
          </>
        );
      `,
			expected: `
        import { IconButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <IconButton icon={(iconProps) => <MoreIcon {...iconProps} size="small" />} />
          </>
        );
      `,
		});
	});
});
