// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth";
import { authOptions, neo4jSession } from "./auth/[[...nextauth]]";
import { nanoid } from 'nanoid';

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions)
    if (session) {
        console.log("🚀 ~ handler ~ session:", session)

        // const { userId, content } = req.body;
        const userId = session.user.email;
        const content = "Blog 02"
        const db = neo4jSession;
        const unique_id = nanoid(8)


        const result = await db.run(
            `MATCH (u:User {email: $userId})
            CREATE (b:Blog { content: $content,id: $unique_id })
            CREATE (u)-[:CREATED]->(b)
            RETURN b`,
            { userId, content, unique_id }
        );

        const createdBlog = result.records[0].get('b').properties;
        console.log("🚀 ~ handler ~ createdBlog:", createdBlog)

        res.status(201).json({ blog: createdBlog });

    } else {
        res.status(404).json({ errorMessage: "Please login first" });
    }
}
