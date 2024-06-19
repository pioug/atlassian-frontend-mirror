import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/next-migrate-to-new-button-variants';
import {
	linkButtonMissingHrefComment,
	buttonPropsNoLongerSupportedComment,
	migrateFitContainerButtonToDefaultButtonComment,
	migrateFitContainerButtonToIconButtonComment,
	customThemeButtonComment,
	overlayPropComment,
	loadingButtonComment,
} from '../utils/constants';

const check = createCheck(transformer);

describe('Migrate to icon buttons', () => {
	check({
		it: 'should replace default button with icon button, rename the iconBefore prop',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={MoreIcon} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, rename the iconBefore prop, and replace the JSX element with just identifier',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon />} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, rename the iconBefore prop, and move the props from the icon component to IconButton props',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon size="small" primaryColor="red" label="more icon" />} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton label="more icon" icon={iconProps => <MoreIcon {...iconProps} size="small" primaryColor="red" />} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, rename the iconBefore prop, and keep the original label prop in Button',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />} label="original label" />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton icon={iconProps => <MoreIcon {...iconProps} size="small" />} label="original label" />);
    `,
	});

	check({
		it: 'should replace default button with icon button, and remove the aria label attribute if exist',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button aria-label="aria label" iconBefore={<MoreIcon label="label" />} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton label="aria label" icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, and use the aria label value as label value if icon has no label prop',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button aria-label="aria label" iconBefore={<MoreIcon />} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton label="aria label" icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, rename the iconBefore prop, and remove the medium size prop as its default',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon size="medium" />} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with icon button, move the icon component to a render prop with only the required props',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button onClick={onClick} iconBefore={<MoreIcon label="more icon" primaryColor="red" />}
  />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton label="more icon" onClick={onClick} icon={iconProps => <MoreIcon {...iconProps} primaryColor="red" />} />);
    `,
	});

	check({
		it: 'should replace default button with icon button and keep the spread props',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={icon} {...spreadProps} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (<IconButton icon={icon} {...spreadProps} />);
    `,
	});

	check({
		it: 'should migrate default button to icon button, remove shouldFitContainer, and add an comment for manual check',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon size="small" />} shouldFitContainer onClick={onClick} />);
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (
        <IconButton
          // TODO: (from codemod) ${migrateFitContainerButtonToIconButtonComment}
          icon={iconProps => <MoreIcon {...iconProps} size="small" />}
          onClick={onClick}
        />
      );
    `,
	});

	check({
		it: 'should check if the root component of an icon prop is an actual icon before moving to bounded API',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          iconBefore={
            <IconWrapper>
              <StarIcon />
            </IconWrapper>
          }
        />
      );
    `,
		expected: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          iconBefore={
            <IconWrapper>
              <StarIcon />
            </IconWrapper>
          }
        />
      );
    `,
	});
});

describe('Migrate to loading buttons', () => {
	check({
		it: 'should import and replace loading button with default button + isLoading prop',
		original: `
      import LoadingButton from '@atlaskit/button/loading-button';
      const App = () => (
        <LoadingButton isLoading={true} onClick={() => {}} appearance="primary">Loading Button</LoadingButton>
      );
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <Button isLoading={true} onClick={() => {}} appearance="primary">Loading Button</Button>
      );
    `,
	});
	check({
		it: 'should import and replace aliased loading button with default button + isLoading prop, and do not modify the icon prop',
		original: `
      import FooBar from '@atlaskit/button/loading-button';
      const App = () => (
        <FooBar isLoading={true} onClick={() => {}} appearance="primary" iconBefore={<MoreIcon />}>Loading Button</FooBar>
      );
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <Button
          isLoading={true}
          onClick={() => {}}
          appearance="primary"
          iconBefore={MoreIcon}>Loading Button</Button>
      );
    `,
	});

	check({
		it: 'should import and replace aliased loading button with default button + isLoading prop',
		original: `
      import FooBar from '@atlaskit/button/loading-button';
      const App = () => (
        <FooBar isLoading={true} onClick={() => {}} appearance="primary">Loading Button</FooBar>
      );
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <Button isLoading={true} onClick={() => {}} appearance="primary">Loading Button</Button>
      );
    `,
	});

	check({
		it: `should rename the custom theme button import specifier,
	  and replace the loading button with default button`,
		original: `
	  import Button from '@atlaskit/button/custom-theme-button';
	  import LoadingButton from '@atlaskit/button/loading-button';
	  const App = () => (
	    <>
	      <Button>Custom theme button</Button>
	      <LoadingButton isLoading={isLoading}>loading button</LoadingButton>
	    </>
	  );
    render(Button);
    render(LoadingButton);
	`,
		expected: `
	  import LegacyButton from '@atlaskit/button/custom-theme-button';
	  import Button from '@atlaskit/button/new';
	  const App = () => (
	    <>
	      /* TODO: (from codemod) ${customThemeButtonComment} */
	      <LegacyButton>Custom theme button</LegacyButton>
	      <Button isLoading={isLoading}>loading button</Button>
	    </>
	  );
    render(LegacyButton);
    render(Button);
	`,
	});

	check({
		it: 'should migrate from loading button to icon button',
		original: `
      import LoadingButton from '@atlaskit/button/loading-button';
      const App = () => (
        <LoadingButton
          isLoading={isLoading}
          iconBefore={<MoreIcon label="" />}
          appearance="subtle"
          aria-label="Show more"
        />
      );
    `,
		expected: `
      import { IconButton } from '@atlaskit/button/new';
      const App = () => (
        <IconButton
          label="Show more"
          isLoading={isLoading}
          icon={MoreIcon}
          appearance="subtle"
        />
      );
    `,
	});

	describe('should always migrate loading buttons to buttons instead of link buttons, and leave a comment for unmigratable link buttons', () => {
		describe('for default buttons', () => {
			check({
				it: 'with href',
				original: `
        import LoadingButton from '@atlaskit/button/loading-button';
        const App = () => (
          <>
            <LoadingButton isLoading href="/#">A loading button</LoadingButton>
          </>
        );
      `,
				expected: `
        import Button from '@atlaskit/button/new';
        const App = () => (
          <>
            /* TODO: (from codemod) ${loadingButtonComment({ hasHref: true, hasLinkAppearance: false })} */
            <Button isLoading href="/#">A loading button</Button>
          </>
        );
      `,
			});
			check({
				it: 'with link appearance',
				original: `
          import LoadingButton from '@atlaskit/button/loading-button';
          const App = () => (
            <>
              <LoadingButton isLoading appearance="subtle-link">A loading button</LoadingButton>
            </>
          );
        `,
				expected: `
          import Button from '@atlaskit/button/new';
          const App = () => (
            <>
              /* TODO: (from codemod) ${loadingButtonComment({ hasHref: false, hasLinkAppearance: true })} */
              <Button isLoading appearance="subtle-link">A loading button</Button>
            </>
          );
        `,
			});
			check({
				it: 'with href and link appearance',
				original: `
          import LoadingButton from '@atlaskit/button/loading-button';
          const App = () => (
            <>
              <LoadingButton isLoading href="/#" appearance="link">A loading button</LoadingButton>
            </>
          );
        `,
				expected: `
          import Button from '@atlaskit/button/new';
          const App = () => (
            <>
              /* TODO: (from codemod) ${loadingButtonComment({ hasHref: true, hasLinkAppearance: true })} */
              <Button isLoading href="/#" appearance="link">A loading button</Button>
            </>
          );
        `,
			});
			describe('for icon buttons', () => {
				check({
					it: 'with href',
					original: `
            import LoadingButton from '@atlaskit/button/loading-button';
            const App = () => (
              <>
              <LoadingButton isLoading href="/#" iconBefore={<Icon label="Hello" />} />
              </>
            );
          `,
					expected: `
            import { IconButton } from '@atlaskit/button/new';
            const App = () => (
              <>
                /* TODO: (from codemod) ${loadingButtonComment({ hasHref: true, hasLinkAppearance: false })} */
                <IconButton label="Hello" isLoading href="/#" icon={Icon} />
              </>
            );
          `,
				});
				check({
					it: 'with link appearance',
					original: `
            import LoadingButton from '@atlaskit/button/loading-button';
            const App = () => (
              <>
                <LoadingButton isLoading appearance="subtle-link" iconAfter={<Icon label="Hello" />} />
              </>
            );
          `,
					expected: `
            import { IconButton } from '@atlaskit/button/new';
            const App = () => (
              <>
                /* TODO: (from codemod) ${loadingButtonComment({ hasHref: false, hasLinkAppearance: true })} */
                <IconButton label="Hello" isLoading appearance="subtle-link" icon={Icon} />
              </>
            );
          `,
				});
				check({
					it: 'with href and link appearance',
					original: `
            import LoadingButton from '@atlaskit/button/loading-button';
            const App = () => (
              <>
                <LoadingButton isLoading href="/#" appearance="link" iconBefore={<Icon label="Hello" />} />
              </>
            );
          `,
					expected: `
            import { IconButton } from '@atlaskit/button/new';
            const App = () => (
              <>
                /* TODO: (from codemod) ${loadingButtonComment({ hasHref: true, hasLinkAppearance: true })} */
                <IconButton label="Hello" isLoading href="/#" appearance="link" icon={Icon} />
              </>
            );
          `,
				});
			});
		});
	});
});

describe('Migrate to link buttons', () => {
	check({
		it: 'should import and replace default standard button with new link button',
		original: `
      import StandardButton from '@atlaskit/button/standard-button';
      const App = () => (<StandardButton href='/#'>Link button</StandardButton>);
    `,
		expected: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (<LinkButton href='/#'>Link button</LinkButton>);
    `,
	});

	check({
		it: 'should replace default button with link button if it has both href and icon prop',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button href='/#' iconBefore={icon}>Link button</Button>);
    `,
		expected: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (<LinkButton href='/#' iconBefore={icon}>Link button</LinkButton>);
    `,
	});

	check({
		it: 'should import and replace default standard button with new link button',
		original: `
      import StandardButton from '@atlaskit/button/standard-button';
      const App = () => (<StandardButton href='/#'>Link button</StandardButton>);
    `,
		expected: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (<LinkButton href='/#'>Link button</LinkButton>);
    `,
	});

	check({
		it: 'should replace default button with link button, and move size prop from the icon component to LinkButton props',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button href='/#' iconAfter={<MoreIcon label="" size="small" />}>Link button</Button>);
    `,
		expected: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <LinkButton
          href='/#'
          iconAfter={iconProps => <MoreIcon {...iconProps} size="small" />}
        >
          Link button
        </LinkButton>
      );
    `,
	});
});

describe('Migrate to link icon buttons', () => {
	check({
		it: 'should replace default button with icon link button, and rename iconBefore prop to icon',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button href='/#' iconBefore={icon} />);
    `,
		expected: `
      import { LinkIconButton } from '@atlaskit/button/new';
      const App = () => (<LinkIconButton href='/#' icon={icon} />);
    `,
	});

	check({
		it: 'should replace default button with icon link button, and rename iconBefore prop to icon, and remove the aria-label',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button href='/#' aria-label="aria label" iconBefore={<MoreIcon label="label" />} />);
    `,
		expected: `
      import { LinkIconButton } from '@atlaskit/button/new';
      const App = () => (<LinkIconButton label="aria label" href='/#' icon={MoreIcon} />);
    `,
	});

	check({
		it: 'should replace default button with link button and import both default and link button',
		original: `
      import Button from '@atlaskit/button/standard-button';
      import ButtonGroup from '@atlaskit/button/button-group';
      const App = () => (
        <div>
          <Button>Default button</Button>
          <Button {...props}>Default button with spread props</Button>
          <ButtonGroup>Button group</ButtonGroup>
          <Button href='/#'>Link button</Button>
        </div>
      );
    `,
		expected: `
      import Button, { LinkButton } from '@atlaskit/button/new';
      import ButtonGroup from '@atlaskit/button/button-group';
      const App = () => (
        <div>
          <Button>Default button</Button>
          <Button {...props}>Default button with spread props</Button>
          <ButtonGroup>Button group</ButtonGroup>
          <LinkButton href='/#'>Link button</LinkButton>
        </div>
      );
    `,
	});

	check({
		it: 'should not import or replace anything if there are already new button variants',
		original: `
      import { IconButton, LinkIconButton } from '@atlaskit/button/new';
      const App = () => (
        <>
          <IconButton icon={Icon}>Icon button</IconButton>
          <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
        </>
      );
    `,
		expected: `
      import { IconButton, LinkIconButton } from '@atlaskit/button/new';
      const App = () => (
        <>
          <IconButton icon={Icon}>Icon button</IconButton>
          <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
        </>
      );
    `,
	});

	check({
		it: 'should not import or replace anything if there is already a link button',
		original: `
      import Button, { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <div>
          <LinkButton href='/#'>Link button</LinkButton>
          <Button>Default button</Button>
        </div>
      );
    `,
		expected: `
      import Button, { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <div>
          <LinkButton href='/#'>Link button</LinkButton>
          <Button>Default button</Button>
        </div>
      );
    `,
	});

	check({
		it: 'should only replace the import if the button is used in a call expression',
		original: `
      import Button from '@atlaskit/button/standard-button';
      render(Button);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      render(Button);
    `,
	});
});

describe('Migrate to default buttons', () => {
	check({
		it: 'should replace default button with new button, move the props from the icon component to Button props',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />}>Button with icon before</Button>);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (<Button iconBefore={iconProps => <MoreIcon {...iconProps} size="small" />}>Button with icon before</Button>);
    `,
	});

	check({
		it: 'should migrate default, move the props, and move to render props for icon',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button onClick={onClick} iconBefore={<MoreIcon size="small" testId="test" />}>text</Button>);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (<Button onClick={onClick} iconBefore={iconProps => <MoreIcon {...iconProps} size="small" testId="test" />}>text</Button>);
    `,
	});

	check({
		it: 'should replace old buttons with new button if non-link appearance values applied',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (<Button appearance="primary" isDisabled>Primary button</Button>);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (<Button appearance="primary" isDisabled>Primary button</Button>);
    `,
	});

	check({
		it: 'should migrate old button to new default button, and move size prop from the both icon components to render prop',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          iconAfter={<MoreIcon label="" size="small" />}
          iconBefore={<AddIcon label="" size="large" />}
        >
          button with many icons
        </Button>);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <Button
          iconAfter={iconProps => <MoreIcon {...iconProps} size="small" />}
          iconBefore={iconProps => <AddIcon {...iconProps} size="large" />}
        >
          button with many icons
        </Button>);
    `,
	});

	check({
		it: 'should migrate default button to new button, move icon label to button label and remove icon if shouldFitContainer and icon label applied, and add an comment for manual check',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          iconBefore={<MoreIcon label="more" size="small" />}
          shouldFitContainer
          onClick={onClick}
        />
      );
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <Button
          // TODO: (from codemod) ${migrateFitContainerButtonToDefaultButtonComment}
          shouldFitContainer
          onClick={onClick}
        >
          More
        </Button>
      );
    `,
	});
});

describe('Migrate types from new entry-point', () => {
	check({
		it: 'should import Appearance type from new entry point',
		original: `
      import Button, { ButtonProps } from '@atlaskit/button/standard-button';
      import { BaseProps, Appearance } from '@atlaskit/button/types';
      const App = () => (<Button>Button</Button>);
    `,
		expected: `
      import Button, { type ButtonProps, type Appearance } from '@atlaskit/button/new';
      import { BaseProps } from '@atlaskit/button/types';
      const App = () => (<Button>Button</Button>);
    `,
	});

	check({
		it: 'should import Spacing type from new entry point',
		original: `
      import Button, { ButtonProps } from '@atlaskit/button/standard-button';
      import { type Spacing } from '@atlaskit/button/types';
      const App = () => (<Button>Button</Button>);
    `,
		expected: `
      import Button, { type ButtonProps, type Spacing } from '@atlaskit/button/new';
      const App = () => (<Button>Button</Button>);
    `,
	});

	check({
		it: 'should import new button and prop types from new entry point',
		original: `
      import Button, { ButtonProps } from '@atlaskit/button/standard-button';
      const App = () => (<Button>Button</Button>);
    `,
		expected: `
      import Button, { type ButtonProps } from '@atlaskit/button/new';
      const App = () => (<Button>Button</Button>);
    `,
	});

	check({
		it: 'should import new icon button and icon button prop types from new entry point',
		original: `
      import Button, { ButtonProps } from '@atlaskit/button/standard-button';
      const App = () => (<Button
        appearance={appearance as ButtonProps['appearance']}
        iconBefore={<AddIcon label="add" size="small" />}
      />);
    `,
		expected: `
      import { IconButton, type IconButtonProps as ButtonProps } from '@atlaskit/button/new';
      const App = () => (
        <IconButton
          label="add"
          appearance={appearance as ButtonProps['appearance']}
          icon={iconProps => <AddIcon {...iconProps} size="small" />}
        />
       );
    `,
	});
});

describe('Migrate to new button variants: edge cases', () => {
	check({
		it: 'should migrate the button with link appearance but without href to a default button, add add a comment',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <div>
          <Button
            appearance="link"
          >
            Button looks like a link
          </Button>
        </div>
      );
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (
        <div>
          <Button
            // TODO: (from codemod) ${linkButtonMissingHrefComment}
            appearance="link"
          >
            Button looks like a link
          </Button>
        </div>
      );
    `,
	});

	check({
		it: 'should replace default button with link button and import both default and link button',
		original: `
      import Button from '@atlaskit/button/standard-button';
      import ButtonGroup from '@atlaskit/button/button-group';
      const App = () => (
        <div>
          <Button>Default button</Button>
          <Button {...props}>Default button with spread props</Button>
          <ButtonGroup>Button group</ButtonGroup>
          <Button href='/#'>Link button</Button>
        </div>
      );
    `,
		expected: `
      import Button, { LinkButton } from '@atlaskit/button/new';
      import ButtonGroup from '@atlaskit/button/button-group';
      const App = () => (
        <div>
          <Button>Default button</Button>
          <Button {...props}>Default button with spread props</Button>
          <ButtonGroup>Button group</ButtonGroup>
          <LinkButton href='/#'>Link button</LinkButton>
        </div>
      );
    `,
	});

	check({
		it: 'should only replace the import if the button is used in a call expression',
		original: `
      import Button from '@atlaskit/button/standard-button';
      render(Button);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      render(Button);
    `,
	});

	check({
		it: 'should only replace the loading button import if the button is used in a call expression',
		original: `
      import LoadingButton from '@atlaskit/button/loading-button';
      render(LoadingButton);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      render(Button);
    `,
	});

	check({
		it: 'should keep the jsx pragma',
		original: `
      /** jsx @jsx */
      import Button from '@atlaskit/button/standard-button';
      render(Button);
    `,
		expected: `
      /** jsx @jsx */
      import Button from '@atlaskit/button/new';
      render(Button);
    `,
	});

	check({
		it: 'migrates to new button when old button is aliased',
		original: `
      import AkButton from '@atlaskit/button';

      const App = () => (<AkButton>Hello</AkButton>)`,
		expected: `
      import Button from '@atlaskit/button/new';

      const App = () => (<Button>Hello</Button>)`,
	});

	describe('should migrate if there is a mixture of old and new buttons', () => {
		describe('when new buttons are not yet imported', () => {
			check({
				it: 'case 1',
				original: `
          import Button, { LoadingButton } from '@atlaskit/button';
          import { IconButton } from '@atlaskit/button/new';
          const App = () => (
            <>
              <Button href="/#">Link button</Button>
              <LoadingButton isLoading={isLoading}>Loading button</LoadingButton>
              <IconButton icon={Icon}>Icon button</IconButton>
            </>
          );
        `,
				expected: `
          import Button, { LinkButton, IconButton } from '@atlaskit/button/new';
          const App = () => (
            <>
              <LinkButton href="/#">Link button</LinkButton>
              <Button isLoading={isLoading}>Loading button</Button>
              <IconButton icon={Icon}>Icon button</IconButton>
            </>
          );
        `,
			});
			check({
				it: 'case 2',
				original: `
          import Button from '@atlaskit/button/standard-button';
          import NewButton, { LinkButton } from '@atlaskit/button/new';
          const App = () => (
            <>
              <Button href="/#" iconBefore={<Icon label="my label" />} />
              <NewButton>New button</NewButton>
              <LinkButton href="/#">Link button</LinkButton>
            </>
          );
        `,
				expected: `
          import NewButton, { LinkButton, LinkIconButton } from '@atlaskit/button/new';
          const App = () => (
            <>
              <LinkIconButton label="my label" href="/#" icon={Icon} />
              <NewButton>New button</NewButton>
              <LinkButton href="/#">Link button</LinkButton>
            </>
          );
        `,
			});
		});
		check({
			it: 'when the new button is already imported',
			original: `
        import Button from '@atlaskit/button/standard-button';
        import { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <Button href="/#">Link button</Button>
            <LinkButton href="/#">Link button</LinkButton>
          </>
        );
      `,
			expected: `
        import { LinkButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <LinkButton href="/#">Link button</LinkButton>
            <LinkButton href="/#">Link button</LinkButton>
          </>
        );
      `,
		});
		describe('with aliased', () => {
			check({
				it: 'old button',
				original: `
          import OldButton from '@atlaskit/button';
          import Button from '@atlaskit/button/new';

          const App = () => (
            <>
              <OldButton>Hello</OldButton>
              <Button>Hello</Button>
            </>
          );
        `,
				expected: `
          import Button from '@atlaskit/button/new';

          const App = () => (
            <>
              <Button>Hello</Button>
              <Button>Hello</Button>
            </>
          );
        `,
			});
			check({
				it: 'new button',
				original: `
          import Button from '@atlaskit/button';
          import NewButton from '@atlaskit/button/new';

          const App = () => (
            <>
              <Button>Hello</Button>
              <NewButton>Hello</NewButton>
            </>
          );
        `,
				expected: `
          import NewButton from '@atlaskit/button/new';

          const App = () => (
            <>
              <NewButton>Hello</NewButton>
              <NewButton>Hello</NewButton>
            </>
          );
        `,
			});
			check({
				it: 'old and new buttons',
				original: `
          import OldButton from '@atlaskit/button';
          import NewButton from '@atlaskit/button/new';

          const App = () => (
            <>
              <OldButton>Hello</OldButton>
              <NewButton>Hello</NewButton>
            </>
          );
        `,
				expected: `
          import NewButton from '@atlaskit/button/new';

          const App = () => (
            <>
              <NewButton>Hello</NewButton>
              <NewButton>Hello</NewButton>
            </>
          );
        `,
			});
		});
	});

	describe('migrates when there are multiple old buttons', () => {
		check({
			it: 'standard buttons',
			original: `
        import OldButton from '@atlaskit/button';
        import SecondOldButton from '@atlaskit/button/standard-button';
        const App = () => (
          <>
            <OldButton iconBefore={<Icon label="my label" />} />
            <SecondOldButton href="/#" iconBefore={<Icon label="my label" />} />
          </>
        );
      `,
			expected: `
        import { IconButton, LinkIconButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <IconButton label="my label" icon={Icon} />
            <LinkIconButton label="my label" href="/#" icon={Icon} />
          </>
        );
      `,
		});
		check({
			it: 'loading buttons',
			original: `
        import { LoadingButton } from '@atlaskit/button';
        import SecondLoadingButton from '@atlaskit/button/loading-button';
        const App = () => (
          <>
            <LoadingButton isLoading iconBefore={<Icon label="my label" />} />
            <SecondLoadingButton isLoading>My button</SecondLoadingButton>
          </>
        );
      `,
			expected: `
        import Button, { IconButton } from '@atlaskit/button/new';
        const App = () => (
          <>
            <IconButton label="my label" isLoading icon={Icon} />
            <Button isLoading>My button</Button>
          </>
        );
      `,
		});
	});
});

describe('Should not migrate to new button variants: edge cases', () => {
	check({
		it: 'should not replace the old buttons with a custom component overrides',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          component={Link}
          href="/#"
        />
      );
    `,
		expected: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button
          // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
          component={Link}
          href="/#"
        />
      );
    `,
	});

	check({
		it: 'should not replace the old buttons with a css prop',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button css={buttonStyle} />
      );
    `,
		expected: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <Button // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
          css={buttonStyle}
        />
      );
    `,
	});

	check({
		it: 'should not replace the old buttons with a style or component prop, but should replace the other buttons, and rename the old button',
		original: `
      import Button from '@atlaskit/button/standard-button';
      const App = () => (
        <div>
          <Button style={buttonStyle} />
          <Button component={customComponent} />
          <Button>Button</Button>
        </div>
      );
    `,
		expected: `
      import LegacyButton from '@atlaskit/button/standard-button';
      import Button from '@atlaskit/button/new';
      const App = () => (
        <div>
          <LegacyButton
            // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
            style={buttonStyle} />
          <LegacyButton
            // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
            component={customComponent} />
          <Button>Button</Button>
        </div>
      );
    `,
	});

	check({
		it: 'should not import or replace anything if there are only new button variants',
		original: `
      import { IconButton, LinkIconButton } from '@atlaskit/button/new';
      const App = () => (
        <>
          <IconButton icon={Icon}>Icon button</IconButton>
          <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
        </>
      );
    `,
		expected: `
      import { IconButton, LinkIconButton } from '@atlaskit/button/new';
      const App = () => (
        <>
          <IconButton icon={Icon}>Icon button</IconButton>
          <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
        </>
      );
    `,
	});

	check({
		it: 'should not import or replace anything if there is already a link button',
		original: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <div>
          <LinkButton href='/#'>Link button</LinkButton>
          <Button>Default button</Button>
        </div>
      );
    `,
		expected: `
      import { LinkButton } from '@atlaskit/button/new';
      const App = () => (
        <div>
          <LinkButton href='/#'>Link button</LinkButton>
          <Button>Default button</Button>
        </div>
      );
    `,
	});
});

describe('Add comment for custom theme buttons', () => {
	check({
		it: 'should add an inline comment for custom theme button to suggest migrating to Primitives',
		original: `
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      const App = () => (<CustomThemeButton />);
    `,
		expected: `
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      const App = () => (
        /* TODO: (from codemod) ${customThemeButtonComment} */
        <CustomThemeButton />
      );
    `,
	});
});

describe('Add comment for deprecated overlay prop', () => {
	check({
		it: 'should add an inline comment for legacy buttons with overlay props',
		original: `
      import Button from '@atlaskit/button';
      const App = () => (<Button overlay="Loading...">Hello</Button>);
    `,
		expected: `
      import Button from '@atlaskit/button/new';
      const App = () => (

        <Button
					/* TODO: (from codemod) ${overlayPropComment} */
					overlay="Loading..."
				>
					Hello
				</Button>
      );
    `,
	});
	check({
		it: 'should add an inline comment for legacy custom theme buttons with overlay props',
		original: `
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      const App = () => (<CustomThemeButton overlay="Loading...">Hello</CustomThemeButton>);
    `,
		expected: `
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      const App = () => (
				/* TODO: (from codemod) ${customThemeButtonComment} */
        <CustomThemeButton
					/* TODO: (from codemod) ${overlayPropComment} */
					overlay="Loading..."
				>
					Hello
				</CustomThemeButton>
      );
    `,
	});
});
