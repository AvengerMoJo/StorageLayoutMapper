#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into build
cd dist

git add -A 
git commit -s -S -m 'deploy'

git push -f git@github.com:avengermojo/avengermojo.github.io.git master

cd -


