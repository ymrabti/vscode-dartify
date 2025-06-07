import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
    {
        ignores: [
            "node_modules",
            "dist",
            "tests/*",
            "**/config.js",
            "**/cookies.js",
        ]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node,
        },
        linterOptions: {

        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": "off",
            "func-names": "warn",
            "no-console": "off"
        }
    }
]);
