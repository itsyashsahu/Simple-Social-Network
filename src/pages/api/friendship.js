import { getServerSession } from "next-auth";
import { authOptions, neo4jSession } from "./auth/[[...nextauth]]";

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        console.log("🚀 ~ handler ~ session:", session)

        const userId = session.user.email;
        const n = 1;
        const db = neo4jSession;
        console.log("User hitted on friendship with ", n)


        // TODO
        // Need to implement the graph BFS Algorithm to get the desired behavior
        // Will implement if by tomorrow since I have an exam today.


        // MATCH (u:User {id: $userId})-[:COMMENTED]->(:Blog)<-[:COMMENTED]-(f1:User)
        // OPTIONAL MATCH (f1)-[:COMMENTED]->(:Blog)<-[:COMMENTED]-(f2:User)
        // WITH u, f1, f2
        // WHERE f2 <> u AND NOT (f2)-[:COMMENTED]->(:Blog)<-[:COMMENTED]-(u)
        // RETURN f2.id as friendId, COUNT(DISTINCT f1) as level
        // ORDER BY level ASC            
        const result = await db.run(
            `MATCH (user1:User {id: userId1})-[:COMMENTED*2*n]->(user2:User {id: userId2})
            WHERE NOT (user1)-[:COMMENTED]->(user2)
            RETURN user2    
            `,
            { userId, n }
        );
        console.log("🚀 ~ handler ~ result:", result.records)

        const friends = result.records.map(record => ({
            friend: record.get('u2').properties,
            level: record.get('numCommonBlogs').toNumber()
        }));

        res.status(200).json({ friends });

    } else {
        res.status(404).json({ errorMessage: "Please login first" });
    }
}
