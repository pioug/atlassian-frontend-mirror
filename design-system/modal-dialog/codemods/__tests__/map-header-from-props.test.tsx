import { createTransformer } from '@atlaskit/codemod-utils';

import { mapHeaderFromProps } from '../migrations/map-header-from-props';

const transformer = createTransformer([mapHeaderFromProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map header from props', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header,
            Footer
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

    const Header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Footer
          }}>
          {Header()}
          {content}
        </ModalDialog>
      );
    }
    `,
        'should invoke Header declared as shorthand',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const CustomHeader = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header: CustomHeader,
            Footer,
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

    const CustomHeader = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Footer
          }}>
          {CustomHeader()}
          {content}
        </ModalDialog>
      );
    }
    `,
        'should invoke Header declared as assigned variable',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Footer,
            Header: ({ id, testId }) => (
              <div data-testid={testId}>
                <h1 id={id}>Custom header</h1>
              </div>
            )
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

    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Footer
          }}>
          {(({ id, testId }) => <div data-testid={testId}>
            <h1 id={id}>Custom header</h1>
          </div>)()}
          {content}
        </ModalDialog>
      );
    }
    `,
        'should invoke Header declared as arrow function',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const components = {
      Header: (props) => (<div><h1 id={props.id}>{props.children}</h1></div>),
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
      Header: (props) => (<div><h1 id={props.id}>{props.children}</h1></div>),
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header: this.header,
              Footer,
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Footer
            }}>
            {this.header()}
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Header of a modal dialog declared as class component',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            header={this.header}
            components={{
              Footer
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            header={this.header}
            components={{
              Footer
            }}>
            {this.header()}
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Header passed to the header prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header: this.header,
              Footer
            }}
            header={({ id, testId }) => (
              <div data-testid={testId}>
                <h1 id={id}>Custom header</h1>
              </div>
            )}
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Footer
            }}
            header={({ id, testId }) => (
              <div data-testid={testId}>
                <h1 id={id}>Custom header</h1>
              </div>
            )}>
            {this.header()}
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        'should take Header passed from components prop if both declarations exist',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance="warning"
            components={{
              Header: this.header,
              Footer
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance="warning"
            components={{
              Footer
            }}>
            {this.header({
              appearance: "warning"
            })}
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        'should pass appearance set as string literal from parent ModalDialog to custom header as a prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance={modalDialogAppearance}
            components={{
              Header: this.header,
              Footer
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

    const Footer = (props) => (<div>{props.children}</div>);

    class CustomModalDialog extends React.Component {
      header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance={modalDialogAppearance}
            components={{
              Footer
            }}>
            {this.header({
              appearance: modalDialogAppearance
            })}
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        'should pass appearance set as expression from parent ModalDialog to custom header as a prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import SectionMessage from '@atlaskit/section-message';

    const Header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          appearance="warning"
          components={{
            Header,
            Footer
          }}
        >
          <SectionMessage appearance="information">
            {sectionMessage}
          </SectionMessage>
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import SectionMessage from '@atlaskit/section-message';

    const Header = (props) => (<div><h1 id={props.id}>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          appearance="warning"
          components={{
            Footer
          }}>
          {Header({
            appearance: "warning"
          })}
          <SectionMessage appearance="information">
            {sectionMessage}
          </SectionMessage>
          {content}
        </ModalDialog>
      );
    }
    `,
        'should pass appearance attribute ONLY from parent ModalDialog',
      );
    });
  });
});
