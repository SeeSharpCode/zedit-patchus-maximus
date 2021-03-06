/* eslint no-unused-vars: off */
/* global xelib, fh, patcherUrl, patcherPath */

// TODO export everything from the patchers folder
import globPatcher from './src/patchers/globPatcher';
import cobjPatcher from './src/patchers/cobjPatcher';
import gmstPatcher from './src/patchers/gmstPatcher';
import mgefPatcher from './src/patchers/mgefPatcher';
import npcPatcher from './src/patchers/npcPatcher';
import racePatcher from './src/patchers/racePatcher';
import spellPatcher from './src/patchers/spellPatcher';
import enchPatcher from './src/patchers/enchPatcher';
import alchPatcher from './src/patchers/alchPatcher';
import ingrPatcher from './src/patchers/ingrPatcher';
import bookPatcher from './src/patchers/bookPatcher';
import settingsController from './src/controllers/settingsController';

const buildReferenceMaps = locals => {
  const signaturesToMap = ['MISC', 'KYWD', 'PERK', 'GLOB', 'SPEL', 'ENCH', 'SCRL', 'LVLI', 'COBJ'];
  signaturesToMap.forEach(sig => {
    const records = xelib.GetRecords(0, sig, false);
    locals[sig] = records.reduce((obj, rec) => {
      const edid = xelib.EditorID(rec);
      if (edid) obj[edid] = xelib.GetHexFormID(rec);
      return obj;
    }, {});
  });
};

const detectPerMaModules = (helpers, locals) => {
  const perMaFileNamePrefix = 'PerkusMaximus_';
  const perMaModules = ['Mage', 'Warrior', 'Thief'];

  perMaModules.forEach(module => {
    const moduleFileName = `${perMaFileNamePrefix}${module}.esp`;
    const isLoaded = xelib.GetLoadedFileNames().find(fileName => fileName === moduleFileName);

    if (isLoaded) {
      locals[`use${module}`] = true;
    } else {
      helpers.logMessage(`Warning: ${module} module not detected. ${module} changes will not be made.`);
    }
  });
};

/* eslint no-undef: off */
registerPatcher({
  /* eslint object-shorthand: off */
  info: info,
  gameModes: [xelib.gmTES5, xelib.gmSSE],
  settings: {
    label: 'Patchus Maximus',
    templateUrl: `${patcherUrl}/partials/settings.html`,
    defaultSettings: {
      alchemy: {
        excludedEffects: ['AlchInvisibillity', 'AlchCurePoison', 'AlchWaterbreathing', 'AlchRestoreMagickaAll',
          'AlchRestoreHealthAll', 'AlchRestoreStaminaAll', 'AlchParalysis', 'AbGhostPotionEffect', 'dunSleepingTreeSlowAlch',
          'AlchUnknown', 'DA16TorporMagicEffect', 'MS12WhitePhialEffect', 'FrostbiteVenomFFSelf'],
        excludedPotionNames: ['Falmer Blood Elixir', 'Ice Wraith Essence', 'Kordir\'s Skooma', 'Soul Husk Extract',
          'Stallion\'s Potion', 'Lotus Extract', 'Ice Wraith Bane', 'Nightshade Extract'],
      },
      crafting: {
        disableStaffRecipeExclusions: ['ACX', 'Unenchanted'],
      },
      gameSettings: {
        fArmorScalingFactor: 0.1,
        fMaxArmorRating: 90.0,
        fArmorRatingMax: 1.75,
        fArmorRatingPCMax: 1.4,
      },
      npc: {
        startingSpells: true,
        excludedRaceEditorIDs: ['ChickenRace', 'SprigganRace'],
      },
      race: {
        excludedEditorIDs: ['ManakinRace'],
      },
    },
    controller: settingsController,
  },
  requiredFiles: ['PerkusMaximus_Master.esp'],
  execute: (patchFile, helpers, settings, locals) => ({
    initialize: () => {
      buildReferenceMaps(locals);
      detectPerMaModules(helpers, locals);

      locals.playerFormID = '00000007';
      locals.playerRefFormID = '00000014';
    },
    process: [
      // globPatcher(helpers, locals),
      // gmstPatcher(helpers, locals, settings),
      // cobjPatcher(patchFile, helpers, locals, settings),
      // mgefPatcher(helpers, locals),
      // npcPatcher(helpers, locals, settings),
      // racePatcher(locals, settings),
      // spellPatcher(patchFile, locals),
      // enchPatcher(patchFile, locals),
      alchPatcher(patchFile, locals, settings),
      // ingrPatcher(patchFile, locals),
      // bookPatcher(patchFile, locals, helpers),
    ],
  }),
});
