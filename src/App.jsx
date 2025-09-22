// src/App.jsx
import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import outputs from '../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';

Amplify.configure(outputs);

const client = generateClient();

export default function App() {
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    const result = await client.models.Note.list();
    setNotes(result.data);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const content = form.get("content");
    await client.models.Note.create({ content });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote(id) {
    await client.models.Note.delete({ id });
    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Notes App</h1>
          <form onSubmit={createNote}>
            <input name="content" placeholder="Write a note..." />
            <button type="submit">Add</button>
          </form>

          <ul>
            {notes.map(note => (
              <li key={note.id}>
                {note.content}
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
