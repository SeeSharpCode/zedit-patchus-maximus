/* global ngapp, xelib */
let patchers = [];

//=require patchers/*.js

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Cell Encounter Levels In Name',
        templateUrl: `${patcherPath}/partials/settings.html`,
        defaultSettings: {
            formulaRangedLeveled: '{name} [{min} ~ {max}]',
            formulaDeleveled: '{name} [{min}]',
            formulaLeveled: '{name} [{min}+]',
            patchFileName: 'PatchusMaximus.esp'
        }
    },
    requiredFiles: [],
    getFilesToPatch: function (filenames) {
        return filenames;
    },
    execute: {
        initialize: function(patch, helpers, settings, locals) {
            locals.gameSettings = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/game-settings.json`);
            locals.enchantingConfig = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/enchanting.json`);
            locals.weapons = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/weapons.json`);
        },
        process: patchers
    }
});