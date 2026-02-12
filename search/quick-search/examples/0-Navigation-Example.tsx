// See [Barrel File Removal FAQ](https://hello.atlassian.net/wiki/x/KJT2aAE)
/* eslint-disable no-barrel-files/no-barrel-files */
import React from 'react';

import BasicQuickSearch from './utils/BasicQuickSearch';

export default () => <BasicQuickSearch fakeNetworkLatency={500} />;
