declare var require: {
  <T>(path: string): T;
};

const slackWorkspacesData = require('../json-data/slack-workspaces-data.json') as any;

export default slackWorkspacesData;
