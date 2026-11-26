import React from 'react';

import AudioIcon16 from '@atlaskit/icon-file-type/glyph/audio/16';
import AudioIcon24 from '@atlaskit/icon-file-type/glyph/audio/24';
import AudioIcon48 from '@atlaskit/icon-file-type/glyph/audio/48';

export default (): React.JSX.Element => (
	<div>
		<AudioIcon48 label="audioicon 48" />
		<AudioIcon24 label="audioicon 24" />
		<AudioIcon16 label="audioicon 16" />
	</div>
);
