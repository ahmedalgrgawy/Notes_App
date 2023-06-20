export default class NotesApi {

    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesApp-Notes") || '[]')

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });

    }


    static saveNotes(note) {

        const notes = NotesApi.getAllNotes();
        const existing = notes.find(newnote => newnote.id == note.id)

        if (existing) {

            existing.title = note.title;
            existing.body = note.body;
            existing.updated = new Date().toISOString();


        } else {

            note.id = Math.floor(Math.random() * 1000000);
            note.updated = new Date().toISOString();
            notes.push(note);

        }

        localStorage.setItem('notesApp-Notes', JSON.stringify(notes));

    }


    static deleteNode(id) {

        const notes = NotesApi.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem('notesApp-Notes', JSON.stringify(newNotes));

    }
}