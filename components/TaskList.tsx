import { FC } from 'react'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { TaskItem } from './TaskItem'
import { Spinner } from './Spinner'

export const TaskList: FC = () => {
    const { data: tasks, status } = useQueryTasks()
    if (status === 'pending') return <Spinner />
    if (status === 'error') return <p>Error</p>
    return (
        <ul>
            {tasks?.map((task) => (
                <TaskItem key={task.id} id={task.id} title={task.title} />
            ))}
        </ul>
    )
}
