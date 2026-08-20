import type { Task } from "../../types/task"
import type { User } from "../../types/user"

import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  users: User[]
  onTaskDeleted: (taskId: number) => void
  onTaskUpdated: (task: Task) => void
}

function TaskList({
  tasks,
  users,
  onTaskDeleted,
  onTaskUpdated
}: TaskListProps) {

  return ( 
    <div> 
      {tasks.map((task) => { 
        const user = users.find( 
          (user) => user.id === task.user_id 
        ) 
        
        return ( 
          <TaskItem 
            key={task.id} 
            task={task} 
            userName={ 
              user?.name ?? "Nieznany użytkownik" } 
              onTaskDeleted={onTaskDeleted} 
              onTaskUpdated={onTaskUpdated} 
          /> 
        ) 
      })} 
    </div> 
  ) 
}
export default TaskList

