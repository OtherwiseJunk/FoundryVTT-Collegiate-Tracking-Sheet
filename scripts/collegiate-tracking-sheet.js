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

    _prepareCharacterData(actorData) {
        if (actorData.type !== 'collegiate-tracking-sheet.trackingSheet') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;
      }

    getData(){
        const context = super.getData();

        context.system = this.actor.system;
        context.flags = this.actor.flags;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.add-relationship').click((event) =>{
            console.log(event);
            console.log('Someone clicked the Add-Relationship button');
        });
    }
}
