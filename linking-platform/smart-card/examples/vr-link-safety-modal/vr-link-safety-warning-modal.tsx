/** @jsx jsx */
import { jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import LinkWarningModal from '../../src/view/LinkUrl/LinkWarningModal';

export default () => {
  const url = `https://pug.jira-dev.com/wiki/spaces/CFE/blog/2021/03/02/17874389778/Please+handle+Gr[…]rors+properly?search_id=26b4445e-f42a-4bef-915a-138e0b927436`;
  const unsafeLinkText = `${url}/super-safe`;

  const linkWarningModalProps = {
    isOpen: true,
    url: url,
    unsafeLinkText: unsafeLinkText,
    onClose: () => {},
    onContinue: () => {},
  };
  return (
    <VRTestWrapper>
      <LinkWarningModal {...linkWarningModalProps} />
    </VRTestWrapper>
  );
};
