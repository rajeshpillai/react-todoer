import React, {useState, useEffect} from 'react';
import './App.css';

import TodoForm from './features/todo-form';
import TodoList from './features/todo-list';
import TodoContext from './features/todo-context';

const TODOS_API = "https://jsonplaceholder.typicode.com/todos/";


const emptyTodo = {
  id: undefined,
  title: "",
  completed: false
}

// TODO SHAPE: {id, title, completed, userId, subTasks:[]}
const default_tasks = [
  {id: 1, title: "Task 1", completed: true},
  {id: 2, title: "Task 2", completed: false},
  {id: 3, title: "Task 3", completed: false},
  {id: 4, title: "Task 4", completed: false},
];

const default_subtasks = [
  {id: 1, todoId: 1, title: "Task 1.1", completed: true},
  {id: 2, todoId: 1, title: "Task 1.2", completed: false},
  {id: 3, todoId: 2, title: "Task 2.1", completed: false},
  {id: 4, todoId: 2, title: "Task 2.2", completed: false},
];

function App() {
  const [todos, setTodos] = useState(default_tasks); // NOTE: Remove default_tasks for server data
  const [subTasks, setSubTasks] = useState(default_subtasks);
  const [todo, setTodo] = useState(emptyTodo);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    if (todos.length > 0) return;
    fetch(TODOS_API)
      .then(response => response.json())
      .then(data => {
        setTodos(data);
     })
  },[]);
  
  const onTodoSubmit = (changedTodo) => {
    let emptyTodo = {};
    
    setLoading(true);
    
    if (changedTodo.id == undefined) {
      emptyTodo.id = +new Date();
      emptyTodo.completed = false;
      emptyTodo.title = changedTodo.title;
      // Make API call
      fetch(TODOS_API, {
        method: 'POST',
        body: JSON.stringify(emptyTodo),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(todo => {
        console.log("CREATE TODO: ", todo)
        setTodos([emptyTodo, ...todos]);
      })
      .finally(() => {
        console.log('finally');
        setLoading(false);
      })
      
    } else {
      let _todos = todos.map((t) => {
        if (t.id == changedTodo.id) {
          t.title = changedTodo.title;
          emptyTodo = t;
        }
        return t;
      });
      
      // Make API call
      fetch(TODOS_API, {
        method: 'PUT',
        body: JSON.stringify(emptyTodo),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(todo => {
        console.log("UPDATED TODO: ", todo)
        setTodos(_todos);
      })
      .finally(() => {
        console.log('finally');
        setLoading(false);
      })

    }
  }
  
  const onTodoDelete = (todoId) => {
    if (window.confirm("Are you sure?")) {
      fetch(`TODOS_API${todoId}`, {
        method: 'DELETE'
      })
      .then(res => res.text()) // or res.json()
      .then(res => {
          let remainingTodos = todos.filter(t => t.id != todoId);
          setTodos([...remainingTodos]);  
      });
    }
  }
  
  const onTodoEdit = (todoId) => {
    let todo = todos.find(t => {
      return (t.id == todoId );
    });
    setTodo(todo);
  }
  
  const onEditCancel= () => {
    setTodo(emptyTodo);  
  }
  
  const onToggleComplete = (todoId) => {
    let _tasks = todos.map((t) => {
      if (t.id == todoId) {
        t.completed = !t.completed;
      }
      return t;
    });
    setTodos(_tasks);
  }
  
  const onAddSubtask = (todoId, title) => {
    let newSubTask = {
      id: +new Date(),
      todoId: todoId,
      title: title,
      completed: false
    }
    setSubTasks([newSubTask, ...subTasks]);
  }
  
   const onDeleteSubtask = (subTaskId) => {
    if (window.confirm("Are you sure?")) {
      let filtered = subTasks.filter(t => t.id != subTaskId);
      setSubTasks([...filtered]);  
    }
  }
 
  
  const todoProvider = {
    todos,
    subTasks,
    onFormSubmit: onTodoSubmit,
    onTodoDelete,
    onTodoEdit,
    onEditCancel,
    onToggleComplete,
    onAddSubtask,
    onDeleteSubtask
  }

  
  return(
    <div className="container app">
      <TodoContext.Provider value={todoProvider}>
        <h2 className="text-primary app-title">Todoer</h2>
        <span className="text-muted">
          (learn how to create this app)</span>
        <br/>
        <hr/>
        <TodoForm todo={todo}  isLoading={isLoading}/>
        <TodoList />
        
      </TodoContext.Provider>
    </div>
  )
}

export default App;
