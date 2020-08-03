import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag from '../../src';

export default function FlagDefault() {
  return (
    <Flag
      icon={<SuccessIcon primaryColor={G300} label="Info" />}
      description="Bamboo will permanently delete all related configuration settings, artifacts, logos, and results. This can’t be undone."
      id="1"
      key="1"
      title="Delete the Newtown repository"
    />
  );
}
