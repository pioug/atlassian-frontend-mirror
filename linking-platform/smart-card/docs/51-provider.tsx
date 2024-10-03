import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

## SmartCardProvider

### Store options

### Client

*< brief description here />*

[Go to custom client docs](./custom-client)

### Authentication

### Renderer

`;
