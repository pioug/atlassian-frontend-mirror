jest.autoMockOff();

import transformer from '../13.0.0-rename-imports';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename imports', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import React from 'react';`,
    `import React from 'react';`,
    'should not transform if imports are not present',
  );

  describe('#AkCode import', () => {
    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `import { AkCode } from '@atlaskit/code';`,
      `import { Code } from '@atlaskit/code';`,
      `transforms import name "AkCode" to "Code"`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `import { AkCode as CodeComponent } from '@atlaskit/code';`,
      `import { Code as CodeComponent } from '@atlaskit/code';`,
      `transforms import name "AkCode" with some other name to "Code"`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { AkCode } from '@atlaskit/code';

      const Component1 = () => <AkCode prop="abc" />;

      const Component2 = React.cloneElement(AkCode);

      const Component3 = AkCode;

      const Component4 = withHOC(AkCode, { params: 'abc' });

      const Component5 = () => <><AkCode prop="abc">text</AkCode></>;

      class Component6 extends React.Component { render() { return <div><AkCode prop="abc" /></div>; } }

      const element = <AkCode prop="abc" />;

      const foo = {
        AkCode: () => null,
      };
      `,
      `
      import React from 'react';
      import { Code } from '@atlaskit/code';

      const Component1 = () => <Code prop="abc" />;

      const Component2 = React.cloneElement(Code);

      const Component3 = Code;

      const Component4 = withHOC(Code, { params: 'abc' });

      const Component5 = () => <><Code prop="abc">text</Code></>;

      class Component6 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

      const element = <Code prop="abc" />;

      const foo = {
        AkCode: () => null,
      };
      `,
      `transforms import name "AkCode" to "Code" along with its usage`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCode as CodeComponent } from '@atlaskit/code';

      const Component = () => <CodeComponent prop="abc" />;
      `,
      `
      import { Code as CodeComponent } from '@atlaskit/code';

      const Component = () => <CodeComponent prop="abc" />;
      `,
      `transforms import name "AkCode" to "Code" with some other name along with its usage`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCode } from '@atlaskit/code';

      const Code = () => <AkCode prop="abc" />;
      `,
      `
      import { Code as AkCode } from '@atlaskit/code';

      const Code = () => <AkCode prop="abc" />;
      `,
      `transforms import name "AkCode" to "Code" by renaming its imported name when "Code" variable declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCode } from '@atlaskit/code';

      function Code () { return <AkCode prop="abc" /> };
      `,
      `
      import { Code as AkCode } from '@atlaskit/code';

      function Code () { return <AkCode prop="abc" /> };
      `,
      `transforms import name "AkCode" to "Code" by renaming its imported name when "Code" function declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCode } from '@atlaskit/code';

      class Code { render() { return <AkCode prop="abc" /> } };
      `,
      `
      import { Code as AkCode } from '@atlaskit/code';

      class Code { render() { return <AkCode prop="abc" /> } };
      `,
      `transforms import name "AkCode" to "Code" by renaming its imported name when "Code" class declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { AkCode } from '@atlaskit/code';
      import Code from './component';

      class Component extends React.Component { render() { return <AkCode prop="abc" /> } };
      `,
      `
      import React from 'react';
      import { Code as AkCode } from '@atlaskit/code';
      import Code from './component';

      class Component extends React.Component { render() { return <AkCode prop="abc" /> } };
      `,
      `transforms import name "AkCode" to "Code" by renaming its imported name when "Code" import declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      const Code = lazy(() =>
        import('@atlaskit/code').then(module => ({
          default: module.AkCode,
        })),
      );
      `,
      `
      const Code = lazy(() =>
        import('@atlaskit/code').then(module => ({
          AkCode: module.Code,
          AkCodeBlock: module.CodeBlock
        })).then(module => ({
          default: module.AkCode,
        })),
      );
      `,
      `transforms dynamic import name "AkCode" to "Code"`,
    );
  });

  describe('#AkCodeBlock import', () => {
    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `import { AkCodeBlock } from '@atlaskit/code';`,
      `import { CodeBlock } from '@atlaskit/code';`,
      `transforms import name "AkCodeBlock" to "CodeBlock"`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `import { AkCodeBlock as CodeBlockComponent } from '@atlaskit/code';`,
      `import { CodeBlock as CodeBlockComponent } from '@atlaskit/code';`,
      `transforms import name "AkCodeBlock" with some other name to "CodeBlock"`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { AkCodeBlock } from '@atlaskit/code';

      const Component1 = () => <AkCodeBlock prop="abc" />;

      const Component2 = React.cloneElement(AkCodeBlock);

      const Component3 = AkCodeBlock;

      const Component4 = withHOC(AkCodeBlock, { params: 'abc' });

      const Component5 = () => <><AkCodeBlock prop="abc">text</AkCodeBlock></>;

      class Component6 extends React.Component { render() { return <div><AkCodeBlock prop="abc" /></div>; } }

      const element = <AkCodeBlock prop="abc" />;

      const foo = {
        AkCodeBlock: () => null,
      };
      `,
      `
      import React from 'react';
      import { CodeBlock } from '@atlaskit/code';

      const Component1 = () => <CodeBlock prop="abc" />;

      const Component2 = React.cloneElement(CodeBlock);

      const Component3 = CodeBlock;

      const Component4 = withHOC(CodeBlock, { params: 'abc' });

      const Component5 = () => <><CodeBlock prop="abc">text</CodeBlock></>;

      class Component6 extends React.Component { render() { return <div><CodeBlock prop="abc" /></div>; } }

      const element = <CodeBlock prop="abc" />;

      const foo = {
        AkCodeBlock: () => null,
      };
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" along with its usage`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCodeBlock as CodeBlockComponent } from '@atlaskit/code';

      const Component = () => <CodeBlockComponent prop="abc" />;
      `,
      `
      import { CodeBlock as CodeBlockComponent } from '@atlaskit/code';

      const Component = () => <CodeBlockComponent prop="abc" />;
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" with some other name along with its usage`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCodeBlock } from '@atlaskit/code';

      const CodeBlock = () => <AkCodeBlock prop="abc" />;
      `,
      `
      import { CodeBlock as AkCodeBlock } from '@atlaskit/code';

      const CodeBlock = () => <AkCodeBlock prop="abc" />;
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" by renaming its imported name when "CodeBlock" variable declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCodeBlock } from '@atlaskit/code';

      function CodeBlock () { return <AkCodeBlock prop="abc" /> };
      `,
      `
      import { CodeBlock as AkCodeBlock } from '@atlaskit/code';

      function CodeBlock () { return <AkCodeBlock prop="abc" /> };
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" by renaming its imported name when "CodeBlock" function declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { AkCodeBlock } from '@atlaskit/code';

      class CodeBlock extends React.Component { render() { return <AkCodeBlock prop="abc" /> } };
      `,
      `
      import React from 'react';
      import { CodeBlock as AkCodeBlock } from '@atlaskit/code';

      class CodeBlock extends React.Component { render() { return <AkCodeBlock prop="abc" /> } };
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" by renaming its imported name when "CodeBlock" class declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import { AkCodeBlock } from '@atlaskit/code';
      import CodeBlock from './component';

      class Component { render() { return <AkCodeBlock prop="abc" /> } };
      `,
      `
      import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
      import CodeBlock from './component';

      class Component { render() { return <AkCodeBlock prop="abc" /> } };
      `,
      `transforms import name "AkCodeBlock" to "CodeBlock" by renaming its imported name when "CodeBlock" import declaration is already present`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      const CodeBlock = lazy(() =>
        import('@atlaskit/code').then(module => ({
          default: module.AkCodeBlock,
        })),
      );
      `,
      `
      const CodeBlock = lazy(() =>
        import('@atlaskit/code').then(module => ({
          AkCode: module.Code,
          AkCodeBlock: module.CodeBlock
        })).then(module => ({
          default: module.AkCodeBlock,
        })),
      );
      `,
      `transforms dynamic import name "AkCodeBlock" to "CodeBlock"`,
    );
  });
});
