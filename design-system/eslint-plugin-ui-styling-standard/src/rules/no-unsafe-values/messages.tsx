import outdent from 'outdent';

const whereToGetHelp =
  "If you think this should be allowed, or if you're running into issues, reach out in #help-ui-styling-standard";

export const messages = {
  'no-array-values': outdent`
    Arrays are not allowed in style objects. Support is inconsistent between styling libraries.

    Compose styles with the css prop instead.

    ${whereToGetHelp}
  `,

  'no-conditional-values': outdent`
    Conditional expressions are not allowed in style objects.

    Conditionally apply styles with the css prop instead.

    ${whereToGetHelp}
  `,

  'no-dynamic-keys': outdent`
    Dynamic keys are not allowed in style objects.

    ${whereToGetHelp}
  `,

  'no-function-calls': outdent`
    Function calls are not allowed in style objects.

    ${whereToGetHelp}
  `,

  'no-identifier-arguments': outdent`
    Variable arguments are not allowed.

    Inline the object value, or compose styles with the css prop instead.

    ${whereToGetHelp}
  `,

  'no-object-access': outdent`
    Accessing object values is not allowed in style objects.

    If you are accessing the component's props, use the style prop to apply dynamic values instead.

    ${whereToGetHelp}
  `,

  'no-object-references': outdent`
    Referencing objects is not allowed in style objects.

    Inline the object value instead.

    ${whereToGetHelp}
  `,

  'no-spread-elements': outdent`
    Spread elements are not allowed in style objects.

    Compose styles with the css prop instead.

    ${whereToGetHelp}
  `,

  // Fallback case if a more specific message is not applicable
  'no-unsafe-values': outdent`
    Unsafe values are not allowed in style objects.

    ${whereToGetHelp}
  `,

  'no-variables': outdent`
    Variables are not allowed in style objects, unless they:

    - Have a simple, static value.
    - Are defined in the same file.

    Use the style prop to apply dynamic values instead.

    ${whereToGetHelp}
  `,
};

export type MessageId = keyof typeof messages;
