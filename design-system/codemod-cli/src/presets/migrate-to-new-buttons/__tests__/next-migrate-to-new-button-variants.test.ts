const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
import transformer from '../codemods/next-migrate-to-new-button-variants';
import {
  linkButtonMissingHrefComment,
  NEW_BUTTON_VARIANTS as variants,
  NEW_BUTTON_ENTRY_POINT,
  iconPropsNoLongerSupportedComment,
  buttonPropsNoLongerSupportedComment,
  migrateFitContainerButtonToDefaultButtonComment,
  migrateFitContainerButtonToIconButtonComment,
} from '../utils/constants';

describe('migrate-to-icon-buttons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={MoreIcon} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} />);
    `,
    'should replace default button with icon button, rename the iconBefore prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon />} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} />);
    `,
    'should replace default button with icon button, rename the iconBefore prop, and replace the JSX element with just identifier',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} label="more icon" UNSAFE_size="small" />);
    `,
    'should replace default button with icon button, rename the iconBefore prop, and move the props from the icon component to IconButton props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button aria-label="aria label" iconBefore={<MoreIcon label="label" />} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} label="label" />);
    `,
    'should replace default button with icon button, and remove the aria label attribute if exist',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button aria-label="aria label" iconBefore={<MoreIcon />} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} label="aria label" />);
    `,
    'should replace default button with icon button, and use the aria label value as label value if icon has no label prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon size="medium" />} />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.icon} icon={MoreIcon} />);
    `,
    'should replace default button with icon button, rename the iconBefore prop, and remove the medium size prop as its default',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (<Button
onClick={onClick}
iconBefore={<MoreIcon label="more icon" primaryColor="red" />}
/>);
`,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (<${variants.icon}
  onClick={onClick}
  // TODO: (from codemod) ${iconPropsNoLongerSupportedComment}
  icon={MoreIcon}
  label="more icon" />);
`,
    'should replace default button with icon button, move the props, remove the unsupported props from the icon component, and add an inline comment',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button iconBefore={icon} {...spreadProps} />);
        `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
        const App = () => (<${variants.icon} icon={icon} {...spreadProps} />);
        `,
    'should replace default button with icon button and keep the spread props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (
      <Button
        iconBefore={<MoreIcon size="small" />}
        shouldFitContainer
        onClick={onClick}
      />);
    `,
    `import { ${variants.icon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (
      <${variants.icon}
        // TODO: (from codemod) ${migrateFitContainerButtonToIconButtonComment}
        icon={MoreIcon}
        onClick={onClick}
        UNSAFE_size="small" />);
    `,
    'should migrate default button to icon button, remove shouldFitContainer, and add an comment for manual check',
  );
});

describe('migrate-to-loading-buttons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import LoadingButton from '@atlaskit/button/loading-button';
    const App = () => (
      <LoadingButton isLoading={true} onClick={() => {}} appearance="primary">Loading Button</LoadingButton>
    );
    `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (
      <${variants.default} isLoading={true} onClick={() => {}} appearance="primary">Loading Button</${variants.default}>
    );`,
    'should import and replace loading button with default button + isLoading prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import FooBar from '@atlaskit/button/loading-button';
    const App = () => (
      <FooBar isLoading={true} onClick={() => {}} appearance="primary">Loading Button</FooBar>
    );
    `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (
      <${variants.default} isLoading={true} onClick={() => {}} appearance="primary">Loading Button</${variants.default}>
    );`,
    'should import and replace aliased loading button with default button + isLoading prop',
  );
});

describe('migrate-to-link-buttons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import StandardButton from '@atlaskit/button/standard-button';
    const App = () => (<StandardButton href='/#'>Link button</StandardButton>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#'>Link button</${variants.link}>);
    `,
    'should import and replace default standard button with new link button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<Button href='/#'>Link button</Button>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#'>Link button</${variants.link}>);
    `,
    'should replace default new button with link button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon}>Link button</Button>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#' iconBefore={icon}>Link button</${variants.link}>);
    `,
    'should replace default button with link button if it has both href and icon prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon}>Link button</Button>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#' iconBefore={icon}>Link button</${variants.link}>);
    `,
    'should replace default button with link button if it has both href and icon prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import StandardButton from '@atlaskit/button/standard-button';
    const App = () => (<StandardButton href='/#'>Link button</StandardButton>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#'>Link button</${variants.link}>);
    `,
    'should import and replace default standard button with new link button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconAfter={<MoreIcon label="" size="small" />}>Link button</Button>);
    `,
    `import { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.link} href='/#' iconAfter={MoreIcon} UNSAFE_iconAfter_size="small">Link button</${variants.link}>);
    `,
    'should replace default button with link button, and move size prop from the icon component to LinkButton props',
  );
});

describe('migrate-to-link-icon-buttons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon} />);
    `,
    `import { ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.linkIcon} href='/#' icon={icon} />);
    `,
    'should replace default button with icon link button, and rename iconBefore prop to icon',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon} />);
    `,
    `import { ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.linkIcon} href='/#' icon={icon} />);
    `,
    'should replace default button with icon link button, and rename iconBefore prop to icon',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' aria-label="aria label" iconBefore={<MoreIcon label="label" />} />);
    `,
    `import { ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.linkIcon} href='/#' icon={MoreIcon} label="label" />);
    `,
    'should replace default button with icon link button, and rename iconBefore prop to icon, and remove the aria-label',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
import ButtonGroup from '@atlaskit/button/button-group';
const App = () => (
    <div>
        <Button>Default button</Button>
        <Button {...props}>Default button with spread props</Button>
        <ButtonGroup>Button group</ButtonGroup>
        <Button href='/#'>Link button</Button>
    </div>
);`,
    `import ${variants.default}, { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
import ButtonGroup from '@atlaskit/button/button-group';
const App = () => (
    <div>
        <${variants.default}>Default button</${variants.default}>
        <${variants.default} {...props}>Default button with spread props</${variants.default}>
        <ButtonGroup>Button group</ButtonGroup>
        <${variants.link} href='/#'>Link button</${variants.link}>
    </div>
);`,
    'should replace default button with link button and import both default and link button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { ${variants.icon}, ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
        const App = () => (
            <>
              <${variants.icon} icon={Icon}>Icon button</${variants.icon}>
              <${variants.linkIcon} icon={Icon} href="/#">Icon link button</${variants.linkIcon}>
            </>
        );
        `,
    `import { ${variants.icon}, ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
        const App = () => (
            <>
              <${variants.icon} icon={Icon}>Icon button</${variants.icon}>
              <${variants.linkIcon} icon={Icon} href="/#">Icon link button</${variants.linkIcon}>
            </>
        );
        `,
    'should not import or replace anything if there are already new button variants',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import ${variants.default}, { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (
    <div>
        <${variants.link} href='/#'>Link button</${variants.link}>
        <${variants.default}>Default button</${variants.default}>
    </div>
);`,
    `import ${variants.default}, { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (
    <div>
        <${variants.link} href='/#'>Link button</${variants.link}>
        <${variants.default}>Default button</${variants.default}>
    </div>
);`,
    'should not import or replace anything if there is already a link button',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
        render(Button);
        `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
        render(${variants.default});
        `,
    'should only replace the import if the button is used in a call expression',
  );
});

describe('migrate-to-default-buttons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />}>Button with icon before</Button>);
    `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (<${variants.default} iconBefore={MoreIcon} UNSAFE_iconBefore_size="small">Button with icon before</${variants.default}>);
    `,
    'should replace default button with new button, move the props from the icon component to Button props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
  const App = () => (<Button onClick={onClick} iconBefore={<MoreIcon size="small" testId="test" />}>text</Button>);
`,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
  const App = () => (<${variants.default}
    onClick={onClick}
    // TODO: (from codemod) ${iconPropsNoLongerSupportedComment}
    iconBefore={MoreIcon}
    UNSAFE_iconBefore_size="small">text</${variants.default}>);
`,
    'should migrate default, move the props, remove the unsupported props from the icon component, and add an inline comment',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (<Button appearance="primary" isDisabled>Primary button</Button>);
`,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (<${variants.default} appearance="primary" isDisabled>Primary button</${variants.default}>);
`,
    'should replace old buttons with new button if non-link appearance values applied',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
  <Button
    iconAfter={<MoreIcon label="" size="small" />}
    iconBefore={<AddIcon label="" size="large" />}
  >
    button with many icons
  </Button>);
`,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (
  <${variants.default}
    iconAfter={MoreIcon}
    iconBefore={AddIcon}
    UNSAFE_iconAfter_size="small"
    UNSAFE_iconBefore_size="large">
    button with many icons
  </${variants.default}>);
`,
    'should migrate old button to new default button, and move size prop from the both icon components to new Button props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (
      <Button
        iconBefore={<MoreIcon label="more" size="small" />}
        shouldFitContainer
        onClick={onClick}
      />);
    `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
    const App = () => (
      <${variants.default}
        // TODO: (from codemod) ${migrateFitContainerButtonToDefaultButtonComment}
        shouldFitContainer
        onClick={onClick}>More</${variants.default}>);
    `,
    'should migrate default button to new button, move icon label to button label and remove icon if shouldFitContainer and icon label applied, and add an comment for manual check',
  );
});

describe('migrate-types-from-new-entry-point', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import { BaseProps, Appearance } from '@atlaskit/button/types';
const App = () => (<Button>Button</Button>);
`,
    `import ${variants.default}, { type ButtonProps, type Appearance } from '${NEW_BUTTON_ENTRY_POINT}';
import { BaseProps } from '@atlaskit/button/types';
const App = () => (<${variants.default}>Button</${variants.default}>);
`,
    'should import Appearance type from new entry point',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import { type Spacing } from '@atlaskit/button/types';
const App = () => (<Button>Button</Button>);
`,
    `import ${variants.default}, { type ButtonProps, type Spacing } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (<${variants.default}>Button</${variants.default}>);
`,
    'should import Spacing type from new entry point',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button, { ButtonProps } from '@atlaskit/button/standard-button';
const App = () => (<Button>Button</Button>);
`,
    `import ${variants.default}, { type ButtonProps } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (<${variants.default}>Button</${variants.default}>);
`,
    'should import new button and prop types from new entry point',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button, { ButtonProps } from '@atlaskit/button/standard-button';
const App = () => (<Button
  appearance={appearance as ButtonProps['appearance']}
  iconBefore={<AddIcon label="add" size="small" />}
/>);
`,
    `import { ${variants.icon}, type IconButtonProps as ButtonProps } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (<${variants.icon}
  appearance={appearance as ButtonProps['appearance']}
  icon={AddIcon}
  label="add"
  UNSAFE_size="small" />);
`,
    'should import new icon button and icon button prop types from new entry point',
  );
});

describe('migrate-to-new-button-variants: edge cases', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
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
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
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
    'should migrate the button with link appearance but without href to a default button, add add a comment',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
import ButtonGroup from '@atlaskit/button/button-group';
const App = () => (
    <div>
        <Button>Default button</Button>
        <Button {...props}>Default button with spread props</Button>
        <ButtonGroup>Button group</ButtonGroup>
        <Button href='/#'>Link button</Button>
    </div>
);`,
    `import ${variants.default}, { ${variants.link} } from '${NEW_BUTTON_ENTRY_POINT}';
import ButtonGroup from '@atlaskit/button/button-group';
const App = () => (
    <div>
        <${variants.default}>Default button</${variants.default}>
        <${variants.default} {...props}>Default button with spread props</${variants.default}>
        <ButtonGroup>Button group</ButtonGroup>
        <${variants.link} href='/#'>Link button</${variants.link}>
    </div>
);`,
    'should replace default button with link button and import both default and link button',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
        render(Button);
        `,
    `import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
        render(Button);
        `,
    'should only replace the import if the button is used in a call expression',
  );
});

describe('should-not-migrate-to-new-button-variants: edge cases', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
  <Button
    component={Link}
    href="/#"
  />
);`,
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
  <Button
    // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
    component={Link}
    href="/#"
  />
);`,
    'should not replace the old buttons with a custom component overrides',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
  <Button css={buttonStyle} />
);`,
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
  <Button // TODO: (from codemod) ${buttonPropsNoLongerSupportedComment}
  css={buttonStyle} />
);`,
    'should not replace the old buttons with a css prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (
<div>
  <Button style={buttonStyle} />
  <Button component={customComponent} />
  <Button>Button</Button>
</div>
);
`,
    `import LegacyButton from '@atlaskit/button/standard-button';
import ${variants.default} from '${NEW_BUTTON_ENTRY_POINT}';
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
);`,
    'should not replace the old buttons with a style or component prop, but should replace the other buttons, and rename the old button',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { ${variants.icon}, ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
        const App = () => (
            <>
              <${variants.icon} icon={Icon}>Icon button</${variants.icon}>
              <${variants.linkIcon} icon={Icon} href="/#">Icon link button</${variants.linkIcon}>
            </>
        );
        `,
    `import { ${variants.icon}, ${variants.linkIcon} } from '${NEW_BUTTON_ENTRY_POINT}';
        const App = () => (
            <>
              <${variants.icon} icon={Icon}>Icon button</${variants.icon}>
              <${variants.linkIcon} icon={Icon} href="/#">Icon link button</${variants.linkIcon}>
            </>
        );
        `,
    'should not import or replace anything if there are already new button variants',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { ${variants.link}, ${variants.default} } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (
    <div>
        <${variants.link} href='/#'>Link button</${variants.link}>
        <${variants.default}>Default button</${variants.default}>
    </div>
);`,
    `import { ${variants.link}, ${variants.default} } from '${NEW_BUTTON_ENTRY_POINT}';
const App = () => (
    <div>
        <${variants.link} href='/#'>Link button</${variants.link}>
        <${variants.default}>Default button</${variants.default}>
    </div>
);`,
    'should not import or replace anything if there is already a link button',
  );
});
