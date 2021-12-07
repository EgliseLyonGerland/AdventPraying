module.exports = {
  '*.{js,ts}': ['eslint --fix', 'git add'],
  '**/*.ts': () => 'tsc -p tsconfig.json --noEmit',
  '*': ['prettier --write --ignore-unknown', 'git add'],
};
