import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import neo4j from "neo4j-driver"
import { Neo4jAdapter } from "@next-auth/neo4j-adapter"
import GoogleProvider from "next-auth/providers/google";

const driver = neo4j.driver(
    // process.env.NEO4J_URI,
    // "neo4j://localhost:7687",
    "bolt://localhost:7687",
    // neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    neo4j.auth.basic("neo4j", "asdfasdf")
)

export const neo4jSession = driver.session()

export const authOptions = {
    adapter: Neo4jAdapter(neo4jSession),
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile"
                }
            },
        }),
        // ...add more providers here
    ],
    secret: process.env.SECRET,
}

export default NextAuth(authOptions)