import NotesView from "./notesView.js";
import NotesApi from "./notesApi.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this.handlers());


        this.refreshNotes();
    }

    refreshNotes() {
        const notes = NotesApi.getAllNotes();

        this.setNotes(notes);

        if (notes.length > 0) {
            this.setActiveNotes(notes[0]);
        }
    }

    setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }
    setActiveNotes(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this.setActiveNotes(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: 'New Note',
                    body: 'Take Note...'
                };

                NotesApi.saveNotes(newNote);
                this.refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesApi.saveNotes({
                    id: this.activeNote.id,
                    title: title,
                    body: body
                });

                this.refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesApi.deleteNode(noteId);
                this.refreshNotes();
            },
        };
    }
}