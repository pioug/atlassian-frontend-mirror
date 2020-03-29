import React, { Component } from 'react';
import Button from '@atlaskit/button';

import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import RadioGroup, { AkRadio } from '@atlaskit/field-radio-group';
import ModalDialog, {
  ModalFooter,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Form, { Field, CheckboxField } from '../src';

interface State {
  isOpen: boolean;
}
export default class AtlaskitFormDemo extends Component<{}, State> {
  state = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  onFormSubmit = (data: Object) => console.log(JSON.stringify(data));

  render() {
    const { isOpen } = this.state;
    const footer = (props: { showKeyline?: boolean }) => (
      <ModalFooter showKeyline={props.showKeyline}>
        <span />
        <Button appearance="primary" type="submit">
          Submit to Console
        </Button>
      </ModalFooter>
    );

    const radioItems = [
      { name: 'color', value: 'red', label: 'Red' },
      { name: 'color', value: 'blue', label: 'Blue' },
      { name: 'color', value: 'yellow', label: 'Yellow' },
    ];

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <ModalDialog
              heading="Form Demo"
              onClose={this.close}
              components={{
                Container: ({ children, className }) => (
                  <Form onSubmit={this.onFormSubmit}>
                    {({ formProps }) => (
                      <form {...formProps} className={className}>
                        {children}
                      </form>
                    )}
                  </Form>
                ),
                Footer: footer,
              }}
            >
              <p>Enter some text then submit the form to see the response.</p>
              <Field label="Name" name="my-name" defaultValue="">
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <Field label="Email" name="my-email" defaultValue="">
                {({ fieldProps }) => (
                  <Textfield
                    autoComplete="off"
                    placeholder="gbelson@hooli.com"
                    {...fieldProps}
                  />
                )}
              </Field>

              <CheckboxField name="checkbox" defaultIsChecked>
                {({ fieldProps }) => (
                  <Checkbox {...fieldProps} value="example" label="Checkbox" />
                )}
              </CheckboxField>

              <Field name="radiogroup" defaultValue="">
                {({ fieldProps: { value, ...others } }) => (
                  <RadioGroup
                    items={radioItems}
                    label="Basic Radio Group Example"
                    {...others}
                  >
                    <AkRadio name="standalone" value="singleButton">
                      Radio button
                    </AkRadio>
                  </RadioGroup>
                )}
              </Field>
            </ModalDialog>
          )}
        </ModalTransition>
      </div>
    );
  }
}
