export default function gameSettingsPatcher(helpers, locals) {
    return {
        load: {
            signature: 'GMST',
            filter: function(record) {
                if (!locals.useWarrior) return;
                const editorID = xelib.EditorID(record);
                return Object.keys(locals.gameSettings).includes(editorID);
            }
        },
        patch: function(record) {
            const editorID = xelib.EditorID(record);
            const value = locals.gameSettings[editorID];
            xelib.SetFloatValue(record, 'DATA\\Float', value);
            helpers.logMessage(`(GMST) set ${editorID} to ${value}`);
        }
    };
};