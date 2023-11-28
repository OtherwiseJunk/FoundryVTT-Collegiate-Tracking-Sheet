import { CollegiateTrackingSheetData } from './schemas/collegiate-tracking-sheet-schema.js'
import { CollegiateTrackingSheet } from './scripts/collegiate-tracking-sheet.js';
Hooks.on("init", () => {
    Object.assign(CONFIG.Actor.dataModels, {
        "collegiate-tracking-sheet.trackingSheet": CollegiateTrackingSheetData
    })
    DocumentSheetConfig.registerSheet(Actor, "collegiate-tracking-sheet", CollegiateTrackingSheet, {
        types: ["collegiate-tracking-sheet.trackingSheet"],
        makeDefault: true
    })
})
