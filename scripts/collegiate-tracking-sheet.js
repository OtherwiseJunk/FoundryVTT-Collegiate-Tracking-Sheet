export class CollegiateTrackingSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html",
            width: 800,
            height: 750
            // tabs: [{navSelector: "cssClass", contentSelector: "cssClass", initial: "initialTabName" }]
        });
    }
    get template() {
        return "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html";
    }

    _prepareCharacterData(actorData) {
        if (actorData.type !== 'collegiate-tracking-sheet.trackingSheet') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;
    }

    getData() {
        const context = super.getData();

        context.system = this.actor.system;
        context.flags = this.actor.flags;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.relationship-create').click(async (event) => {
            const relationships = this.actor.toObject().system.relationships;
            relationships.push(this.createEmptyRelationship());
            await this.actor.update({ "system.relationships": relationships });
            console.log(this.actor.system.relationships);
        });
        html.find('.relationship-edit').click((event) => {
            console.log(event);
            const relationshipRow = $(event.currentTarget).parents(".relationship-row");
            const relationshipId = relationshipRow.data("relationshipId").split('.')[1];
            this.displayRelationshipDialog(this.actor, relationshipId);
        });
        html.find('.relationship-delete').click(async (event) => {
            let relationships = this.actor.toObject().system.relationships;

            const relationshipRow = $(event.currentTarget).parents(".relationship-row");
            const relationshipId = relationshipRow.data("relationshipId").split('.')[1];
            relationships.splice(relationshipId, 1);

            await this.actor.update({ "system.relationships": relationships });
            relationshipRow.slideUp(200, () => this.render(false));
        });
    }

    displayRelationshipDialog(actor, relationshipId) {
        const relationships = this.actor.toObject().system.relationships;
        const relationship = relationships[relationshipId];
        const dialogTemplate = this.generateRelationshipDialogTemplate(relationship);

        new Dialog({
            title: `Edit Relationship`,
            content: dialogTemplate,
            data: relationship,
            buttons: {
                save: {
                    label: 'Save',
                    callback: async (html) => {
                        const formElement = html[0].querySelector('form');
                        const formData = new FormDataExtended(formElement).object;
                        const editedRelationship = this.createRelationshipFromEditForm(formData);
                        relationships[relationshipId] = editedRelationship;
                        await actor.update({ "system.relationships": relationships });
                        ui.notifications.warn("Saved Relationship Changes!")
                    }
                },
                discard: {
                    label: 'Discard',
                    callback: () => { ui.notifications.info("Discarded Relationship Changes!") }
                }
            },
            default: "discard"
        }).render(true);
    }

    generateRelationshipDialogTemplate(relationship) {
        console.log(`Generating relationship template for item: ${JSON.stringify(relationship)}`);
        return `
        <script>
            var imageElement = document.getElementById("COLLEGIATE.image")
            function updateImageUrl(newUrl){
                imageElement.src = newUrl;
            }
        </script>
        <img id="COLLEGIATE.image" class="profile-img" ; src="${relationship.image}" title="{{relationship.name}}" height="120" />
        <form>
            <div>
                <label for="COLLEGIATE.name">Name</label>
                <input id="COLLEGIATE.name" name="name" type="text" value="${relationship.name}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.imageURL">Image Url</label>
                <input id="COLLEGIATE.imageURL" name="img" type="text" value="${relationship.image}" data-dtype="String" onChange="updateImageUrl(this.value)"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">Points</label>
                <input id="COLLEGIATE.points" name="points" type="text" value="${relationship.points}" data-dtype="Number"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">Relationship Type</label>
                <input id="COLLEGIATE.points" name="type" type="text" value="${relationship.relationshipType}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">Relationship Effect</label>
                <input id="COLLEGIATE.points" name="effect" type="text" value="${relationship.relationshipEffect}" data-dtype="String"/>
            </div>
        </form>
        `;
    }

    createEmptyRelationship() {
        return {
            image: 'https://cacheblasters.nyc3.cdn.digitaloceanspaces.com/CollegiateTrackingSheet/unknown%20person%20image.jpg',
            name: 'New Relationship',
            points: 0,
            relationshipType: '',
            inspiration: false,
            relationshipEffect: ''
        };
    }

    createRelationshipFromEditForm(formData) {
        return {
            image: formData.img,
            name: formData.name,
            points: formData.points,
            relationshipType: formData.type,
            inspiration: false,
            relationshipEffect: formData.effect
        };
    }
}
