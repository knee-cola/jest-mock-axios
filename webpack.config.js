const path = require('path');

const srcDir = './lib/';
const destDir = 'dist';

module.exports = {
    entry: {
        "index": srcDir+"index.ts",
    },
    output: {
        path: path.resolve(__dirname + '/' + destDir),
        filename: 'index.js',
        library: 'jest-mock-axios',
        libraryTarget: 'umd'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    devtool: 'source-map',

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
//                options: {
//                    useBabel: true,
//                    declaration: true,
//                    declarationDir: "./dist"
//                }
            },
        ]
    }
};