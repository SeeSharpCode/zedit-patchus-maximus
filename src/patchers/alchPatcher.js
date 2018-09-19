import { getLinkedMagicEffect, removeMagicSchool, getItemBySubstring } from '../util';

export default function alchPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        const editorIDExcluded = locals.alchemyExclusions.editorID.find(expr => expr.test(xelib.EditorID(record)));
        if (editorIDExcluded) return false;

        const nameExcluded = locals.alchemyExclusions.name.find(expr => expr.test(xelib.FullName(record)));
        return nameExcluded;
    };

    const getAlchemyEffect = function(mgef) {
        const name = xelib.FullName(mgef);
        return locals.alchemyEffects.find(e => e.name === name) || getItemBySubstring(locals.alchemyEffects, name);
    };

    const addDurationToDescription = function(mgef) {
        const mgefDescription = xelib.GetValue(mgef, 'DNAM - Magic Item Description');
        if (!mgefDescription.includes('<dur>')) {
            xelib.SetFlag(mgef, 'Magic Effect Data\\DATA - Data\\Flags', 'No Duration', false);
            const newDescription = `${mgefDescription} [Duration: <dur> seconds]`;
            xelib.SetValue(mgef, 'DNAM - Magic Item Description', newDescription);
        }
    };

    const makePotionEffectGradual = function(effect, recordName) {
        const mgef = getLinkedMagicEffect(effect, patchFile);
        const alchemyEffect = getAlchemyEffect(mgef);
        if (!alchemyEffect || !alchemyEffect.allowPotionMultiplier) return;

        const potionMultiplier = getItemBySubstring(locals.potionMultipliers, recordName);
        if (!potionMultiplier) return;

        addDurationToDescription(mgef);

        // const oldDuration = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
        // const oldMagnitude = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
        // const oldCost = xelib.GetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost');
        const newDuration = alchemyEffect.baseDuration * potionMultiplier.multiplierDuration;
        const newMagnitude = alchemyEffect.baseMagnitude * potionMultiplier.multiplierMagnitude;
        const newCost = alchemyEffect.baseCost;

        // TODO only change if new value != old value
        xelib.SetFloatValue(effect, 'EFIT - \\Duration', newDuration);
        xelib.SetFloatValue(effect, 'EFIT - \\Magnitude', newMagnitude);
        xelib.SetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost', newCost);
    };

    return {
        load: {
            signature: 'ALCH',
            filter: record => locals.useThief
        },
        patch: record => {
            removeMagicSchool(record, patchFile);

            if (!isExcluded(record)) {
                xelib.GetElements(record, 'Effects').forEach(effect => makePotionEffectGradual(effect));
            }
        }
    };
}
