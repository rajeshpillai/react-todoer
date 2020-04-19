import React, {useContext} from 'react';
import TodoContext from './todo-context';

const SubTask = ({subTasks}) => {
  const {onDeleteSubtask} = useContext(TodoContext);
  let ui = <small className="text-muted">no subtasks! </small>;
  
  if (subTasks.length > 0) {
    ui = subTasks.map((st) => {
      let cls = st.completed ? "completed" : "";
      return (
        <li className="d-flex justify-content-start">
          <span class="round checkbox  ml-2">
            <input type="checkbox" checked={st.completed}/>
            <label for="checkbox"></label>
          </span>
          <div 
            className={`subtask-title flex-grow-1 ${cls}`}>{st.title}</div>
          <button className="btn btn-small delete-subtask" 
            onClick={onDeleteSubtask.bind(null, st.id)}>
            <i className="fas fa-times"></i>
          </button>
        </li> 
      );
    })
  }
  
  return <ul className="subtask-items">{ui}</ul>;
}

export default SubTask;