export const printScript = (statements: string[]) => `(function(){
  ${statements.join(';')}
})();
`;
