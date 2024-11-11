import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { rows } from './content/sample-data';

const HeadlessExample = () => <DynamicTable rowsPerPage={5} rows={rows} />;

export default HeadlessExample;
