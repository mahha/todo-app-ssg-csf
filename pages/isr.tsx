import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage, GetStaticProps } from 'next'

import { Layout } from '../components/Layout'
import { supabase } from '../utils/supabase'
import { Task, Notice } from '../types/types'

export const getStaticProps: GetStaticProps = async () => {
    console.log('getStaticProps/isr incoked')

    const { data: tasks } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

    const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: true })

    return {
        props: { tasks, notices }, revalidate: 5,
    }
}

type StaticProps = {
    tasks: Task[]
    notices: Notice[]
}

const Isr : NextPage<StaticProps> = ({ tasks, notices }) => {
    const router = useRouter()
    return (
        <Layout title="ISR">
            <p className="mb-3 text-indigo-500">ISR</p>
            <ul className="mb-3">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <p className="text-lg font-extrabold">{task.title}</p>
                    </li>
                ))}
            </ul>
            <ul className="mb-3">
                {notices.map((notice) => (
                    <li key={notice.id}>
                        <p className="text-lg font-extrabold">{notice.content}</p>
                    </li>
                ))}
            </ul>
            <Link href="/ssr" prefetch={false} className="my-3 text-xs">
                Link to SSR
            </Link>
            <button className="mb-3 text-xs border px-2 py-2 rounded bg-blue-500 text-white cursor-pointer hover:bg-gray-200" onClick={() => router.push('/ssr')}>
                Return to SSR
            </button>
        </Layout>
    )
}


export default Isr