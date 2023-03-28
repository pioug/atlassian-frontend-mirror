/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import ReactDOMServer from 'react-dom/server';

import { CodeBlock } from '../src';

const exampleCodeBlock = `// React component
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);`;

const Layout: React.FC<{ children: React.ReactNode }> = (props) => (
  <div
    css={{
      padding: 8,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
    }}
  >
    {props.children}
  </div>
);

const H2: React.FC<{ children: React.ReactNode }> = (props) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h2
    css={{
      marginBottom: 8,
    }}
  >
    {props.children}
  </h2>
);

export default function Component() {
  return (
    <Layout>
      <div>
        <H2>SSR</H2>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(
              <CodeBlock language="jsx" text={exampleCodeBlock} />,
            ),
          }}
        />
      </div>
      <div>
        <H2>Hydrated</H2>
        <CodeBlock language="jsx" text={exampleCodeBlock} />
      </div>
      <div>
        <H2>SSR</H2>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(
              <CodeBlock
                showLineNumbers={false}
                language="jsx"
                text={exampleCodeBlock}
              />,
            ),
          }}
        />
      </div>
      <div>
        <H2>Hydrated</H2>
        <CodeBlock
          showLineNumbers={false}
          language="jsx"
          text={exampleCodeBlock}
        />
      </div>
    </Layout>
  );
}
