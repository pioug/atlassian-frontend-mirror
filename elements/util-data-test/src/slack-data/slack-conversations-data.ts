declare var require: {
  <T>(path: string): T;
};

const slackConversationsData = require('../json-data/slack-conversations-data.json') as any;

export default slackConversationsData;
