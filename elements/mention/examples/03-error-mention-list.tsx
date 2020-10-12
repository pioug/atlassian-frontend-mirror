import React from 'react';
import { HttpError } from '../src/api/MentionResource';
import MentionList from '../src/components/MentionList';
import { IntlProvider } from 'react-intl';

const resourceError = new Error('monkey trousers');
const error401 = new HttpError(401, 'not used');
const error403 = new HttpError(403, 'not used');

export interface State {
  error: Error;
}

export default class DemoMentionList extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: resourceError,
    };
  }

  private setGenericError = () => {
    this.setState({
      error: resourceError,
    });
  };

  private set401Error = () => {
    this.setState({
      error: error401,
    });
  };

  private set403Error = () => {
    this.setState({
      error: error403,
    });
  };

  render() {
    const mentionList = (
      <MentionList mentions={[]} resourceError={this.state.error} />
    );

    return (
      <div style={{ paddingLeft: '10px' }}>
        <div style={{ paddingBottom: '10px' }}>
          <button
            onClick={this.setGenericError}
            style={{ height: '30px', marginRight: '10px' }}
          >
            Generic
          </button>
          <button
            onClick={this.set401Error}
            style={{ height: '30px', marginRight: '10px' }}
          >
            401
          </button>
          <button
            onClick={this.set403Error}
            style={{ height: '30px', marginRight: '10px' }}
          >
            403
          </button>
        </div>
        <IntlProvider locale="en">{mentionList}</IntlProvider>
      </div>
    );
  }
}
