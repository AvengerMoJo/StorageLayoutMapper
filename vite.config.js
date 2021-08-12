const { resolve } = require('path')
const srcPath = resolve(__dirname, './src');

module.exports = {
    alias: {
        '/@/': resolve(__dirname, './src')
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                storage: resolve(__dirname, 'StorageLayoutMapper.html')
            }
        }
    }
}
