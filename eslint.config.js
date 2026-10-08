import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**'
        ]
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommended,

    ...vue.configs['flat/recommended'],

    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            'vue/multi-word-component-names': 'off'
        }
    }
)