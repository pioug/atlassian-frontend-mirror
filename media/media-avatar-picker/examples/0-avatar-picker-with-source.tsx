import React from 'react';
import { tallImage } from '@atlaskit/media-test-helpers';
import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';

export default (): React.JSX.Element => (
	<StatefulAvatarPickerDialog placeholder={<div>Loading...</div>} imageSource={tallImage} />
);
