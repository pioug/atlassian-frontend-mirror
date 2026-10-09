import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table/stateful';

import { rows } from './content/sample-data';

const HeadlessExample = (): React.JSX.Element => <DynamicTable rowsPerPage={5} rows={rows} />;

export default HeadlessExample;
