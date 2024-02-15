import { Parser } from 'jscodeshift';

import __noop from '@atlaskit/ds-lib/noop';

import transformer from '../transform';

/* eslint-disable no-console */
export async function withMockedConsoleWarn(fn: any) {
  const originalWarn = console.warn;
  const warn = jest.fn();
  console.warn = warn;

  await fn(warn);

  console.warn = originalWarn;
}
/* eslint-enable no-console */

async function applyTransform(
  transform: any,
  input: string,
  options: {
    parser: string | Parser;
  } = {
    parser: 'babel',
  },
) {
  // Handle ES6 modules using default export for the transform
  const transformer = transform.default ? transform.default : transform;
  const output = await transformer(
    { source: input },
    {
      jscodeshift: __noop,
      stats: __noop,
    },
    options || {},
  );

  return (output || '').trim();
}

describe('PostCSS Transform', () => {
  it(`standard CSS`, async () => {
    const input = `
.normal {
  color: #eeeeee;
}
.normal-selected {
  color: #eeeeee;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface-sunken, #eeeeee);
      }
      .normal-selected {
        color: var(--ds-surface-sunken, #eeeeee);
      }"
    `);
  });

  it(`standard LESS`, async () => {
    const input = `
.container {
    .mixin-1();
    .mixin-2;
    .mixin-3 (@width: 100px) {
        color: #eeeeee;
    }
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".container {
          .mixin-1();
          .mixin-2;
          .mixin-3 (@width: 100px) {
              color: var(--ds-surface-sunken, #eeeeee);
          }
      }"
    `);
  });

  it(`box-shadows`, async () => {
    const input = `.container { box-shadow: 0px 1px 5px 0px var(--adg3-color-N40); }`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(
      `".container { box-shadow: var(MISSING_TOKEN, 0px 1px 5px 0px var(--adg3-color-N40)); }"`,
    );
  });

  it(`should not transform value with 'url()'`, async () => {
    const input = `.user-time-icon { background: url(@spriteUrl) no-repeat; }`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(
      `".user-time-icon { background: url(@spriteUrl) no-repeat; }"`,
    );
  });

  it(`should not transform value with less functions`, async () => {
    await withMockedConsoleWarn(async (warn: any) => {
      const input = `.user-time-icon { background: lighten(@spriteUrl) no-repeat; }`;
      const result = await applyTransform(transformer, input);
      expect(result).toMatchInlineSnapshot(
        `".user-time-icon { background: lighten(@spriteUrl) no-repeat; }"`,
      );
      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  it(`should not transform box-shadow: none`, async () => {
    const input = `.container { box-shadow: none; }`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`".container { box-shadow: none; }"`);
  });

  it(`should not transform border radius`, async () => {
    const input = `.container { border-radius: 3px; }`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(
      `".container { border-radius: 3px; }"`,
    );
  });

  it(`chained selectors`, async () => {
    const input = `
h1,h2,h3 {
  color: #eeeeee;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      "h1,h2,h3 {
        color: var(--ds-surface-sunken, #eeeeee);
      }"
    `);
  });

  it(`does not transform CSS var declarations`, async () => {
    const input = `--adg3-color-R50: #ffebe6;`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`"--adg3-color-R50: #ffebe6;"`);
  });

  it(`standard CSS with ADG3 variables`, async () => {
    const input = `
.normal {
  color: var(--adg3-color-N800);
  color: var(--adg3-color-T400);
  color: var(--adg3-color-B400);
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-text, var(--adg3-color-N800));
        color: var(--ds-text-accent-teal, var(--adg3-color-T400));
        color: var(--ds-text-brand, var(--adg3-color-B400));
      }"
    `);
  });

  it(`deeply nested CSS`, async () => {
    const input = `
.normal {
  color: #eeeeee;
  .deep {
    color: #eeeeee;
    .deeper {
      color: #eeeeee;
    }
  }
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface-sunken, #eeeeee);
        .deep {
          color: var(--ds-surface-sunken, #eeeeee);
          .deeper {
            color: var(--ds-surface-sunken, #eeeeee);
          }
        }
      }"
    `);
  });

  it(`interaction states CSS`, async () => {
    const input = `
.normal {
  color: #eeeeee;
}
.normal:hover {
  color: #eeeeee;
}
.normal:active {
  color: #eeeeee;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface-sunken, #eeeeee);
      }
      .normal:hover {
        color: var(--ds-surface-sunken, #eeeeee);
      }
      .normal:active {
        color: var(--ds-surface-sunken, #eeeeee);
      }"
    `);
  });

  it(`nested interaction states CSS`, async () => {
    const input = `
.normal {
  color: #eeeeee;
  &:hover {
    color: #eeeeee;
  }
  &:active {
    color: #eeeeee;
  }
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface-sunken, #eeeeee);
        &:hover {
          color: var(--ds-surface-sunken, #eeeeee);
        }
        &:active {
          color: var(--ds-surface-sunken, #eeeeee);
        }
      }"
    `);
  });

  it(`nested CSS`, async () => {
    const input = `
.normal {
    color: #000000;
    width: var(--gutter-size);
    .nested {
        color: #000000;
    }
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
          color: var(--ds-text, #000000);
          width: var(--gutter-size);
          .nested {
              color: var(--ds-text, #000000);
          }
      }"
    `);
  });

  it(`avoids already converted colors`, async () => {
    const input = `
.normal {
    color: var(--ds-text, #000000);
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
          color: var(--ds-text, #000000);
      }"
    `);
  });

  it(`aliased adg-3 colors`, async () => {
    const input = `
.container {
  box-shadow: 0px 1px 5px 0px var(--adg3-color-N40);
  border: 1px solid var(--adg3-color-N40);
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".container {
        box-shadow: var(MISSING_TOKEN, 0px 1px 5px 0px var(--adg3-color-N40));
        border: 1px solid var(--ds-border, var(--adg3-color-N40));
      }"
    `);
  });

  it(`should transform border properties`, async () => {
    const input = `
.normal {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
          border-top: 1px solid var(--ds-surface-sunken, #eee);
          border-bottom: 1px solid var(--ds-surface-sunken, #eee);
      }"
    `);
  });

  it(`named colors`, async () => {
    const input = `
.normal {
  color: red;
  color: crimson;
  color: cyan;
  color: darkblue;
  color: darkcyan;
  color: fuchsia;
  color: lightgreen;
  color: lightskyblue;
  background-color: red;
  background-color: crimson;
  background-color: cyan;
  background-color: darkblue;
  background-color: darkcyan;
  background-color: fuchsia;
  background-color: lightgreen;
  background-color: lightskyblue;
  border-color: red;
  border-color: crimson;
  border-color: cyan;
  border-color: darkblue;
  border-color: darkcyan;
  border-color: fuchsia;
  border-color: lightgreen;
  border-color: lightskyblue;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-text-accent-orange, red);
        color: var(--ds-text-danger, crimson);
        color: var(--ds-text-accent-teal, cyan);
        color: var(--ds-text-accent-blue-bolder, darkblue);
        color: var(--ds-text-accent-teal-bolder, darkcyan);
        color: var(--ds-text-subtle, fuchsia);
        color: var(--ds-text-accent-green, lightgreen);
        color: var(--ds-text-accent-blue, lightskyblue);
        background-color: var(--ds-background-danger, red);
        background-color: var(--ds-background-danger, crimson);
        background-color: var(--ds-background-accent-teal-subtle, cyan);
        background-color: var(--ds-background-accent-blue-bolder, darkblue);
        background-color: var(--ds-background-accent-teal-bolder, darkcyan);
        background-color: var(--ds-background-accent-magenta-subtle, fuchsia);
        background-color: var(--ds-background-accent-green-subtle, lightgreen);
        background-color: var(--ds-background-accent-blue-subtle, lightskyblue);
        border-color: var(--ds-border-accent-orange, red);
        border-color: var(--ds-border-danger, crimson);
        border-color: var(--ds-border-accent-teal, cyan);
        border-color: var(--ds-border-accent-blue, darkblue);
        border-color: var(--ds-border-accent-teal, darkcyan);
        border-color: var(--ds-border-accent-magenta, fuchsia);
        border-color: var(--ds-border-accent-green, lightgreen);
        border-color: var(--ds-border-accent-blue, lightskyblue);
      }"
    `);
  });

  it(`raw colors`, async () => {
    const input = `
.normal {
  color: #ffffff;
  color: #fff;
  color: #000000;
  color: #f0f0f0;
  color: #eeeeee;
  color: #cccccc;
  color: #292929;
  color: #003366;
  background-color: #ffffff;
  background-color: #fff;
  background-color: #000000;
  background-color: #f0f0f0;
  background-color: #eeeeee;
  background-color: #cccccc;
  background-color: #292929;
  background-color: #003366;
  border-color: #ffffff;
  border-color: #fff;
  border-color: #000000;
  border-color: #f0f0f0;
  border-color: #eeeeee;
  border-color: #cccccc;
  border-color: #292929;
  border-color: #003366;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface, #ffffff);
        color: var(--ds-surface, #fff);
        color: var(--ds-text, #000000);
        color: var(--ds-surface, #f0f0f0);
        color: var(--ds-surface-sunken, #eeeeee);
        color: var(--ds-text-accent-gray, #cccccc);
        color: var(--ds-text, #292929);
        color: var(--ds-text, #003366);
        background-color: var(--ds-surface, #ffffff);
        background-color: var(--ds-surface, #fff);
        background-color: var(--ds-background-input, #000000);
        background-color: var(--ds-surface, #f0f0f0);
        background-color: var(--ds-surface-sunken, #eeeeee);
        background-color: var(--ds-background-accent-gray-subtle, #cccccc);
        background-color: var(--ds-background-input, #292929);
        background-color: var(--ds-background-input, #003366);
        border-color: var(--ds-surface, #ffffff);
        border-color: var(--ds-surface, #fff);
        border-color: var(--ds-border, #000000);
        border-color: var(--ds-surface, #f0f0f0);
        border-color: var(--ds-surface-sunken, #eeeeee);
        border-color: var(--ds-border-accent-gray, #cccccc);
        border-color: var(--ds-border, #292929);
        border-color: var(--ds-border, #003366);
      }"
    `);
  });

  it(`omits less variable use`, async () => {
    const input = `.normal { border-bottom: @grid/2 solid @gh-background-color-column; }`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(
      `".normal { border-bottom: @grid/2 solid @gh-background-color-column; }"`,
    );
  });

  it(`gradients`, async () => {
    const input = `
.container {
  background: linear-gradient(red, blue);
  background: radial-gradient(red, blue);
  background: conic-gradient(red, orange, yellow, green, blue);
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".container {
        background: linear-gradient(var(--ds-background-danger, red), var(--ds-background-accent-blue-subtle, blue));
        background: radial-gradient(var(--ds-background-danger, red), var(--ds-background-accent-blue-subtle, blue));
        background: conic-gradient(var(--ds-background-danger, red), var(--ds-background-input, orange), var(--ds-background-accent-yellow-subtle, yellow), var(--ds-background-accent-green-subtle, green), var(--ds-background-accent-blue-subtle, blue));
      }"
    `);
  });

  it(`border color`, async () => {
    const input = `
.some-div {
  border-color: red yellow green hsla(60, 90%, 50%, .8);
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".some-div {
        border-color: var(--ds-border-accent-orange, red) var(--ds-border-accent-yellow, yellow) var(--ds-border-accent-green, green) var(--ds-border, hsla(60, 90%, 50%, .8));
      }"
    `);
  });

  it(`other color properties`, async () => {
    const input = `
.properties {
  accent-color: darkred;
  caret-color: red;
  text-stroke: 4px navy;
  scrollbar-color: rebeccapurple green;
}
`;
    const result = await applyTransform(transformer, input);
    expect(result).toMatchInlineSnapshot(`
      ".properties {
        accent-color: var(--ds-background-accent-orange-bolder-hovered, darkred);
        caret-color: var(--ds-background-accent-orange-subtler-hovered, red);
        text-stroke: 4px var(--ds-text-accent-blue-bolder, navy);
        scrollbar-color: var(--ds-text-accent-purple, rebeccapurple) var(--ds-text-accent-green, green);
      }"
    `);
  });
});
