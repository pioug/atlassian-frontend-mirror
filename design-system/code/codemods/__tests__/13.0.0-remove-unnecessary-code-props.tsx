jest.autoMockOff();

import transformer from '../13.0.0-remove-unnecessary-code-props';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const removePropsMapping = {
  lineNumberContainerStyle: 'lineNumberContainerStyle',
  showLineNumbers: 'lineNumberContainerStyle',
  highlight: 'highlight',
};

describe('Remove props', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import React from 'react';`,
    `import React from 'react';`,
    'should not transform if imports are not present',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" />;

    const Component2 = () => <><Code prop="abc">text</Code></>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

    const element = <Code prop="abc" />;
    `,
    `
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" />;

    const Component2 = () => <><Code prop="abc">text</Code></>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

    const element = <Code prop="abc" />;
    `,
    'should not transform if removable props are not preset',
  );

  describe('when only one prop present', () => {
    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { Code } from '@atlaskit/code';

      const Component1 = () => <Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} />;

      const Component2 = () => <><Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }}>text</Code></>;

      class Component3 extends React.Component { render() { return <div><Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} /></div>; } }

      const element = <Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} />;
      `,
      `
      import React from 'react';
      import { Code } from '@atlaskit/code';

      const Component1 = () => <Code prop="abc" />;

      const Component2 = () => <><Code prop="abc">text</Code></>;

      class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

      const element = <Code prop="abc" />;
      `,
      `removes "${removePropsMapping.lineNumberContainerStyle}" "JSXAttribute" prop`,
    );

    defineInlineTest(
      { default: transformer, parser: 'tsx' },
      {},
      `
      import React from 'react';
      import { Code } from '@atlaskit/code';

      const foo = {
        key: 'some value',
        ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '14px' }
      };

      const bar = {
        ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '20px' }
      };

      const Component1 = () => <Code prop="abc" {...foo} {...bar} />;

      const Component2 = () => <Code prop="abc" {...foo} { ...{ ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '24px' } } } {...bar} />;

      const Component3 = () => <Code prop="abc" {...foo} { ...{ ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '24px' }, key: 'hello' } } {...bar} />;
      `,
      `
      import React from 'react';
      import { Code } from '@atlaskit/code';

      const foo = {
        key: 'some value'
      };

      const bar = {};

      const Component1 = () => <Code prop="abc" {...foo} {...bar} />;

      const Component2 = () => <Code prop="abc" {...foo} { ...{} } {...bar} />;

      const Component3 = () => <Code prop="abc" {...foo} { ...{
        key: 'hello'
      } } {...bar} />;
      `,
      `removes "${removePropsMapping.lineNumberContainerStyle}" "JSXSpreadAttribute" prop`,
    );
  });

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} ${removePropsMapping.showLineNumbers} />;

    const Component2 = () =>
      <>
        <Code
          prop="abc"
          ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }}
          ${removePropsMapping.showLineNumbers}={false}
        >
          text
        </Code>
      </>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} /></div>; } }

    const foo = {
      key: 'some value',
      ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '14px' },
      ${removePropsMapping.showLineNumbers}: true
    };

    const bar = {
      ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '20px' },
      ${removePropsMapping.highlight}: '1-5,7,10,15-20'
    };

    const Component4 = () => <Code prop="abc" {...foo} {...bar} ${removePropsMapping.highlight}="2" />;

    const Component5 = () => <Code prop="abc" {...foo} { ...{ ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '24px' } } } {...bar} />;

    const Component6 = () => <Code prop="abc" {...foo} { ...{ ${removePropsMapping.lineNumberContainerStyle}: { fontSize: '24px' }, key: 'hello' } } {...bar} />;

    const element = <Code prop="abc" ${removePropsMapping.lineNumberContainerStyle}={{ fontSize: '14px' }} ${removePropsMapping.highlight}="2-4" />;
    `,
    `
    import React from 'react';
    import { Code } from '@atlaskit/code';

    const Component1 = () => <Code prop="abc" />;

    const Component2 = () =>
      <>
        <Code prop="abc">
          text
        </Code>
      </>;

    class Component3 extends React.Component { render() { return <div><Code prop="abc" /></div>; } }

    const foo = {
      key: 'some value'
    };

    const bar = {};

    const Component4 = () => <Code prop="abc" {...foo} {...bar} />;

    const Component5 = () => <Code prop="abc" {...foo} { ...{} } {...bar} />;

    const Component6 = () => <Code prop="abc" {...foo} { ...{
      key: 'hello'
    } } {...bar} />;

    const element = <Code prop="abc" />;
    `,
    'removes mixture of removable props',
  );
});
