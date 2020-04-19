import  React,{useState, useEffect, useContext} from 'react';
import TodoContext from  './todo-context';


const emptyTodo = {
  id: undefined,
  title: "",
  completed: false
}

// TodoForm
const TodoForm = ({todo, isLoading}) => {
  const [newTodo, setTodo] = useState(emptyTodo);
  
  const {onFormSubmit, onEditCancel} = useContext(TodoContext);
  
  const onSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(newTodo);
  }
  
  // Run this effect if the todo changes
  useEffect(() => {
    setTodo(todo);
  }, [todo.id])
  
  const onChange = (e) => {
    setTodo({...newTodo, title: e.target.value});
  }
  
  const onCancel = (e) => {
    setTodo({...emptyTodo});
    onEditCancel();
  }
  
  return (
    <div className = "form">
      <form onSubmit={onSubmit}>
        <input type="text" className="col-7"
          onChange={onChange}  value={newTodo.title}
          placeholder="What do you want to do today?" />
        <button type="submit" className="btn btn-primary ml-2">submit</button>
        <button type="button" onClick={onCancel} 
          className="btn btn-secondary ml-2" >cancel</button>
        <div className={isLoading ? "loader loading" : "no-loader"}> </div>
      </form>
    </div>
  )
}

export default TodoForm;