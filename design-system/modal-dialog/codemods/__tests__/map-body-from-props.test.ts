import { createTransformer } from '@atlaskit/codemod-utils';

import { mapBodyFromProps } from '../migrations/map-body-from-props';

const transformer = createTransformer([mapBodyFromProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map body from props', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Body = (props) => (<div>{props.children}</div>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{ Body, Header }}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Body = (props) => (<div>{props.children}</div>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {Body({
            children: <>
              {content}
            </>
          })}
        </ModalDialog>
      );
    }
    `,
        'should invoke Body declared as shorthand with children passed as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const BodyComponent = (props) => (<div>{props.children}</div>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Body: BodyComponent,
            Header
          }}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const BodyComponent = (props) => (<div>{props.children}</div>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {BodyComponent({
            children: <>
              {content}
            </>
          })}
        </ModalDialog>
      );
    }
    `,
        'should invoke Body declared as assigned variable with children passed as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import Form from '@atlaskit/form';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header,
            Body: (props) => (
              <Form onSubmit={onSubmit}>
                {({ formProps }) => <form {...formProps}>{props.children}</form>}
              </Form>
            )
          }}
        >
          <div>First content</div>
          <div>Second content</div>
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import Form from '@atlaskit/form';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {(props => <Form onSubmit={onSubmit}>
            {({ formProps }) => <form {...formProps}>{props.children}</form>}
          </Form>)({
            children: <>
              <div>First content</div>
              <div>Second content</div>
            </>
          })}
        </ModalDialog>
      );
    }
    `,
        'should invoke Body declared as a function expression with children passed as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Body: this.body,
              Header
            }}
          >
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header
            }}>
            {this.body({
              children: <>
                {content}
              </>
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Body of a modal dialog declared as class component',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            body={this.body}
            components={{
              Header
            }}>
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            body={this.body}
            components={{
              Header
            }}>
            {this.body({
              children: <>
                {content}
              </>
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Body passed to the body prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            body={({ children }) => <div>{children}</div>}
            components={{
              Header,
              Body: this.body
            }}
          >
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      body = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            body={({ children }) => <div>{children}</div>}
            components={{
              Header
            }}>
            {this.body({
              children: <>
                {content}
              </>
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should take Body passed from components prop if both declarations exist',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const components = {
      Body: (props) => (<div>{props.children}</div>),
    };

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose} components={components}>
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog, { ModalBody } from "@atlaskit/modal-dialog";

    const components = {
      Body: (props) => (<div>{props.children}</div>),
    };

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose} components={components}>
          <ModalBody>
            {content}
          </ModalBody>
        </ModalDialog>
      );
    }
    `,
        'should wrap children in default ModalBody if components prop is NOT defined as inline object expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog, { ModalBody } from "@atlaskit/modal-dialog";

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          <ModalBody>
            {content}
          </ModalBody>
        </ModalDialog>
      );
    }
    `,
        'should wrap children in default ModalBody if no override exists in the components prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog, { ModalBody } from "@atlaskit/modal-dialog";

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          <ModalBody>
            {content}
          </ModalBody>
        </ModalDialog>
      );
    }
    `,
        'should wrap children in default ModalBody if no components/body props exist',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    const ModalDialog = React.lazy(() => import('@atlaskit/modal-dialog'));

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    const ModalDialog = React.lazy(() => import('@atlaskit/modal-dialog'));

    /* TODO: (from codemod) We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported. */
    const ModalBody = React.lazy(() => import("@atlaskit/modal-dialog/modal-body"));

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          <ModalBody>
            {content}
          </ModalBody>
        </ModalDialog>
      );
    }
    `,
        'should wrap import ModalBody dynamically when ModalDialog is dynamically imported',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      const ModalBody = () => <div />;

      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog, { ModalBody as AKModalBody } from "@atlaskit/modal-dialog";

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      const ModalBody = () => <div />;

      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          <AKModalBody>
            {content}
          </AKModalBody>
        </ModalDialog>
      );
    }
    `,
        'should import default ModalBody as AKModalBody if the declaration already exists',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog, { ModalBody } from '@atlaskit/modal-dialog';

    const CustomBody = (props) => (
      <form>
        <ModalBody>
          {props.children}
        </ModalBody>
      </form>
    );

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          <CustomBody>
            {content}
          </CustomBody>
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog, { ModalBody } from '@atlaskit/modal-dialog';

    const CustomBody = (props) => (
      <form>
        <ModalBody>
          {props.children}
        </ModalBody>
      </form>
    );

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          <CustomBody>
            {content}
          </CustomBody>
        </ModalDialog>
      );
    }
    `,
        'should do nothing if ModalBody is already imported',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose} header={Header} />
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose} header={Header} />
      );
    }
    `,
        'should do nothing when no overrides exist and ModalDialog is self-closing',
      );
    });
  });
});
