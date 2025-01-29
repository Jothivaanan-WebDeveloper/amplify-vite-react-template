// @ts-nocheck

import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from '@aws-amplify/api';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['Item']>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe(); // Cleanup to prevent memory leaks
  }, []);

  function createTodo() {
    const content = window.prompt('What would you like to do?');
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/gen2/start/quickstart/">
              Review next step of this tutorial.
            </a>
          </div>
          <div>
            <button onClick={signOut}>Sign out</button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
