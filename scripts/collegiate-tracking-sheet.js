export class CollegiateTrackingSheet extends ActorSheet {
    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html",
            width: 800,
            height: 750
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

        if (!this.options.editable) return;

        html.find('.relationship-create').click(async (event) =>{
            const relationships = this.actor.toObject().system.relationships;
            relationships.push(this.createEmptyRelationship());
            await this.actor.update({"system.relationships": relationships});
        });
        html.find('.relationship-edit').click((event) =>{
            console.log(event);
            const relationshipRow = $(event.currentTarget).parents(".relationship-row");
            const relationshipId = relationshipRow.data("relationshipId");
            this.displayRelationshipDialog(this.actor.system.relationships[relationshipId]);
        });
    }

    displayRelationshipDialog(relationship){
        if(null === relationship) return;
        const dialogTemplate = this.generateRelationshipDialogTemplate(relationship);

        new Dialog({
            title: `Edit Relationship`,
            content: dialogTemplate,
            buttons: {
                deez:{
                    label: 'test',
                    callback: () =>{}
                },
                nutz:{
                    label: 'buttons',
                    callback: () =>{}
                }
            }
        }).render(true);
    }

    generateRelationshipDialogTemplate(relationship){
        console.log(`Generating relationship template for item: ${JSON.stringify(relationship)}`);
        return `
        <div>
            <img class="profile-img" ; src="${relationship.image}" data-edit="img"
        title="{{relationship.name}}" height="120" />
            <input type="text" value=""/>
        </div>
        `;
    }

    createEmptyRelationship(){
        return {
            image: 'https://cacheblasters.nyc3.cdn.digitaloceanspaces.com/CollegiateTrackingSheet/unknown%20person%20image.jpg',
            name: 'New Relationship',
            points: 0,
            relationshipType: '',
            inspiration: false,
            relationshipEffect: ''
        };
    }
}
