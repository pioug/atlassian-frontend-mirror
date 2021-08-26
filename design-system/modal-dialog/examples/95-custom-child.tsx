/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import {
  borderRadius as getBorderRadius,
  gridSize,
} from '@atlaskit/theme/constants';

import Modal, { ModalTransition } from '../src';

const borderRadius = getBorderRadius();

const childStyles = css({
  height: '400px',
  backgroundColor: 'hotpink',
});

const containerStyles = css({
  padding: `${gridSize() * 2}px`,
});

type BorderRadius = 'less' | 'same' | 'more';

const borderRadiuses = [
  {
    name: 'border-radius',
    value: 'less',
    label: 'Less than 3px means the box shadow does not match',
    testId: 'less',
  },
  {
    name: 'border-radius',
    value: 'same',
    label: '3px',
    testId: 'same',
  },
  {
    name: 'border-radius',
    value: `more`,
    label: 'More than 3px means you start to see the background',
    testId: 'more',
  },
];

const borderRadiusMap: { [key in BorderRadius]: SerializedStyles } = {
  less: css({ borderRadius: 0 }),
  same: css({ borderRadius }),
  more: css({ borderRadius: borderRadius * 2 }),
};

export default function ModalWithCustomChild() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<
    BorderRadius
  >('same');
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div css={containerStyles}>
      <p>
        If using a custom child which has its own background you should set the
        border radius to be 3px. If it is set less than 3px the border radius
        will not match the box shadow, and if set to be more than 3px you will
        start to see the background of the modal dialog.
      </p>

      <Field name="sb" label="Border radius">
        {() => (
          <RadioGroup
            options={borderRadiuses}
            value={selectedBorderRadius}
            onChange={(e) =>
              setSelectedBorderRadius(e.target.value as BorderRadius)
            }
          />
        )}
      </Field>

      <br />
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal">
            <div css={[childStyles, borderRadiusMap[selectedBorderRadius]]} />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
