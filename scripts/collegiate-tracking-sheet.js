export class CollegiateTrackingSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "modules/collegiate-tracking-sheet/templates/collegiate-tracking-sheet.html",
            width: 850,
            height: 900
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

    async updateActorValue(actor, valueName, updatedValue) {
        await actor.update({[valueName]: updatedValue});
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.COLLEGIATE-relationship-create').click(async (event) => {
            const relationships = this.actor.toObject().system.relationships;
            relationships.push(this.createEmptyRelationship());
            await this.updateActorValue(this.actor, "system.relationships", relationships);
        });
        html.find('.COLLEGIATE-relationship-edit').click((event) => {
            const relationshipRow = $(event.currentTarget).parents(".COLLEGIATE-relationship-row");
            const relationshipId = relationshipRow.data("relationshipId").split('.')[1];
            this.displayRelationshipDialog(this.actor, relationshipId);
        });
        html.find('.COLLEGIATE-relationship-delete').click(async (event) => {
            const relationships = this.actor.toObject().system.relationships;

            const relationshipRow = $(event.currentTarget).parents(".COLLEGIATE-relationship-row");
            const relationshipId = relationshipRow.data("relationshipId").split('.')[1];
            relationships.splice(relationshipId, 1);

            await this.updateActorValue(this.actor, "system.relationships", relationships);
            relationshipRow.slideUp(200, () => this.render(false));
        });
        html.find('.COLLEGIATE-relationship-inspiration').click(async (event) => {
            const relationships = this.actor.toObject().system.relationships;
            const relationshipRow = $(event.currentTarget).parents(".COLLEGIATE-relationship-row");
            const relationshipId = relationshipRow.data("relationshipId").split('.')[1];
            const relationship = relationships[relationshipId];

            relationships[relationshipId].inspiration = !relationship.inspiration

            await this.updateActorValue(this.actor, "system.relationships", relationships);
        });
        html.find('.COLLEGIATE-exam-create').click(async (event) => {
            const exams = this.actor.toObject().system.exams;
            exams.push(this.createEmptyExam());
            await this.updateActorValue(this.actor, "system.exams", exams);
        });
        html.find('.COLLEGIATE-exam-edit').click((event) => {
            const examRow = $(event.currentTarget).parents(".COLLEGIATE-exam-row");
            const examId = examRow.data("examId").split('.')[1];
            this.displayExamDialog(this.actor, examId);
        });
        html.find('.COLLEGIATE-exam-delete').click(async (event) => {
            const exams = this.actor.toObject().system.exams;

            const examRow = $(event.currentTarget).parents(".COLLEGIATE-exam-row");
            const examId = examRow.data("examId").split('.')[1];
            exams.splice(examId, 1);

            await this.updateActorValue(this.actor, "system.exams", exams);
            relationshipRow.slideUp(200, () => this.render(false));
        });
        html.find('.COLLEGIATE-exam-use-reroll').click(async (event) => {
            const exams = this.actor.toObject().system.exams;
            const examRow = $(event.currentTarget).parents(".COLLEGIATE-exam-row");
            const examId = examRow.data("examId").split('.')[1];
            const exam = exams[examId];

            if (exam.earnedRerolls <= exam.usedRerolls) return;

            exam.usedRerolls++;
            exams[examId] = exam;

            await this.updateActorValue(this.actor, "system.exams", exams);
        });
        html.find('.COLLEGIATE-exam-use-student-dice').click(async (event) => {
            const exams = this.actor.toObject().system.exams;
            const examRow = $(event.currentTarget).parents(".COLLEGIATE-exam-row");
            const examId = examRow.data("examId").split('.')[1];
            const exam = exams[examId];

            if (exam.earnedDice <= exam.usedDice) return;

            exam.usedDice++;
            exams[examId] = exam;

            await this.updateActorValue(this.actor, "system.exams", exams);
        });
        html.find('.COLLEGIATE-long-rest').click(async (event) =>{
            Dialog.confirm({
                title: "Perform Long Rest?",
                content: "Would you like to perform a long reset and reset all uses of Student Dice?",
                yes: () =>{this.performLongRest(this.actor)},
                no: () =>{},
                defaultYes: false
            })
        });
    }

    displayRelationshipDialog(actor, relationshipId) {
        const relationships = this.actor.toObject().system.relationships;
        const relationship = relationships[relationshipId];
        const dialogTemplate = this.generateRelationshipDialogTemplate(relationship);

        new Dialog({
            title: `Edit Relationship`,
            content: dialogTemplate,
            buttons: {
                save: {
                    label: 'Save',
                    callback: (html) => {
                        this.updateRelationshipFromDialog(html, relationships, relationshipId, actor);
                    }
                },
                discard: {
                    label: 'Discard',
                    callback: () => { ui.notifications.warn("Discarded Relationship Changes!") }
                }
            },
            default: "discard"
        }).render(true);
    }

    displayExamDialog(actor, examId) {
        const exams = this.actor.toObject().system.exams;
        const exam = exams[examId];
        const dialogTemplate = this.generateExamDialogTemplate(exam);

        new Dialog({
            title: `Edit Exam Information`,
            content: dialogTemplate,
            buttons: {
                save: {
                    label: 'Save',
                    callback: (html) => {
                        this.updateExamFromDialog(html, exams, examId, actor);
                    }
                },
                discard: {
                    label: 'Discard',
                    callback: () => { ui.notifications.warn("Discarded Relationship Changes!") }
                }
            },
            default: "discard"
        }).render(true);
    }

    generateRelationshipDialogTemplate(relationship) {
        return `
        <script>
            var imageElement = document.getElementById("COLLEGIATE.image")
            function updateImageUrl(newUrl){
                imageElement.src = newUrl;
            }
        </script>
        <div style="text-align: center">
            <img id="COLLEGIATE.image" class="profile-img" ; src="${relationship.image}" title="${relationship.name}" height="120" />
        </div>
        <form>
            <div>
                <label for="COLLEGIATE.name">${game.i18n.localize("COLLEGIATE.relationships.headers.name")}</label>
                <input id="COLLEGIATE.name" name="name" type="text" value="${relationship.name}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.imageURL">${game.i18n.localize("COLLEGIATE.relationships.editForm.imageUrl")}</label>
                <input id="COLLEGIATE.imageURL" name="img" type="text" value="${relationship.image}" data-dtype="String" onChange="updateImageUrl(this.value)"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">${game.i18n.localize("COLLEGIATE.relationships.headers.points")}</label>
                <input id="COLLEGIATE.points" name="points" type="text" value="${relationship.points}" data-dtype="Number"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">${game.i18n.localize("COLLEGIATE.relationships.editForm.relationshipType")}</label>
                <input id="COLLEGIATE.points" name="type" type="text" value="${relationship.relationshipType}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.points">${game.i18n.localize("COLLEGIATE.relationships.headers.relationshipEffect")}</label>
                <input id="COLLEGIATE.points" name="effect" type="text" value="${relationship.relationshipEffect}" data-dtype="String"/>
            </div>
        </form>
        `;
    }

    generateExamDialogTemplate(exam) {
        return `
        <form>
            <div>
                <label for="COLLEGIATE.name">${game.i18n.localize("COLLEGIATE.exams.headers.name")}</label>
                <input id="COLLEGIATE.name" name="name" type="text" value="${exam.name}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.date">${game.i18n.localize("COLLEGIATE.exams.headers.date")}</label>
                <input id="COLLEGIATE.date" name="date" type="text" value="${exam.date}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.usedRerolls">${game.i18n.localize("COLLEGIATE.exams.headers.usedRerolls")}</label>
                <input id="COLLEGIATE.usedRerolls" name="usedRerolls" type="text" value="${exam.usedRerolls}" data-dtype="Number"/>
            </div>
            <div>
                <label for="COLLEGIATE.earnedRerolls">${game.i18n.localize("COLLEGIATE.exams.headers.earnedRerolls")}</label>
                <input id="COLLEGIATE.earnedRerolls" name="earnedRerolls" type="text" value="${exam.earnedRerolls}" data-dtype="String" onChange="updateImageUrl(this.value)"/>
            </div>
            <div>
                <label for="COLLEGIATE.firstAbility">${game.i18n.localize("COLLEGIATE.exams.headers.firstAbility")}</label>
                <input id="COLLEGIATE.firstAbility" name="firstAbility" type="text" value="${exam.firstAbility}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.secondAbility">${game.i18n.localize("COLLEGIATE.exams.headers.secondAbility")}</label>
                <input id="COLLEGIATE.secondAbility" name="secondAbility" type="text" value="${exam.secondAbility}" data-dtype="String"/>
            </div>
            <div>
                <label for="COLLEGIATE.usedDice">${game.i18n.localize("COLLEGIATE.exams.headers.usedDice")}</label>
                <input id="COLLEGIATE.usedDice" name="usedDice" type="text" value="${exam.usedDice}" data-dtype="String"/>
            </div>
            <div>
            <label for="COLLEGIATE.earnedDice">${game.i18n.localize("COLLEGIATE.exams.headers.earnedDice")}</label>
            <input id="COLLEGIATE.earnedDice" name="earnedDice" type="text" value="${exam.earnedDice}" data-dtype="String"/>
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

    async updateRelationshipFromDialog(html, relationships, relationshipId, actor) {
        const formElement = html[0].querySelector('form');
        const formData = new FormDataExtended(formElement).object;
        const editedRelationship = {
            image: formData.img,
            name: formData.name,
            points: formData.points,
            relationshipType: formData.type,
            inspiration: false,
            relationshipEffect: formData.effect
        };
        relationships[relationshipId] = editedRelationship;
        await actor.update({ "system.relationships": relationships });
        ui.notifications.info("Saved Relationship Changes!");
    }

    async updateExamFromDialog(html, exams, examId, actor) {
        const formElement = html[0].querySelector('form');
        const formData = new FormDataExtended(formElement).object;
        const editedExam = {
            name: formData.name,
            date: formData.date,
            earnedRerolls: formData.earnedRerolls,
            usedRerolls: formData.usedRerolls,
            firstAbility: formData.firstAbility,
            secondAbility: formData.secondAbility,
            earnedDice: formData.earnedDice,
            usedDice: formData.usedDice,
        };
        exams[examId] = editedExam;
        await actor.update({ "system.exams": exams });
        ui.notifications.info("Saved Relationship Changes!");
    }

    createEmptyExam() {
        return {
            name: "New Exam",
            date: "",
            earnedRerolls: 0,
            usedRerolls: 0,
            firstAbility: "",
            secondAbility: "",
            earnedDice: 0,
            usedDice: 0,
        };
    }

    performLongRest(actor){
        console.log(actor);
        const exams = actor.toObject().system.exams;
        exams.map(((exam) => exam.usedDice = 0));
        this.updateActorValue(actor, "system.extracurricularOne.diceUsed", false);
        this.updateActorValue(actor, "system.extracurricularTwo.diceUsed", false);
        this.updateActorValue(actor, "system.exams", exams);
    }
}
