import React, {useState, useRef, useEffect, useContext, useRect} from 'react';

import TodoContext from './todo-context';
import SubTask from './subtask';

// Single Todo Component
const Todo = ({todo, subTasks}) => {
  const {
    onTodoDelete, 
    onTodoEdit, 
    onToggleComplete, onAddSubtask} = useContext(TodoContext);
  
  const [expanded, toggleExpanded] = useState(true);
  const [isDeleting, setDeleted] = useState(false);
  
  const subtaskInput = useRef(); //React.createRef();
  
  const taskItemRef = useRef();

  const onDelete = (todoId) => {
    setDeleted(true);
    //onTodoDelete(todoId);
    
  }
  
  // Since animation event happens outside react cycle we have to
  // grab the attributes from DOM
  var removeAnim = (e) => {
    let id = taskItemRef.current.getAttribute("id");
    onTodoDelete(id);
  }
  
  // remove animation effect
  useEffect(() => {
    if (isDeleting) {
      taskItemRef.current.classList.add('animated', 'hinge')
    }
    return () => {
      taskItemRef.current.addEventListener('animationend', removeAnim); 
    }
  }, [isDeleting]); 
  
  const onEdit = (todoId) => {
    onTodoEdit(todoId);
  }
  
  const toggleComplete = (todoId) => {
    onToggleComplete(todoId);
  }
  
  const toggleSubTasks = (taskId) => {
    toggleExpanded(b=> !b);
  }
  
  var subtaskForm = () => {
    return (
      <div>
        <form onSubmit={addSubTask.bind(null, todo.id)}>
          <input type="text" ref={subtaskInput} />
           <button type="button"
             className="float-right btn" >
             <i className="fas fa-plus"></i>
          </button>
        </form>
      </div>
    )
  }
  
  
  const addSubTask = (taskId, e) => {
    e.preventDefault();
    onAddSubtask(taskId, subtaskInput.current.value);
    subtaskInput.current.value = "";
  }
  
  
  let expandedIcon = expanded ? "▼" : "▶"
  let cls = todo.completed ? "completed" : "";
  return (
    <div ref={taskItemRef} id={todo.id}
       className ={`row align-middle  todo-item d-flex justify-content-between`}>
      <div>
        <span  className="expand-task"
          onClick={toggleSubTasks.bind(this, todo.id)}>{expandedIcon}</span>
        <span class="round  ml-2 mr-2">
          <input type="checkbox" id="checkbox" checked={todo.completed}/>
          <label for="checkbox"></label>
        </span>
        <span title="double click to toggle complete "
          onDoubleClick={()=>toggleComplete(todo.id)} 
          className={`todo-title ml-2 ${cls}`}>{todo.title}
        </span>
      </div>
      
      <div className="d-flex">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-sm text-danger " 
            onClick={()=> onDelete(todo.id)}>
            <i className ="fas fa-trash-alt"></i></button>
          <button type="button" className= "btn btn-sm"
            onClick={()=> onEdit(todo.id)}>
            <i className ="fas fa-edit"></i>
          </button>
          <button type="button" className="btn btn-sm">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      
      { expanded && <div className="container sub-tasks">
        <span className="header">Sub Tasks</span>
          <div className="form d-flex">
            {subtaskForm()}
          </div>
          <SubTask subTasks= {subTasks} />
      </div>
      }
    </div>
  );
}
  
export default Todo;