export class CollegiateTrackingSheet extends ActorSheet {
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html",
            width: 800,
            height: 550
            // tabs: [{navSelector: "cssClass", contentSelector: "cssClass", initial: "initialTabName" }]
        });
    }
    get template(){
        return "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html";
    }
}
