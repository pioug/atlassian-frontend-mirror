import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';

import ModalDialog, { AppearanceType, ModalTransition } from '../src';

const longNonBreakableHeading = `ThisIs${'long'.repeat(20)}NonBreakableHeading`;
const longBreakableHeading = `This is ${'long '.repeat(20)} breakable heading`;
const shortHeading = 'This is a short heading';

const headings = [
  {
    name: 'heading',
    value: longNonBreakableHeading,
    label: 'long non-breakable heading',
    defaultSelected: true,
  },
  {
    name: 'heading',
    value: longBreakableHeading,
    label: 'long breakable heading',
  },
  { name: 'heading', value: shortHeading, label: 'short heading' },
];

export default function MultiLineHeadings() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const [heading, setHeading] = useState(longNonBreakableHeading);
  const [isHeadingMultiline, setIsHeadingMultiline] = useState(false);
  const [appearance, setAppearance] = useState<AppearanceType | undefined>(
    'warning',
  );

  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Button testId="modal-trigger" onClick={open}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            appearance={appearance}
            actions={actions}
            heading={heading}
            onClose={close}
            isHeadingMultiline={isHeadingMultiline}
            testId="modal"
            width="medium"
          >
            <Field name="hd" label="Heading">
              {() => (
                <RadioGroup
                  options={headings}
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              )}
            </Field>

            <Field name="hs" label="Toggle multi-line">
              {() => (
                <Checkbox
                  label="Is heading multi-line?"
                  name="multiline"
                  testId="multiline"
                  onChange={(e) => setIsHeadingMultiline(e.target.checked)}
                  isChecked={isHeadingMultiline}
                />
              )}
            </Field>

            <Field name="hs" label="Toggle appearance">
              {() => (
                <Checkbox
                  label="Set warning appearance?"
                  name="appearance"
                  testId="appearance"
                  onChange={(e) =>
                    setAppearance(e.target.checked ? 'warning' : undefined)
                  }
                  isChecked={Boolean(appearance)}
                />
              )}
            </Field>

            <br />
            <Lorem count="5" />
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
