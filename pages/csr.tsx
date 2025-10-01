import { useEffect, useState } from "react"
import { NextPage } from "next"
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { supabase } from '../utils/supabase'
import { Task, Notice } from '../types/types'

const Csr: NextPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [notices, setNotices] = useState<Notice[]>([])

    // CSRの場合はuseEffectを使用してデータを取得する
    useEffect(() => {
        // Supabaseからデータを取得し、tasksとnoticesに格納する
        const getTasks = async () => {
            const { data: tasks } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: true })
            setTasks(tasks as Task[])
        }

        const getNotices = async () => {
            const { data: notices } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: true })
            setNotices(notices as Notice[])
        }
        getTasks()
        getNotices()
    }, [])

    return (
        <Layout title="CSR">
            <p className="mb-3 text-red-500">SSG + CSF</p>
            <ul className="mb-3">
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
            <ul className="mb-3">
                {notices.map((notice) => (
                    <li key={notice.id}>{notice.content}</li>
                ))}
            </ul>
            <Link href="/ssr" prefetch={false} className="my-3 text-xs">Return to SSR</Link>
            <Link href="/ssg" prefetch={false} className="my-3 text-xs">Return to SSG</Link>
            <Link href="/isr" prefetch={false} className="my-3 text-xs">Return to ISR</Link>
        </Layout>
    )
}

export default Csr