import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transformer from '../codemods/next-migrate-to-new-button-variants';
import { eslintDisableComment } from '../utils/constants';

describe('migrate-to-new-button-variants', () => {
  defineInlineTest(
    transformer,
    {},
    `import StandardButton from '@atlaskit/button/standard-button';
    const App = () => (<StandardButton href='/#'>Link button</StandardButton>);
    `,
    `import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
    const App = () => (<LinkButton href='/#'>Link button</LinkButton>);
    `,
    'should import and replace default standard button with new link button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/unsafe';
    const App = () => (<Button href='/#'>Link button</Button>);
    `,
    `import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
    const App = () => (<LinkButton href='/#'>Link button</LinkButton>);
    `,
    'should replace default new button with link button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon} />);
    `,
    `import { UNSAFE_LINK_ICON_BUTTON as LinkIconButton } from '@atlaskit/button/unsafe';
    const App = () => (<LinkIconButton href='/#' iconBefore={icon} />);
    `,
    'should replace default button with icon link button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button href='/#' iconBefore={icon}>Link button</Button>);
    `,
    `import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
    const App = () => (<LinkButton href='/#' iconBefore={icon}>Link button</LinkButton>);
    `,
    'should replace default button with link button if it has both href and icon prop',
  );

  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={MoreIcon} />);
    `,
    `import { UNSAFE_ICON_BUTTON as IconButton } from '@atlaskit/button/unsafe';
    const App = () => (<IconButton icon={MoreIcon} />);
    `,
    'should replace default button with icon button, rename the iconBefore prop',
  );

  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon />} />);
    `,
    `import { UNSAFE_ICON_BUTTON as IconButton } from '@atlaskit/button/unsafe';
    const App = () => (<IconButton icon={MoreIcon} />);
    `,
    'should replace default button with icon button, rename the iconBefore prop, and replace the JSX element with just identifier',
  );

  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />} />);
    `,
    `import { UNSAFE_ICON_BUTTON as IconButton } from '@atlaskit/button/unsafe';
    const App = () => (<IconButton icon={MoreIcon} label="more icon" UNSAFE_size="small" />);
    `,
    'should replace default button with icon button, rename the iconBefore prop, and move the props from the icon component to IconButton props',
  );

  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
    const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" />}>Button with icon before</Button>);
    `,
    `import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
    const App = () => (<Button iconBefore={MoreIcon} label="more icon" UNSAFE_size="small">Button with icon before</Button>);
    `,
    'should replace default button with new button, move the props from the icon component to Button props',
  );

  // TODO: uncomment this
  // defineInlineTest(
  //   transformer,
  //   {},
  //   `import Button from '@atlaskit/button/standard-button';
  //   const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" primaryColor="blue" />} />);
  //   `,
  //   `import { Button } from '@atlaskit/button/standard-button';
  //   const App = () => (<Button iconBefore={<MoreIcon label="more icon" size="small" primaryColor="blue" />} />);
  //   `,
  //   'should not migrate button if unsupported props applied in the icon component',
  // );

  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button iconBefore={icon} {...spreadProps} />);
        `,
    `import { UNSAFE_ICON_BUTTON as IconButton } from '@atlaskit/button/unsafe';
        const App = () => (<IconButton icon={icon} {...spreadProps} />);
        `,
    'should replace default button with icon button and keep the spread props',
  );
  defineInlineTest(
    transformer,
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
    `import { UNSAFE_LINK_BUTTON as LinkButton, UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
import ButtonGroup from '@atlaskit/button/button-group';
const App = () => (
    <div>
        <Button>Default button</Button>
        <Button {...props}>Default button with spread props</Button>
        <ButtonGroup>Button group</ButtonGroup>
        <LinkButton href='/#'>Link button</LinkButton>
    </div>
);`,
    'should replace default button with link button and import both default and link button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
const App = () => (<Button appearance="primary" isDisabled>Primary button</Button>);
`,
    `import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (<Button appearance="primary" isDisabled>Primary button</Button>);
`,
    'should replace old buttons with new button if other appearance values applied',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button component={Link} href="/#" />);
        `,
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button component={Link} href="/#" />);
        `,
    'should not replace the old buttons with a custom component overrides',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button css={buttonStyle} />);
        `,
    `import Button from '@atlaskit/button/standard-button';
        const App = () => (<Button css={buttonStyle} />);
        `,
    'should not replace the old buttons with a css prop',
  );
  defineInlineTest(
    transformer,
    {},
    `import { UNSAFE_ICON_BUTTON as IconButton, UNSAFE_LINK_ICON_BUTTON as LinkIconButton } from '@atlaskit/button/unsafe';
        const App = () => (
            <>
              <IconButton icon={Icon}>Icon button</IconButton>
              <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
            </>
        );
        `,
    `import { UNSAFE_ICON_BUTTON as IconButton, UNSAFE_LINK_ICON_BUTTON as LinkIconButton } from '@atlaskit/button/unsafe';
        const App = () => (
            <>
              <IconButton icon={Icon}>Icon button</IconButton>
              <LinkIconButton icon={Icon} href="/#">Icon link button</LinkIconButton>
            </>
        );
        `,
    'should not import or replace anything if there are already new button variants',
  );
  defineInlineTest(
    transformer,
    {},
    `import { UNSAFE_LINK_BUTTON as LinkButton, UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (
    <div>
        <LinkButton href='/#'>Link button</LinkButton>
        <Button>Default button</Button>
    </div>
);`,
    `import { UNSAFE_LINK_BUTTON as LinkButton, UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (
    <div>
        <LinkButton href='/#'>Link button</LinkButton>
        <Button>Default button</Button>
    </div>
);`,
    'should not import or replace anything if there is already a link button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button/standard-button';
        render(Button);
        `,
    `import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
        render(Button);
        `,
    'should only replace the import if the button is used in a call expression',
  );
  defineInlineTest(
    transformer,
    { allowUnsafeImport: true },
    `import Button from '@atlaskit/button/standard-button';
const App = () => (<Button>Button</Button>);
`,
    `// ${eslintDisableComment}
import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (<Button>Button</Button>);
`,
    'should add eslint-disable if allow unsafe import is provided in options',
  );
  defineInlineTest(
    transformer,
    { allowUnsafeImport: true },
    `// ${eslintDisableComment}
import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (<Button>Button</Button>);
`,
    `// ${eslintDisableComment}
import { UNSAFE_BUTTON as Button } from '@atlaskit/button/unsafe';
const App = () => (<Button>Button</Button>);
`,
    'should not add eslint-disable if it is already there',
  );
});
