import { Parser } from 'jscodeshift';
import transformer from '../css-to-design-tokens';

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
      jscodeshift: () => {},
      stats: () => {},
    },
    options || {},
  );

  return (output || '').trim();
}

describe('PostCSS Transform', () => {
  it('standard CSS', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: #eeeeee;
}

.normal-selected {
  color: #eeeeee;
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface-sunken, #eeeeee);
      }

      .normal-selected {
        color: var(--ds-surface-sunken, #eeeeee);
      }"
    `);
  });

  it('standard LESS', async () => {
    const result = await applyTransform(
      transformer,
      `
    .container {
        .mixin-1();
        .mixin-2;
        .mixin-3 (@width: 100px) {
            color: #eeeeee;
        }
    }`,
    );

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

  it('box-shadows', async () => {
    const result = await applyTransform(
      transformer,
      `.container { box-shadow: 0px 1px 5px 0px var(--adg3-color-N40); }`,
    );

    expect(result).toMatchInlineSnapshot(
      `".container { box-shadow: var(--ds-shadow-overflow, 0px 1px 5px 0px var(--adg3-color-N40)); }"`,
    );
  });

  it('should not transform border radius', async () => {
    const result = await applyTransform(
      transformer,
      `.container { border-radius: 3px; }`,
    );

    expect(result).toMatchInlineSnapshot(
      `".container { border-radius: 3px; }"`,
    );
  });

  it('chained selectors', async () => {
    const result = await applyTransform(
      transformer,
      `
h1,h2,h3 {
  color: #eeeeee;
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      "h1,h2,h3 {
        color: var(--ds-surface-sunken, #eeeeee);
      }"
    `);
  });

  it('does not transform CSS var declarations', async () => {
    const result = await applyTransform(
      transformer,
      `--adg3-color-R50: #ffebe6;`,
    );

    expect(result).toMatchInlineSnapshot(`"--adg3-color-R50: #ffebe6;"`);
  });

  it('standard CSS with ADG3 variables', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: var(--adg3-color-N800);
  color: var(--adg3-color-T400);
  color: var(--adg3-color-B400);
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-text, var(--adg3-color-N800));
        color: var(--ds-text-accent-teal, var(--adg3-color-T400));
        color: var(--ds-text-brand, var(--adg3-color-B400));
      }"
    `);
  });

  it('less syntax variables', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: @adg3-color-N800;
  color: @adg3-color-T400;
  color: @adg3-color-B400;
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-text, @adg3-color-N800);
        color: var(--ds-text-accent-teal, @adg3-color-T400);
        color: var(--ds-text-brand, @adg3-color-B400);
      }"
    `);
  });

  it('deeply nested CSS', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: #eeeeee;

  .deep {
    color: #eeeeee;

    .deeper {
      color: #eeeeee;
    }
  }
}`,
    );

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

  it('interaction states CSS', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: #eeeeee;
}

.normal:hover {
  color: #eeeeee;
}

.normal:active {
  color: #eeeeee;
}
`,
    );

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

  it('nested interaction states CSS', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
  color: #eeeeee;

  &:hover {
    color: #eeeeee;
  }

  &:active {
    color: #eeeeee;
  }
}
  `,
    );

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

  it('nested CSS', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
    color: #000000;
    width: var(--gutter-size);

    .nested {
        color: #000000;
    }
}`,
    );

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

  it('avoids already converted colors', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
    color: var(--ds-text, #000000);
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
          color: var(--ds-text, #000000);
      }"
    `);
  });

  it('aliased adg-3 colors', async () => {
    const result = await applyTransform(
      transformer,
      `
.container {
  box-shadow: 0px 1px 5px 0px var(--adg3-color-N40);
  border: 1px solid var(--adg3-color-N40);
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".container {
        box-shadow: var(--ds-shadow-overflow, 0px 1px 5px 0px var(--adg3-color-N40));
        border: 1px solid var(--ds-border, var(--adg3-color-N40));
      }"
    `);
  });

  it('should transform border properties', async () => {
    const result = await applyTransform(
      transformer,
      `
.normal {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
          border-top: 1px solid var(--ds-surface-sunken, #eee);
          border-bottom: 1px solid var(--ds-surface-sunken, #eee);
      }"
    `);
  });

  it('named colors', async () => {
    const result = await applyTransform(
      transformer,
      `
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
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-background-accent-orange-subtle, red);
        color: var(--ds-text-danger, crimson);
        color: var(--ds-background-accent-teal-subtle, cyan);
        color: var(--ds-text-accent-blue-bolder, darkblue);
        color: var(--ds-text-accent-teal-bolder, darkcyan);
        color: var(--ds-background-accent-magenta-subtle, fuchsia);
        color: var(--ds-text-accent-green, lightgreen);
        color: var(--ds-text-accent-blue, lightskyblue);
        background-color: var(--ds-background-accent-orange-subtle, red);
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

  it('raw colors', async () => {
    const result = await applyTransform(
      transformer,
      `
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
}`,
    );

    expect(result).toMatchInlineSnapshot(`
      ".normal {
        color: var(--ds-surface, #ffffff);
        color: var(--ds-surface, #fff);
        color: var(--ds-text, #000000);
        color: var(--ds-surface, #f0f0f0);
        color: var(--ds-surface-sunken, #eeeeee);
        color: var(--ds-text, #cccccc);
        color: var(--ds-text, #292929);
        color: var(--ds-text, #003366);
        background-color: var(--ds-surface, #ffffff);
        background-color: var(--ds-surface, #fff);
        background-color: var(--ds-background-input, #000000);
        background-color: var(--ds-surface, #f0f0f0);
        background-color: var(--ds-surface-sunken, #eeeeee);
        background-color: var(--ds-background-input, #cccccc);
        background-color: var(--ds-background-input, #292929);
        background-color: var(--ds-background-input, #003366);
        border-color: var(--ds-surface, #ffffff);
        border-color: var(--ds-surface, #fff);
        border-color: var(--ds-border, #000000);
        border-color: var(--ds-surface, #f0f0f0);
        border-color: var(--ds-surface-sunken, #eeeeee);
        border-color: var(--ds-border, #cccccc);
        border-color: var(--ds-border, #292929);
        border-color: var(--ds-border, #003366);
      }"
    `);
  });
});
