import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: [{ input: "lib/index" }],
    dependencies: ['synchronous-promise'],
    declaration: true, // generate .d.ts files
});
