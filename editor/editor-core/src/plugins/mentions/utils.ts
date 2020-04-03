export const isTeamType = (userType: any): Boolean => userType === 'TEAM';

export const isTeamStats = (stat: any): Boolean =>
  stat && !isNaN(stat.teamMentionDuration);
