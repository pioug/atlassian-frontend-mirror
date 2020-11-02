import React, { useCallback, useEffect, useRef } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ExtensionManifest } from '@atlaskit/editor-common';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { FormFooter } from '@atlaskit/form';

import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import FormContent from './FormContent';
import { messages } from './messages';

type Props = {
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  autoSave?: boolean;
  autoSaveTrigger?: unknown;
  submitting?: boolean;
  onCancel: () => void;
  firstVisibleFieldName?: string;
} & InjectedIntlProps;

function Form({
  intl,
  fields,
  onCancel,
  extensionManifest,
  parameters,
  autoSave,
  autoSaveTrigger,
  submitting,
  firstVisibleFieldName,
}: Props) {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const tryAutoSave = useCallback(() => {
    if (!autoSave) {
      return;
    }

    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  }, [autoSave, submitButtonRef]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(tryAutoSave, [autoSaveTrigger]);

  return (
    <React.Fragment>
      <FormContent
        fields={fields}
        parameters={parameters}
        extensionManifest={extensionManifest}
        onFieldBlur={tryAutoSave}
        firstVisibleFieldName={firstVisibleFieldName}
      />
      <div style={autoSave ? { display: 'none' } : {}}>
        <FormFooter align="start">
          <ButtonGroup>
            <Button type="submit" appearance="primary" ref={submitButtonRef}>
              {intl.formatMessage(messages.submit)}
            </Button>
            <Button
              appearance="default"
              isDisabled={submitting}
              onClick={onCancel}
            >
              {intl.formatMessage(messages.cancel)}
            </Button>
          </ButtonGroup>
        </FormFooter>
      </div>
    </React.Fragment>
  );
}

export default injectIntl(Form);
