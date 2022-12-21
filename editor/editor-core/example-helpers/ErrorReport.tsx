/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import type { ValidationError } from '@atlaskit/adf-utils/validatorTypes';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

export type Error = {
  entity: ADFEntity;
  error: ValidationError;
};

export type Props = {
  errors: Array<Error>;
};

const reportContainer = css`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
`;

const styledReportEntry = css`
  flex: 1;
  padding: 1em;
  border-right: 1px solid ${N30};
`;

const ReportEntry = ({ error }: { error: Error }) => (
  <div css={styledReportEntry}>
    {error.error ? (
      <Fragment>
        <h4>{error.error.message}</h4>
        <code>
          <pre>{JSON.stringify(error.entity, null, 2)}</pre>
        </code>
        {error.error.meta && (
          <Fragment>
            <p>Meta: </p>
            <pre>{JSON.stringify(error.error.meta)}</pre>
          </Fragment>
        )}
      </Fragment>
    ) : (
      <Fragment>
        <h4>Empty error?</h4>
        <pre>{JSON.stringify(error)}</pre>
      </Fragment>
    )}
  </div>
);

export class ErrorReport extends React.Component<Props> {
  render() {
    return (
      <div css={reportContainer}>
        {this.props.errors.map((error, idx) => (
          <ReportEntry key={idx} error={error} />
        ))}
      </div>
    );
  }
}

export default ErrorReport;
