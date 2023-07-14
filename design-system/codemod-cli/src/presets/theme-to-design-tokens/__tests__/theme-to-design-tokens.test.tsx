jest.autoMockOff();

import jscodeshift from 'jscodeshift';

import codemod from '../theme-to-design-tokens';

interface Options {
  parser: string;
}

function applyTransform(
  transform: any,
  input: string,
  options: Options = {
    parser: 'tsx',
  },
) {
  const transformer = transform.default ? transform.default : transform;
  const output = transformer(
    { source: input },
    { jscodeshift: jscodeshift.withParser(options.parser) },
  );

  return (output || '').trim();
}

describe('theme-to-design-tokens', () => {
  it('should ignore colors already wrapped in a token (object styles)', () => {
    const result = applyTransform(
      codemod,
      `
import { token } from "@atlaskit/tokens";
import { B500, N500 } from '@atlaskit/theme/colors';

css({
  color: token("color.text.selected", B500),
  backgroundColor: token("color.background.card", N500),
  border: N500,
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      css({
        color: token(\\"color.text.selected\\", B500),
        backgroundColor: token(\\"color.background.card\\", N500),
        border: token(\\"color.border\\", N500),
      });"
    `);
  });

  it('should ignore colors already wrapped in a token (template literals)', () => {
    const result = applyTransform(
      codemod,
      `
import { token } from \"@atlaskit/tokens";
const DragHandle = styled.div\`
  background: \${token("surface.raised", colors.N20)};
  color: \${token("color.text.subtlest", colors.N80)};
  border: \${colors.N80};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const DragHandle = styled.div\`
        background: \${token(\\"surface.raised\\", colors.N20)};
        color: \${token(\\"color.text.subtlest\\", colors.N80)};
        border: \${token(\\"color.border\\", colors.N80)};
      \`;"
    `);
  });

  it('should ignore colors already wrapped in a token (JSX Attributes)', () => {
    const result = applyTransform(
      codemod,
      `
import { token } from "@atlaskit/tokens";
import { Y400 } from '@atlaskit/theme/colors';
<WarningIcon
  primaryColor={token("color.icon.warning", Y400)}
  secondaryColor={Y400}
/>
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { Y400 } from '@atlaskit/theme/colors';
      <WarningIcon
        primaryColor={token(\\"color.icon.warning\\", Y400)}
        secondaryColor={token(\\"color.icon.warning\\", Y400)}
      />"
    `);
  });

  it('should transform legacy tokens', () => {
    const result = applyTransform(
      codemod,
      `
import { B500, N500 } from '@atlaskit/theme/colors';

css({
  color: B500,
  backgroundColor: N500,
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      css({
        color: token(\\"color.text.information\\", B500),
        backgroundColor: token(\\"color.background.neutral.bold\\", N500),
      });"
    `);
  });

  it('should not transform non color css properties', () => {
    const result = applyTransform(codemod, `css({ gap: '2px', });`);

    expect(result).toMatchInlineSnapshot(`"css({ gap: '2px', });"`);
  });

  it('should transform hard-coded tokens', () => {
    const result = applyTransform(
      codemod,
      `
css({
  color: '#eee',
  backgroundColor: 'lightblue',
  borderColor: '#FF0000',
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      css({
        color: token(\\"color.text\\", '#eee'),
        backgroundColor: token(\\"color.background.input\\", 'lightblue'),
        borderColor: token(\\"color.border\\", '#FF0000'),
      });"
    `);
  });

  it('should transform legacy tokens from default import', () => {
    const result = applyTransform(
      codemod,
      `
import colors from '@atlaskit/theme/colors';
css({
  color: colors.B500,
  backgroundColor: colors.N500,
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import colors from '@atlaskit/theme/colors';
      css({
        color: token(\\"color.text.information\\", colors.B500),
        backgroundColor: token(\\"color.background.neutral.bold\\", colors.N500),
      });"
    `);
  });

  it('should transform typical surface/text colors', () => {
    const result = applyTransform(
      codemod,
      `
const DragHandle = styled.div\`
  background: \${colors.N20};
  color: \${colors.N80};
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const DragHandle = styled.div\`
        background: \${token(\\"elevation.surface.overlay\\", colors.N20)};
        color: \${token(\\"color.text.subtlest\\", colors.N80)};
      \`;"
    `);
  });

  it('should transform box shadow', () => {
    const result = applyTransform(
      codemod,
      `
export const EnvironmentWrapper = styled.div\`
  box-shadow: 0 0 1px \${colors.N60A};
\`;
`,
    );

    /**
     * Assertion is technically wrong since the shadow token should replace the entire property
     * ie box-shadow: ${token("elevation.shadow.overflow", `0 0 1px ${colors.N60A}`)};
     *
     * Leaving as is for now since this is quite hard to implement reliably
     */
    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      export const EnvironmentWrapper = styled.div\`
        box-shadow: 0 0 1px \${token(\\"elevation.shadow.raised\\", colors.N60A)};
      \`;"
    `);
  });

  it('should not apply text tokens to background', () => {
    const result = applyTransform(
      codemod,
      `
const EnvironmentWrapper = styled.div\`
  background: \${colors.N0};
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const EnvironmentWrapper = styled.div\`
        background: \${token(\\"elevation.surface\\", colors.N0)};
      \`;"
    `);
  });

  it('should transform static colors', () => {
    const result = applyTransform(
      codemod,
      `
import colors from '@atlaskit/theme/colors';
css({
  color: '#eeeeee',
  backgroundColor: 'red',
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import colors from '@atlaskit/theme/colors';
      css({
        color: token(\\"color.text\\", '#eeeeee'),
        backgroundColor: token(\\"color.background.danger\\", 'red'),
      });"
    `);
  });

  it('should transform nested style blocks', () => {
    const result = applyTransform(
      codemod,
      `
const dangerButton = css({
  color: '#eeeeee',
  backgroundColor: '#000000',
  ':hover': {
    color: '#eeeaaa',
    backgroundColor: '#000eee'
  },
  ':active': {
    color: '#eeeaaa',
    backgroundColor: '#000eee'
  },
  ':focus': {
    color: '#eeeaaa',
    backgroundColor: '#000eee'
  }
});`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const dangerButton = css({
        color: token(\\"color.text.danger\\", '#eeeeee'),
        backgroundColor: token(\\"color.background.danger\\", '#000000'),
        ':hover': {
          color: token(\\"color.text.danger\\", '#eeeaaa'),
          backgroundColor: token(\\"color.background.danger.hovered\\", '#000eee')
        },
        ':active': {
          color: token(\\"color.text.danger\\", '#eeeaaa'),
          backgroundColor: token(\\"color.background.danger.pressed\\", '#000eee')
        },
        ':focus': {
          color: token(\\"color.text.danger\\", '#eeeaaa'),
          backgroundColor: token(\\"color.background.danger\\", '#000eee')
        }
      });"
    `);
  });

  it('should transform nested style objects', () => {
    const result = applyTransform(
      codemod,
      `
import { B100, B300, B400, B50, N10, N20, N30, N40, N70, R300 } from '@atlaskit/theme/colors';
const themeColors = {
  borderColor: {
    rest: N40,
    disabled: N20,
    checked: B400,
    active: B50,
    invalid: R300,
    invalidAndChecked: R300,
    focused: B100,
    hovered: N40,
    hoveredAndChecked: B300,
  },
  boxColor: {
    rest: N10,
    disabled: N20,
    active: B50,
    hoveredAndChecked: B300,
    hovered: N30,
    checked: B400,
  },
  tickIconColor: {
    disabledAndChecked: N70,
    activeAndChecked: B400,
    checked: N10,
  },
};`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B100, B300, B400, B50, N10, N20, N30, N40, N70, R300 } from '@atlaskit/theme/colors';
      const themeColors = {
        borderColor: {
          rest: token(\\"color.border\\", N40),
          disabled: token(\\"color.border.disabled\\", N20),
          checked: token(\\"color.border.information\\", B400),
          active: token(\\"color.border.information\\", B50),
          invalid: token(\\"color.border.danger\\", R300),
          invalidAndChecked: token(\\"color.border.danger\\", R300),
          focused: token(\\"color.border.information\\", B100),
          hovered: token(\\"color.border\\", N40),
          hoveredAndChecked: token(\\"color.border.information\\", B300),
        },
        boxColor: {
          rest: token(\\"color.text\\", N10),
          disabled: token(\\"color.text.disabled\\", N20),
          active: token(\\"color.background.information.pressed\\", B50),
          hoveredAndChecked: token(\\"color.text.information\\", B300),
          hovered: token(\\"color.text\\", N30),
          checked: token(\\"color.text.information\\", B400),
        },
        tickIconColor: {
          disabledAndChecked: token(\\"color.icon.disabled\\", N70),
          activeAndChecked: token(\\"color.icon.information\\", B400),
          checked: token(\\"color.icon\\", N10),
        },
      };"
    `);
  });

  it('should transform abstract objects', () => {
    const result = applyTransform(
      codemod,
      `
import { G400, G300, N20 } from '@atlaskit/theme/colors';
import { colors } from '@atlaskit/theme';
const colorMap = {
  light: {
    backgroundColorChecked: G400,
    backgroundColorCheckedHover: G300,
    backgroundColorCheckedPressed: colors.G500,
    backgroundColorCheckedDisabled: N20,
  }
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { G400, G300, N20 } from '@atlaskit/theme/colors';
      import { colors } from '@atlaskit/theme';
      const colorMap = {
        light: {
          backgroundColorChecked: token(\\"color.background.success\\", G400),
          backgroundColorCheckedHover: token(\\"color.background.success.hovered\\", G300),
          backgroundColorCheckedPressed: token(\\"color.background.success.pressed\\", colors.G500),
          backgroundColorCheckedDisabled: token(\\"color.background.disabled\\", N20),
        }
      }"
    `);
  });

  it('should transform deep abstract objects', () => {
    const result = applyTransform(
      codemod,
      `
import { G400, G300, N20 } from '@atlaskit/theme/colors';
const colorMap = {
  light: {
    background: {
      color: {
        checked: {
          resting: G400,
          hover: G300,
          disabled: N20,
        }
      }
    }
  }
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { G400, G300, N20 } from '@atlaskit/theme/colors';
      const colorMap = {
        light: {
          background: {
            color: {
              checked: {
                resting: token(\\"color.background.success\\", G400),
                hover: token(\\"color.background.success.hovered\\", G300),
                disabled: token(\\"color.background.disabled\\", N20),
              }
            }
          }
        }
      }"
    `);
  });

  it('should not object keys with legacy named colors', () => {
    const result = applyTransform(
      codemod,
      `
import { background, subtleText, primary } from '@atlaskit/theme/colors';
const colorMap = {
  background: background,
  subtleText: subtleText,
  primary,
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { background, subtleText, primary } from '@atlaskit/theme/colors';
      const colorMap = {
        background: token(\\"color.background.input\\", background),
        subtleText: token(\\"color.text.subtlest\\", subtleText),
        primary: token(\\"color.text.brand\\", primary),
      }"
    `);
  });

  it('should transform tokens via css prop', () => {
    const result = applyTransform(
      codemod,
      `
import { B500, N500 } from '@atlaskit/theme/colors';

const Button = () => (
  <button css={
    css({
      color: B500,
      backgroundColor: N500,
    })
  }>Submit</button>
)`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      const Button = () => (
        <button css={
          css({
            color: token(\\"color.text.information\\", B500),
            backgroundColor: token(\\"color.background.neutral.bold\\", N500),
          })
        }>Submit</button>
      )"
    `);
  });

  it('should transform tokens via css prop and object styles', () => {
    const result = applyTransform(
      codemod,
      `
import { B500, N500 } from '@atlaskit/theme/colors';

const Button = () => (
  <button css={{
    color: B500,
    backgroundColor: N500,
  }}>Submit</button>
)`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      const Button = () => (
        <button css={{
          color: token(\\"color.text.information\\", B500),
          backgroundColor: token(\\"color.background.neutral.bold\\", N500),
        }}>Submit</button>
      )"
    `);
  });

  it('should transform colors used in template literals', () => {
    const result = applyTransform(
      codemod,
      `
import { B500, N500 } from '@atlaskit/theme/colors';

const Button = styled.button\`
  color: \${B500};
  backgroundColor: \${N500};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      const Button = styled.button\`
        color: \${token(\\"color.text.information\\", B500)};
        backgroundColor: \${token(\\"color.background.neutral.bold\\", N500)};
      \`;"
    `);
  });

  it('should transform colors used as props', () => {
    const result = applyTransform(
      codemod,
      `
import React from 'react';
import { R400 } from '@atlaskit/theme/colors';

const PresenceWrapper = () => (
  <Presence borderColor={R400} />
);`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import React from 'react';
      import { R400 } from '@atlaskit/theme/colors';

      const PresenceWrapper = () => (
        <Presence borderColor={token(\\"color.border.danger\\", R400)} />
      );"
    `);
  });

  it('should transform disable styles object', () => {
    const result = applyTransform(
      codemod,
      `
import React from 'react';
import { N40 } from '@atlaskit/theme/colors';

const disabledStyles = css({
  background: N40,
});
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import React from 'react';
      import { N40 } from '@atlaskit/theme/colors';

      const disabledStyles = css({
        background: token(\\"color.background.disabled\\", N40),
      });"
    `);
  });

  it('should transform styled bold brand', () => {
    const result = applyTransform(
      codemod,
      `
import React from 'react';
import { B400, B300, B500 } from '@atlaskit/theme/colors';

styled.div\`
  background-color: \${B400};

  :hover {
    background-color: \${B300};
  }

  :active {
    background: \${B500};
  }
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import React from 'react';
      import { B400, B300, B500 } from '@atlaskit/theme/colors';

      styled.div\`
        background-color: \${token(\\"color.background.information.bold\\", B400)};

        :hover {
          background-color: \${token(\\"color.background.information.bold.hovered\\", B300)};
        }

        :active {
          background: \${token(\\"color.background.information.bold.pressed\\", B500)};
        }
      \`;"
    `);
  });

  it('should transform colors using property context (low-accuracy)', () => {
    const result = applyTransform(
      codemod,
      `
import { B50, R400 } from '@atlaskit/theme/colors';

const cols = {
  1: 'green',
  2: R400,
  3: B50,
};`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B50, R400 } from '@atlaskit/theme/colors';

      const cols = {
        1: token(\\"color.text.accent.green\\", 'green'),
        2: token(\\"color.background.danger.bold\\", R400),
        3: token(\\"color.text.information\\", B50),
      };"
    `);
  });

  it('should transform border properties', () => {
    const result = applyTransform(
      codemod,
      `
import colors from '@atlaskit/theme/colors';

const Wrapper = styled.div\`
    border-top: 1px solid \${colors.N300A};
    border-bottom: 1px solid \${colors.N300A};
\``,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import colors from '@atlaskit/theme/colors';

      const Wrapper = styled.div\`
          border-top: 1px solid \${token(\\"color.border\\", colors.N300A)};
          border-bottom: 1px solid \${token(\\"color.border\\", colors.N300A)};
      \`"
    `);
  });

  it('should correctly transform icon colors (error)', () => {
    const result = applyTransform(
      codemod,
      `<ErrorIcon primaryColor={colors.R400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <ErrorIcon primaryColor={token(\\"color.icon.danger\\", colors.R400)} />"
    `);
  });

  it('should correctly transform icon colors (success)', () => {
    const result = applyTransform(
      codemod,
      `<TickIcon primaryColor={colors.G400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <TickIcon primaryColor={token(\\"color.icon.success\\", colors.G400)} />"
    `);
  });

  it('should correctly transform icon colors (warning)', () => {
    const result = applyTransform(
      codemod,
      `<WarningIcon primaryColor={colors.Y400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <WarningIcon primaryColor={token(\\"color.icon.warning\\", colors.Y400)} />"
    `);
  });

  it('should correctly transform icon colors (error)', () => {
    const result = applyTransform(
      codemod,
      `
import { R400 } from '@atlaskit/theme/colors';

<ErrorIcon primaryColor={R400} />
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { R400 } from '@atlaskit/theme/colors';

      <ErrorIcon primaryColor={token(\\"color.icon.danger\\", R400)} />"
    `);
  });

  it('should correctly transform icon colors (success)', () => {
    const result = applyTransform(
      codemod,
      `
import { G400 } from '@atlaskit/theme/colors';
<TickIcon primaryColor={G400} />
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { G400 } from '@atlaskit/theme/colors';
      <TickIcon primaryColor={token(\\"color.icon.success\\", G400)} />"
    `);
  });

  it('should correctly transform icon colors (warning)', () => {
    const result = applyTransform(
      codemod,
      `
import { Y400 } from '@atlaskit/theme/colors';
<WarningIcon primaryColor={Y400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { Y400 } from '@atlaskit/theme/colors';
      <WarningIcon primaryColor={token(\\"color.icon.warning\\", Y400)} />"
    `);
  });

  it('should correctly transform icon colors (warning)', () => {
    const result = applyTransform(
      codemod,
      `
import { Y400 } from '@atlaskit/theme/colors';
<WarningIcon primaryColor={Y400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { Y400 } from '@atlaskit/theme/colors';
      <WarningIcon primaryColor={token(\\"color.icon.warning\\", Y400)} />"
    `);
  });

  it('should correctly transform text colors (subtlest)', () => {
    const result = applyTransform(
      codemod,
      `
const Example = styled.strong\`
  color: \${colors.N300};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const Example = styled.strong\`
        color: \${token(\\"color.text.subtlest\\", colors.N300)};
      \`;"
    `);
  });

  it('should correctly transform text colors (subtle)', () => {
    const result = applyTransform(
      codemod,
      `
const Example = styled.strong\`
  color: \${colors.N500};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const Example = styled.strong\`
        color: \${token(\\"color.text.subtle\\", colors.N500)};
      \`;"
    `);
  });

  it('should correctly transform text colors (default)', () => {
    const result = applyTransform(
      codemod,
      `
const Example = styled.strong\`
  color: \${colors.N800};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const Example = styled.strong\`
        color: \${token(\\"color.text\\", colors.N800)};
      \`;"
    `);
  });

  it('should not transform default argument objects', () => {
    const result = applyTransform(
      codemod,
      `const Tag = ({ text: text, testId = TAG_TYPE_TEST_ID }) => null`,
    );

    expect(result).toMatchInlineSnapshot(
      `"const Tag = ({ text: text, testId = TAG_TYPE_TEST_ID }) => null"`,
    );
  });

  it('should not transform default argument objects', () => {
    const result = applyTransform(
      codemod,
      `function Tags ({ text: text, testId = TAG_TYPE_TEST_ID }) {}`,
    );

    expect(result).toMatchInlineSnapshot(
      `"function Tags ({ text: text, testId = TAG_TYPE_TEST_ID }) {}"`,
    );
  });
});
