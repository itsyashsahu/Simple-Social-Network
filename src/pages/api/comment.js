// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth";
import { authOptions, neo4jSession } from "./auth/[[...nextauth]]";
import { nanoid } from 'nanoid';



export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions)
    if (session) {
        console.log("🚀 ~ handler ~ session:", session)
        // const { userId, content } = req.body;
        const unique_id = nanoid(8)
        const db = neo4jSession;
        const userId = session.user.email;
        // const blogId = "Nic2dLSQ";
        const blogId = "4HO174AR"; //Blog 02

        const now = new Date().toISOString();
        const commentText = "Comment on blog02 by user 02 itsyash"

        const result = await db.run(
            `MATCH (u:User {email: $userId})
            MATCH (b:Blog {id: $blogId})
            CREATE (u)-[:COMMENTED {comment: $commentText, time: $now}]->(b)
            RETURN u, b`,
            { userId, blogId, commentText, now }
        );
        console.log("🚀 ~ handler ~ result:", result)

        // const createdComment = {
        //     user: result.records[0].get('u').properties,
        //     blog: result.records[0].get('b').properties,
        //     comment: commentText,
        //     time: now,
        // };
        // console.log("🚀 ~ handler ~ createdComment:", createdComment)

        // res.status(201).json({ blog: createdBlog });
        res.status(201).json({ blog: "createdBlog" });
    } else {
        res.status(404).json({ errorMessage: "Please login first" });
    }
}
