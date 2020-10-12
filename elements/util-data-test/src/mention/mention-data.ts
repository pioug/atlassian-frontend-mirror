declare var require: {
  <T>(path: string): T;
};

export const mentionData = require('../json-data/mention-data.json') as any; // MentionsResult

export const mentionResult: any[] = mentionData.mentions;

export const mentionDataSize = mentionResult.length;
