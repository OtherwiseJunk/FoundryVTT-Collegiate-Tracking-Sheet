export class CollegiateTrackingSheetData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        console.log('COLLEGIATE TRACKING SHEET| Defining sheet schema.')
        return {
            relationships: new fields.ArrayField(new fields.ObjectField()),
            reportCards: new fields.ArrayField(new fields.ObjectField()),
            extracurriculars: new fields.ArrayField(new fields.ObjectField()),
            job: new fields.ObjectField(),

        }
    }
}
