import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';

import ModalDialog, {
  Appearance,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const longNonBreakableTitle = `ThisIs${'long'.repeat(20)}NonBreakableTitle`;
const longBreakableTitle = `This is ${'long '.repeat(20)} breakable title`;
const shortTitle = 'This is a short title';

const titles = [
  {
    name: 'title',
    value: longNonBreakableTitle,
    label: 'long non-breakable title',
    defaultSelected: true,
  },
  {
    name: 'title',
    value: longBreakableTitle,
    label: 'long breakable title',
  },
  { name: 'title', value: shortTitle, label: 'short title' },
];

export default function MultiLineTitles() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const [title, setTitle] = useState(longNonBreakableTitle);
  const [isTitleMultiline, setIsTitleMultiline] = useState(false);
  const [appearance, setAppearance] = useState<Appearance | undefined>(
    'warning',
  );

  return (
    <div style={{ padding: 16 }}>
      <Button testId="modal-trigger" onClick={open}>
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close} testId="modal" width="medium">
            <ModalHeader>
              <ModalTitle
                appearance={appearance}
                isMultiline={isTitleMultiline}
              >
                {title}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Field name="hd" label="Title">
                {() => (
                  <RadioGroup
                    options={titles}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}
              </Field>

              <Field name="hs" label="Toggle multi-line">
                {() => (
                  <Checkbox
                    label="Is title multi-line?"
                    name="multiline"
                    testId="multiline"
                    onChange={(e) => setIsTitleMultiline(e.target.checked)}
                    isChecked={isTitleMultiline}
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
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Secondary Action</Button>
              <Button appearance={appearance || 'primary'} onClick={close}>
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
