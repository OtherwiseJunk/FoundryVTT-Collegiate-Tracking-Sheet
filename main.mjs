import { CollegiateTrackingSheetData } from './schemas/collegiate-tracking-sheet-schema.js'
import { CollegiateTrackingSheet } from './scripts/collegiate-tracking-sheet.js';
Hooks.on("init", () => {
    console.log('COLLEGIATE TRACKING SHEET| running INIT collegiate script!');
    Object.assign(CONFIG.Actor.dataModels, {
        "collegiate-tracking-sheet.trackingSheet": CollegiateTrackingSheetData
    })
    console.log(CONFIG.Actor.dataModels);
    DocumentSheetConfig.registerSheet(Actor, "collegiate-tracking-sheet", CollegiateTrackingSheet, {
        types: ["collegiate-tracking-sheet.trackingSheet"],
        makeDefault: true
    })
    console.log('COLLEGIATE TRACKING SHEET| Finished running INIT collegiate script!');
})
