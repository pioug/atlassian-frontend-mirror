import React from 'react';
import customMd from './utils/custom-md';
import InProgressMessage from './utils/in-progress-message';

export default customMd`

${(<InProgressMessage />)}

## Card

*< description />*

### Appearance

Card component has three default appearances.

#### Inline

*< brief description />*

*< example of inline card />*

[Go to inline card docs](./inline-card)

#### Block

*< brief description />*

*< example of block card />*

[Go to block card docs](./block-card)

#### Embed

*< brief description />*

*< example of embed card />*

[Go to embed card docs](./embed-card)

### Configurable card (FlexibleCard)

*< brief description />*

[Go to flexible card docs](./flexible-card)

### *< common props />*


`;
