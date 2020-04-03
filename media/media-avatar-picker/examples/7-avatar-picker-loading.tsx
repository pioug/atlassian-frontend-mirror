import React from 'react';
import { tallImage } from '@atlaskit/media-test-helpers';
import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';

export default () => (
  <StatefulAvatarPickerDialog imageSource={tallImage} isLoading={true} />
);
