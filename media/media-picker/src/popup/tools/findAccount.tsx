export const findAccount = function (accounts: any, accountId: any) {
  return accounts.filter((account: any) => account.id === accountId)[0];
};
