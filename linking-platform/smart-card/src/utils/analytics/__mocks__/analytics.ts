const analyticsMock = jest.createMockFromModule<any>('../analytics');
const originalAnalytics = jest.requireActual('../analytics');

analyticsMock.resolvedEvent = jest.fn().mockReturnValue({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: { componentName: 'smart-cards' },
});

analyticsMock.unresolvedEvent = jest.fn(originalAnalytics.unresolvedEvent);

export default { ...analyticsMock };
module.exports = analyticsMock;
