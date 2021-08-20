const path = require('path');

module.exports = {
    resolve: {
        alias: [
            {find: "@", replacement: path.resolve(__dirname, 'src')}
        ],
    },
    base: 'https://avengermojo.github.io/',
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                storage: path.resolve(__dirname, 'StorageLayoutMapper.html')
            }
        }
    }
}
