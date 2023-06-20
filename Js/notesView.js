export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="sidebar">
                <button class="add" type="button">Add Note</button>
                <div class="list"></div>
            </div>
            <div class="preview">
                <input class="title" type="text" placeholder="New Note...">
                <textarea class="body" >Write Note...</textarea>
            </div>
        `;

        const addBtn = this.root.querySelector(".add");
        const titleInput = this.root.querySelector(".title");
        const bodyInput = this.root.querySelector(".body");

        addBtn.addEventListener("click", () => {

            this.onNoteAdd();

        });

        [titleInput, bodyInput].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = titleInput.value.trim();
                const updatedBody = bodyInput.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);

    }

    createListItemHtml(id, title, body, updated) {
        const maxBodyLength = 60;

        return `
            <div class="list-item" data-note-id="${id}">
                <div class="small-title">${title}</div>
                <div class="small-body">
                    ${body.substring(0, maxBodyLength)}
                    ${body.length > maxBodyLength ? "..." : ""}
                </div>
                <div class="small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
    `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".list");

        // Empty List
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this.createListItemHtml(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Select Notes Event
        notesListContainer.querySelectorAll(".list-item").forEach(item => {
            item.addEventListener("click", () => {
                this.onNoteSelect(item.dataset.noteId);
            });

            item.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(item.dataset.noteId)
                }

            });

        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".title").value = note.title;
        this.root.querySelector(".body").value = note.body;

        this.root.querySelectorAll(".list-item").forEach(item => {
            item.classList.remove(".list-item-active");
        });

        this.root.querySelector(`.list-item[data-note-id="${note.id}"]`).classList.add("list-item-active");

    }

    updateNotePreviewVisibility(v) {
        this.root.querySelector(".preview").style.visibility = v ? "visible" : "hidden";
    }
}