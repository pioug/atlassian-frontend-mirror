import type React from 'react';

import { injectIntl } from 'react-intl';

import { Header, type Props } from './header';

export default injectIntl(Header) as React.FC<Props>;
