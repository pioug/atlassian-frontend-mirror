import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Gateway, GatewayDest, GatewayProvider } from '../../..';
import { name } from '../../../version.json';

function render(jsx) {
  return ReactDOMServer.renderToStaticMarkup(jsx);
}
function assertEqual(actual, expected) {
  expect(render(actual)).toBe(render(expected));
}

// NOTE: shim avoids noise in test logs
const Shim = ({
  // eslint-disable-next-line react/prop-types
  stackIndex, // eslint-disable-next-line react/prop-types
  stackTotal, // eslint-disable-next-line react/prop-types
  blockChildGatewayRender, // eslint-disable-next-line react/prop-types
  ...props
}) => <span {...props} />;

describe(name, () => {
  it('should render Gateway in GatewayDest', () => {
    assertEqual(
      <GatewayProvider>
        <div>
          <section>
            <Gateway into="foo">
              <Shim>Hello World</Shim>
            </Gateway>
          </section>
          <GatewayDest name="foo" />
        </div>
      </GatewayProvider>,
      // should equal
      <div>
        <div>
          <section />
          <div>
            <span>Hello World</span>
          </div>
        </div>
      </div>,
    );
  });
  it('should be able to customize the GatewayDest element', () => {
    assertEqual(
      <GatewayProvider>
        <GatewayDest
          component="section"
          className="elf"
          id="striped"
          name="foo"
        />
      </GatewayProvider>,
      // should equal
      <div>
        <section className="elf" id="striped" />
      </div>,
    );
  });
  it('should be able to customize the GatewayDest with custom components', () => {
    // eslint-disable-next-line react/prop-types
    const Child = ({ children, id }) => <h1 id={id}>{children}</h1>;

    assertEqual(
      <GatewayProvider>
        <GatewayDest component={Child} id="test" name="foo" />
      </GatewayProvider>,
      // should equal
      <div>
        <Child id="test" />
      </div>,
    );
  });
  it('should render into the correct GatewayDest', () => {
    assertEqual(
      <GatewayProvider>
        <div>
          <Gateway into="foo">
            <Shim>One</Shim>
          </Gateway>
          <Gateway into="bar">
            <Shim>Two</Shim>
          </Gateway>
          <GatewayDest name="bar" />
          <GatewayDest name="foo" />
        </div>
      </GatewayProvider>,
      // should equal
      <div>
        <div>
          <div>
            <span>Two</span>
          </div>
          <div>
            <span>One</span>
          </div>
        </div>
      </div>,
    );
  });
  it('should render multiple children into a single GatewayDest', () => {
    assertEqual(
      <GatewayProvider>
        <div>
          <section>
            <Gateway into="foo">
              <Shim>One</Shim>
            </Gateway>
            <div>
              <Gateway into="foo">
                <Shim>Two</Shim>
              </Gateway>
            </div>
            <Gateway into="foo">
              <Shim>Three</Shim>
            </Gateway>
          </section>
          <GatewayDest name="foo" />
        </div>
      </GatewayProvider>,
      // should equal
      <div>
        <div>
          <section>
            <div />
          </section>
          <div>
            <span>One</span>
            <span>Two</span>
            <span>Three</span>
          </div>
        </div>
      </div>,
    );
  });
});
