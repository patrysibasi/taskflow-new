import type { Task } from "../../types/task"

import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  onTaskDeleted: (taskId: number) => void
  onTaskUpdated: (task: Task) => void
}

function TaskList({
  tasks,
  onTaskDeleted,
  onTaskUpdated
}: TaskListProps) {

  return ( 
    <div> 
      {tasks.map((task) =>
        <TaskItem
          key={task.id}
          task={task}
          onTaskDeleted={onTaskDeleted}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </div> 
  ) 
}
export default TaskList

