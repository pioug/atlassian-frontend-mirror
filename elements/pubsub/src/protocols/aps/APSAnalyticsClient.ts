import { AnalyticsWebClient } from '../../apiTypes';
import { logDebug } from '../../util/logger';

export interface APSAnalyticsClient {
  sendEvent(subject: string, action: string, attributes?: any): void;
}

export default (
  analyticsWebClient?: AnalyticsWebClient,
): APSAnalyticsClient => {
  if (analyticsWebClient) {
    return new DefaultAnalyticsClient(analyticsWebClient);
  }

  return new MockAnalyticsClient();
};
class DefaultAnalyticsClient implements APSAnalyticsClient {
  private readonly analyticsWebClient: AnalyticsWebClient;

  constructor(analyticsWebClient: AnalyticsWebClient) {
    this.analyticsWebClient = analyticsWebClient;
  }

  public sendEvent(subject: string, action: string, attributes?: any) {
    this.analyticsWebClient.sendOperationalEvent({
      source: 'atlaskit/pubsub',
      action,
      actionSubject: subject,
      attributes: attributes,
    });
  }
}

class MockAnalyticsClient implements APSAnalyticsClient {
  sendEvent(subject: string, action: string, attributes?: any): void {
    logDebug('[Mock analytics client]', subject, action, attributes);
  }
}
