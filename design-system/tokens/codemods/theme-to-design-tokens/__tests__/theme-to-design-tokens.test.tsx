jest.autoMockOff();

import jscodeshift from 'jscodeshift';

import codemod from '../transform';

/* eslint-disable no-console */
export async function withMockedConsoleWarn(fn: any) {
  const originalWarn = console.warn;
  const warn = jest.fn();
  console.warn = warn;

  await fn(warn);

  console.warn = originalWarn;
}
/* eslint-enable no-console */

interface Options {
  parser: string;
}

async function applyTransform(
  transform: any,
  input: string,
  options: Options = {
    parser: 'tsx',
  },
) {
  const transformer = transform.default ? transform.default : transform;
  const output = await transformer(
    { source: input },
    { jscodeshift: jscodeshift.withParser(options.parser) },
  );

  return (output || '').trim();
}

describe('theme-to-design-tokens', () => {
  it('should ignore colors already wrapped in a token (object styles)', async () => {
    const result = await applyTransform(
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

  it('should ignore colors already wrapped in a token (template literals)', async () => {
    const result = await applyTransform(
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

  it('should ignore colors already wrapped in a token (JSX Attributes)', async () => {
    const result = await applyTransform(
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

  it('should transform legacy tokens', async () => {
    const result = await applyTransform(
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

  it('should not transform non color css properties', async () => {
    const result = await applyTransform(codemod, `css({ gap: '2px', });`);

    expect(result).toMatchInlineSnapshot(`"css({ gap: '2px', });"`);
  });

  it('should transform hard-coded tokens', async () => {
    const result = await applyTransform(
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

  it('should transform legacy tokens from default import', async () => {
    const result = await applyTransform(
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

  it('should transform typical surface/text colors', async () => {
    const result = await applyTransform(
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

  it('should transform box shadow in template literals', async () => {
    const result = await applyTransform(
      codemod,
      `
export const EnvironmentWrapper = styled.div\`
  box-shadow: 0 0 1px \${colors.N60A};
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      export const EnvironmentWrapper = styled.div\`
        box-shadow: \${token(\\"elevation.shadow.raised\\", \`0 0 1px \${colors.N60A}\`)};
      \`;"
    `);
  });

  it('should transform comma-separated box shadow with a single replaceable color', async () => {
    const result = await applyTransform(
      codemod,
      `
export const EnvironmentWrapper = styled.div\`
  box-shadow: 0 0 1px \${colors.N60A},
              2px 2px 1rem black;
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      export const EnvironmentWrapper = styled.div\`
        box-shadow: \${token(\\"elevation.shadow.raised\\", \`0 0 1px \${colors.N60A},
                    2px 2px 1rem black\`)};
      \`;"
    `);
  });

  it('should warn about comma-separated box shadow when two colors are expressions', async () => {
    await withMockedConsoleWarn(async (warn: any) => {
      const result = await applyTransform(
        codemod,
        `
export const EnvironmentWrapper = styled.div\`
  box-shadow: 0 0 1px \${colors.N60A},
              2px 2px 1rem \${colors.N70A};
\`;
`,
      );

      expect(result).toMatchInlineSnapshot(`
              "export const EnvironmentWrapper = styled.div\`
                box-shadow: 0 0 1px \${colors.N60A},
                            2px 2px 1rem \${colors.N70A};
              \`;"
          `);

      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  it('should not apply text tokens to background', async () => {
    const result = await applyTransform(
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

  it('should transform static colors in css properties', async () => {
    const result = await applyTransform(
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

  it('should skip non-colors in properties', async () => {
    const result = await applyTransform(
      codemod,
      `
series.push({
    name: "Processing time (ms)",
});`,
    );
    expect(result).toMatchInlineSnapshot(`
      "series.push({
          name: \\"Processing time (ms)\\",
      });"
    `);
  });

  it('should transform static colors in styled.div template literals', async () => {
    const result = await applyTransform(
      codemod,
      `
const SomeWrapper = styled.div\`
  outline: 3px dashed #eee;
  background-color: #fafafa;
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
          "const SomeWrapper = styled.div\`
            outline: 3px dashed var(--ds-surface-sunken, #eee);
            background-color: var(--ds-background-input, #fafafa);
          \`;"
        `);
  });

  it('should transform box-shadow in styled.div template literals', async () => {
    const result = await applyTransform(
      codemod,
      `
export const LoginPaper = styled.div\`
  box-shadow: #dcdcdc 0 0 10px;
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
      "export const LoginPaper = styled.div\`
        box-shadow: var(--ds-shadow-raised, #dcdcdc 0 0 10px);
      \`;"
    `);
  });

  it('should transform static colors in plain template literals', async () => {
    const result = await applyTransform(
      codemod,
      `
const StringValue = \`
  background-color: #172B4D;
  color: #ffffff;
\`;
`,
    );

    expect(result).toMatchInlineSnapshot(`
          "const StringValue = \`
            background-color: var(--ds-background-input, #172B4D);
            color: var(--ds-surface, #ffffff);
          \`;"
        `);
  });

  it('should transform static colors in constant declarations', async () => {
    const result = await applyTransform(
      codemod,
      `
const FONT_COLOR = \`#172B4D\`;
const BG_COLOR = \"#FAFAFA\";
const DARK_PURPLE = '#5243AA';
      `,
    );

    const expected = `import { token } from "@atlaskit/tokens";
const FONT_COLOR = token("color.text", \`#172B4D\`);
const BG_COLOR = token("color.text", "#FAFAFA");
const DARK_PURPLE = token("color.text.accent.purple", '#5243AA');`;

    expect(result).toEqual(expected);
  });

  it('should skip non-colors in expressions', async () => {
    const result = await applyTransform(
      codemod,
      `
function getLink(start, limit) {
    return "#start=" + start + "&limit=" + limit
}
      `,
    );

    const expected = `function getLink(start, limit) {
    return "#start=" + start + "&limit=" + limit
}`;
    expect(result).toEqual(expected);
  });

  it('should not transform static colors in constant declarations already transformed', async () => {
    const result = await applyTransform(
      codemod,
      `
import { token } from "@atlaskit/tokens";
const FONT_COLOR = token("color.text", "#172B4D");
const BG_COLOR = token("color.text", "#FAFAFA");
const DARK_PURPLE = token("color.text.accent.purple", '#5243AA');
      `,
    );

    const expected = `import { token } from "@atlaskit/tokens";
const FONT_COLOR = token("color.text", "#172B4D");
const BG_COLOR = token("color.text", "#FAFAFA");
const DARK_PURPLE = token("color.text.accent.purple", '#5243AA');`;

    expect(result).toEqual(expected);
  });

  it('should transform nested style blocks', async () => {
    const result = await applyTransform(
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

  it('should transform nested style objects', async () => {
    const result = await applyTransform(
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

  it('should transform abstract objects', async () => {
    const result = await applyTransform(
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

  it('should transform deep abstract objects', async () => {
    const result = await applyTransform(
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

  it('should not object keys with legacy named colors', async () => {
    const result = await applyTransform(
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

  it('should transform tokens via css prop', async () => {
    const result = await applyTransform(
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

  it('should transform tokens via css prop and object styles', async () => {
    const result = await applyTransform(
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

  it('should transform colors used in template literals', async () => {
    const result = await applyTransform(
      codemod,
      `
import { B500, N500 } from '@atlaskit/theme/colors';

const Button = styled.button\`
  color: \${B500};
  background-color: \${N500};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      import { B500, N500 } from '@atlaskit/theme/colors';

      const Button = styled.button\`
        color: \${token(\\"color.text.information\\", B500)};
        background-color: \${token(\\"color.background.neutral.bold\\", N500)};
      \`;"
    `);
  });

  it('should correctly handle mixed identifiers and color expressions in template literals', async () => {
    // This is a contrived example, because usually people don't mix both forms
    // in a single template, but it can happen with other expressions than
    // colors, so this serves as a nice minimal example for the intended
    // behavior.
    const result = await applyTransform(
      codemod,
      `
const Button = styled.button\`
  color: \${B500};
  background-color: \${colors.N500};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      const Button = styled.button\`
        color: \${token(\\"color.text.information\\", B500)};
        background-color: \${token(\\"color.background.neutral.bold\\", colors.N500)};
      \`;"
    `);
  });

  it('should skip over non-color expressions in template literals', async () => {
    // It's a more realistic example of the same behavior as tested in the
    // previous test.
    const result = await applyTransform(
      codemod,
      `
export const MessageContainer = styled.section\`
    background-color: \${colors.N0};
    border-radius: \${borderRadius}px;
    color: \${colors.N500};
    padding: \${gridSize() * 2}px;
    margin: \${gridSize() / 2}px 1px;
    \${elevation.e100};
\`;`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      export const MessageContainer = styled.section\`
          background-color: \${token(\\"elevation.surface\\", colors.N0)};
          border-radius: \${borderRadius}px;
          color: \${token(\\"color.text.subtle\\", colors.N500)};
          padding: \${gridSize() * 2}px;
          margin: \${gridSize() / 2}px 1px;
          \${elevation.e100};
      \`;"
    `);
  });

  it('should replace template literals that have hard-coded colors and arbitrary expressions', async () => {
    const result = await applyTransform(
      codemod,
      `
const size = {
    mobileMin: '320px',
    mobileMax: '767px',
};
export const device = {
    mobile: \`(min-width: \${size.mobileMin}) and (max-width: \${size.mobileMax})\`,
};
    const ButtonContainer = styled.div\`
        @media \${device.mobile} {
            z-index: 2;
            background-color: #fff;
            box-shadow: 0px -5px 7px -1px rgba(39, 37, 40, 0.16);
        }
    \`;
`,
    );
    expect(result).toMatchInlineSnapshot(`
      "const size = {
          mobileMin: '320px',
          mobileMax: '767px',
      };
      export const device = {
          mobile: \`(min-width: \${size.mobileMin}) and (max-width: \${size.mobileMax})\`,
      };
          const ButtonContainer = styled.div\`
              @media \${device.mobile} {
                  z-index: 2;
                  background-color: var(--ds-surface, #fff);
                  box-shadow: var(--ds-shadow-raised, 0px -5px 7px -1px rgba(39, 37, 40, 0.16));
              }
          \`;"
    `);
  });

  it('should transform colors used as props', async () => {
    const result = await applyTransform(
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

  it('should transform disable styles object', async () => {
    const result = await applyTransform(
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

  it('should transform styled bold brand', async () => {
    const result = await applyTransform(
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

  it('should transform colors using property context (low-accuracy)', async () => {
    const result = await applyTransform(
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

  it('should transform border properties', async () => {
    const result = await applyTransform(
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

  it('should correctly transform icon colors (error)', async () => {
    const result = await applyTransform(
      codemod,
      `<ErrorIcon primaryColor={colors.R400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <ErrorIcon primaryColor={token(\\"color.icon.danger\\", colors.R400)} />"
    `);
  });

  it('should correctly transform icon colors (success)', async () => {
    const result = await applyTransform(
      codemod,
      `<TickIcon primaryColor={colors.G400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <TickIcon primaryColor={token(\\"color.icon.success\\", colors.G400)} />"
    `);
  });

  it('should correctly transform icon colors (warning)', async () => {
    const result = await applyTransform(
      codemod,
      `<WarningIcon primaryColor={colors.Y400} />`,
    );

    expect(result).toMatchInlineSnapshot(`
      "import { token } from \\"@atlaskit/tokens\\";
      <WarningIcon primaryColor={token(\\"color.icon.warning\\", colors.Y400)} />"
    `);
  });

  it('should correctly transform icon colors (error)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform icon colors (success)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform icon colors (warning)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform icon colors (warning)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform text colors (subtlest)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform text colors (subtle)', async () => {
    const result = await applyTransform(
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

  it('should correctly transform text colors (default)', async () => {
    const result = await applyTransform(
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

  it('should not transform default argument objects', async () => {
    const result = await applyTransform(
      codemod,
      `const Tag = ({ text: text, testId = TAG_TYPE_TEST_ID }) => null`,
    );

    expect(result).toMatchInlineSnapshot(
      `"const Tag = ({ text: text, testId = TAG_TYPE_TEST_ID }) => null"`,
    );
  });

  it('should not transform default argument objects', async () => {
    const result = await applyTransform(
      codemod,
      `function Tags ({ text: text, testId = TAG_TYPE_TEST_ID }) {}`,
    );

    expect(result).toMatchInlineSnapshot(
      `"function Tags ({ text: text, testId = TAG_TYPE_TEST_ID }) {}"`,
    );
  });
});
