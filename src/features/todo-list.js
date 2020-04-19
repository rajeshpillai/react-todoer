import React, {useContext} from 'react';
import TodoContext from './todo-context';
import Todo from './todo';

const TodoList = () => {
  const {todos, subTasks} = useContext(TodoContext);
  let ui  = todos.map(todo => {
      const relatedTasks =  subTasks.filter((st) => 
                                 st.todoId == todo.id)
      return <Todo key={todo.id} todo ={todo} subTasks={relatedTasks}/>
  });
  
  
  return (
    <div className="container">
      { ui }
    </div>
  )
}

export default TodoList;