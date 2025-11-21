import React from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import { head } from './content/sample-data';

const EmptyViewWithoutBodyExample = (): React.JSX.Element => <DynamicTableStateless head={head} />;

export default EmptyViewWithoutBodyExample;
