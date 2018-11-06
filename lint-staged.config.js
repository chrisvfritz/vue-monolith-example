module.exports = {
  '*.json': ['prettier --write --loglevel warn', 'git add'],
  '*.js': ['eslint --fix', 'prettier --write --loglevel warn', 'git add'],
  '*.vue': ['eslint --fix', 'prettier --write --loglevel warn', 'git add'],
  '*.md': ['markdownlint', 'prettier --write --loglevel warn', 'git add'],
  '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged', 'git add'],
}
