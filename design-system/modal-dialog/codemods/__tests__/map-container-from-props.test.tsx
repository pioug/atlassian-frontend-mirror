import { createTransformer } from '@atlaskit/codemod-utils';

import { mapContainerFromProps } from '../migrations/map-container-from-props';

const transformer = createTransformer([mapContainerFromProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map container from props', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Container = (props) => (<form>{props.children}</form>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Container,
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

    const Container = (props) => (<form>{props.children}</form>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {Container({
            children: <>
              {content}
            </>
          })}
        </ModalDialog>
      );
    }
    `,
        'should invoke Container declared as shorthand with children passed as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const ContainerComponent = (props) => (<form>{props.children}</form>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Container: ContainerComponent,
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

    const ContainerComponent = (props) => (<form>{props.children}</form>);
    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {ContainerComponent({
            children: <>
              {content}
            </>
          })}
        </ModalDialog>
      );
    }
    `,
        'should invoke Container declared as assigned variable with children passed as argument',
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
            Container: 'form',
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

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          <form>
            {content}
          </form>
        </ModalDialog>
      );
    }
    `,
        'should wrap Container declared as string around children',
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
            Container: (props) => (
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
        'should invoke Container declared as a function expression with children passed as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const components = {
      Container: (props) => (<form>{props.children}</form>),
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

    import ModalDialog from '@atlaskit/modal-dialog';

    const components = {
      Container: (props) => (<form>{props.children}</form>),
    };

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose} components={components}>
          {content}
        </ModalDialog>
      );
    }
    `,
        'should do nothing if components definition is not an inline object expression',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      container = (props) => (<form>{props.children}</form>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Container: this.container,
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
      container = (props) => (<form>{props.children}</form>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header
            }}>
            {this.container({
              children: <>
                {content}
              </>
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Container of a modal dialog declared as class component',
      );
    });
  });
});
