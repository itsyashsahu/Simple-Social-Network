// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { neo4jSession } from "./auth/[[...nextauth]]"


export default async function handler(req, res) {
    const db = neo4jSession;
    const result = await db.run(`Match (u:User) return u`)
    // result.records.map(i=>i.get('u').properties)
    console.log("🚀users ", result.records.map(i => i.get('u').properties))

    res.status(200).json({ name: 'John Doe' })
}
