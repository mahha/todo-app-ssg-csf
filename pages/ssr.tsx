import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage, GetServerSideProps } from 'next'

import { Layout } from '../components/Layout'
import { supabase } from '../utils/supabase'
import { Task, Notice } from '../types/types'

export const getServerSideProps: GetServerSideProps = async () => {
    console.log('getServerSideProps/ssr incoked')

    const { data: tasks } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

    const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: true })

    return {
        props: { tasks, notices },
    }
}

type StaticProps = {
    tasks: Task[]
    notices: Notice[]
}

const Ssr: NextPage<StaticProps> = ({ tasks, notices }) => {
    const router = useRouter()
    return (
        <Layout title="SSR">
            <p className="mb-3 text-green-500">SSR</p>
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
            <Link href="/ssg" prefetch={false} className="my-3 text-xs">
                    Link to SSG
            </Link>
            <Link href="/isr" prefetch={false} className="mb-3 text-xs">
                    Link to ISR
            </Link>
            <button className="mb-3 text-xs border px-2 py-2 rounded bg-green-500 text-white cursor-pointer hover:bg-gray-200" onClick={() => router.push('/ssg')}>
                Return to SSG
            </button>
            <button className="mb-3 text-xs border px-2 py-2 rounded bg-green-500 text-white cursor-pointer hover:bg-gray-200 " onClick={() => router.push('/isr')}>
                Return to ISR
            </button>
        </Layout>
    )
}

export default Ssr