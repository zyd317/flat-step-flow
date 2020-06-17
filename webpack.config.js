const path = require('path');
module.exports = (env, argv) => {
    return {
        mode: argv.mode,
        entry: {
            index: path.join(__dirname, './src/index.ts'),
        },
        output: {
            path: path.join(__dirname, 'lib'),
            filename: '[name].js',
            publicPath: '/lib/',
            libraryTarget: 'commonjs',
        },
        resolve: {
            extensions: [".js", ".ts"],
        },
        module: {
            rules: [
                {
                    test: /\.[jt]s$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
            ]
        },
    };
};
