"use client";

import { useState } from "react";

interface TodoItemType {
  id: number;
  text: string;
  completed: boolean;
}

// 👶 3. Child Component: Displays a single todo item
// Receives its own data and the functions to change its state from the grandparent.
// Styled with Tailwind CSS utility classes.
function TodoItem({ item, onToggle, onDelete }: any) {
  return (
    <li className="flex items-center justify-between p-2 my-1 bg-gray-100 rounded-lg shadow-sm">
      <span
        onClick={() => onToggle(item.id)}
        className={`cursor-pointer flex-grow ${
          item.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {item.text}
      </span>
      <button
        onClick={() => onDelete(item.id, item.text)}
        className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
      >
        Delete
      </button>
    </li>
  );
}

// 👨‍🦰 2. Parent Component: Renders the list of todos
// Acts as a middle-man, passing props from Grandparent to Child.
function TodoList({ items, onToggle, onDelete }: any) {
  return (
    <ul className="list-none p-0 mt-4">
      {items.length > 0 ? (
        items.map((item: TodoItemType) => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">
          No tasks yet. Add one above!
        </p>
      )}
    </ul>
  );
}

const Page = () => {
  // 👵 1. Grandparent Component: Holds all state and logic
  const [items, setItems] = useState<TodoItemType[]>([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Walk the dog", completed: true },
    { id: 3, text: "Read a book", completed: false },
  ]);
  const [inputText, setInputText] = useState("");

  // All functions that modify state live here
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newItem = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };
    setItems([...items, newItem]);
    setInputText("");
  };

  const handleToggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id: number, name: string) => {
    console.log(name);
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto my-10 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        My Tasks
      </h1>

      <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <button
          type="submit"
          className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Add
        </button>
      </form>

      <hr className="border-gray-200" />

      <TodoList
        items={items}
        onToggle={handleToggleItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default Page;
