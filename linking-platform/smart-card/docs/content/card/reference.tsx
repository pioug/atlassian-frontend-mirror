import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
### Common Card Props

This outlines the common props used for Card. For specific props related to different card appearances, refer to each respective card appearance.

${(<Props heading="" props={require('!!extract-react-types-loader!../../utils/props-card')} />)}
`;
