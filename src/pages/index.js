import { useSession, signIn, signOut } from "next-auth/react"
export default function Home() {
  const { data: session } = useSession()
  console.log("🚀 ~ session:", session)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className="" onClick={() => signIn('google')}>Signin</button>
      <button className="" onClick={() => signOut('google')}>signout</button>
    </main>
  )
}
