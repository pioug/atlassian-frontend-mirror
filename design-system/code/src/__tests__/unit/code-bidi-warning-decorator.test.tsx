import React from 'react';

import { render } from '@testing-library/react';

import { codeSnippets } from '../../../examples/example-data/bidi-examples';
import codeBidiWarningDecorator from '../../bidi-warning/bidi-warning-decorator';

describe('CodeBidiWarningDecorator', () => {
  // custom test component to make the snapshots easier to read
  // @ts-ignore
  const DemoComponent: React.FunctionComponent<{
    bidiCharacter: string;
  }> = (props) => {
    const hexCodePoint = props.bidiCharacter.codePointAt(0)!.toString(16);

    return <>[u{hexCodePoint}]</>;
  };

  test.each(Object.entries(codeSnippets))(
    'Adds decoration to %s example',
    (_codeSnippetName, codeSnippet) => {
      const decoratedExampleCode = codeBidiWarningDecorator(
        codeSnippet,
        // @ts-ignore
        DemoComponent,
      );

      const { container } = render(<>{decoratedExampleCode}</>);

      expect(container.textContent).toMatchSnapshot();
    },
  );
});
