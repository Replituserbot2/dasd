import { isAuthed } from '@/lib/auth'
import { getContent } from '@/lib/store'
import LoginForm from './login-form'
import DashboardClient from './dashboard-client'

export default async function AdminDashboardPage() {
  const authed = await isAuthed()
  if (!authed) {
    return <LoginForm />
  }
  const content = await getContent()
  return <DashboardClient initialContent={content} />
}
