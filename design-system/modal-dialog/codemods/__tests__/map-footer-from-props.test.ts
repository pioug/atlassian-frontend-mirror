import { createTransformer } from '@atlaskit/codemod-utils';

import { mapFooterFromProps } from '../migrations/map-footer-from-props';

const transformer = createTransformer([mapFooterFromProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map footer from props', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);
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

    const Header = (props) => (<div><h1>{props.children}</h1></div>);
    const Footer = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {content}
          {Footer()}
        </ModalDialog>
      );
    }
    `,
        'should invoke Footer declared as shorthand',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);
    const CustomFooter = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header,
            Footer: CustomFooter,
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
    const CustomFooter = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          components={{
            Header
          }}>
          {content}
          {CustomFooter()}
        </ModalDialog>
      );
    }
    `,
        'should invoke Footer declared as assigned variable',
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
            Header,
            Footer: ({ testId, onClose }) => (
              <div data-testid={testId}>
                <button onClose={onClose}>Custom footer</button>
              </div>
            ),
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
          {content}
          {(({ testId, onClose }) => <div data-testid={testId}>
            <button onClose={onClose}>Custom footer</button>
          </div>)()}
        </ModalDialog>
      );
    }
    `,
        'should invoke Footer declared as arrow function',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const components = {
      Footer: (props) => (<div>{props.children}</div>),
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
      Footer: (props) => (<div>{props.children}</div>),
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
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header,
              Footer: this.footer,
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
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header
            }}>
            {content}
            {this.footer()}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Footer of a modal dialog declared as class component',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog onClose={handleClose} footer={this.footer}>
            {content}
          </ModalDialog>
        );
      }
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog onClose={handleClose} footer={this.footer}>
            {content}
            {this.footer()}
          </ModalDialog>
        );
      }
    }
    `,
        'should invoke Footer passed to the footer prop',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header,
              Footer: this.footer
            }}
            footer={({ testId, onClose }) => (
              <div data-testid={testId}>
                <button onClose={onClose}>Custom footer</button>
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

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            components={{
              Header
            }}
            footer={({ testId, onClose }) => (
              <div data-testid={testId}>
                <button onClose={onClose}>Custom footer</button>
              </div>
            )}>
            {content}
            {this.footer()}
          </ModalDialog>
        );
      }
    }
    `,
        'should take Footer passed from components prop if both declarations exist',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance="warning"
            components={{
              Header,
              Footer: this.footer
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
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance="warning"
            components={{
              Header
            }}>
            {content}
            {this.footer({
              appearance: "warning"
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should pass appearance set as string literal from parent ModalDialog to custom footer as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);

    class CustomModalDialog extends React.Component {
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance={modalDialogAppearance}
            components={{
              Header,
              Footer: this.footer
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
      footer = (props) => (<div>{props.children}</div>);

      render() {
        return (
          <ModalDialog
            onClose={handleClose}
            appearance={modalDialogAppearance}
            components={{
              Header
            }}>
            {content}
            {this.footer({
              appearance: modalDialogAppearance
            })}
          </ModalDialog>
        );
      }
    }
    `,
        'should pass appearance set as expression from parent ModalDialog to custom footer as argument',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import SectionMessage from '@atlaskit/section-message';

    const Header = (props) => (<div><h1>{props.children}</h1></div>);
    const FooterComponent = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          appearance="warning"
          components={{
            Header,
            Footer: FooterComponent,
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

    const Header = (props) => (<div><h1>{props.children}</h1></div>);
    const FooterComponent = (props) => (<div>{props.children}</div>);

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          appearance="warning"
          components={{
            Header
          }}>
          <SectionMessage appearance="information">
            {sectionMessage}
          </SectionMessage>
          {content}
          {FooterComponent({
            appearance: "warning"
          })}
        </ModalDialog>
      );
    }
    `,
        'should pass appearance attribute ONLY from parent ModalDialog',
      );
    });
  });
});
