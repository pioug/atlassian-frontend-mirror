const analyticsMock = jest.createMockFromModule<any>('../analytics');

analyticsMock.resolvedEvent = jest.fn().mockReturnValue({
  action: 'resolved',
  attributes: { componentName: 'smart-cards' },
});

analyticsMock.unresolvedEvent = jest.fn().mockReturnValue({
  action: 'unresolved',
  attributes: { componentName: 'smart-cards' },
});

export default { ...analyticsMock };
module.exports = analyticsMock;
