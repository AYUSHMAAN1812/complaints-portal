// backend/src/api/suggestions/route.js
import { headers } from "next/headers";
import admin from "firebase-admin";
import { Resend } from 'resend';
import dotenv from 'dotenv';
// Use the shared Firebase initialization and Resend setup

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); 
const SUGGESTION_RECIPIENT = "ayushmaan2005dav@gmail.com"; // CHANGE THIS TO THE CORRECT RECIPIENT

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

// 🔹 Securely load Firebase credentials from environment variables
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

export async function POST(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    let reportData;
    
    try {
        reportData = await request.json(); 
        const { reporterName, reporterEmail, suggestion } = reportData;
        console.log("Suggestion Data Read:", reportData);
        // 1. Authentication Check (Ensure user is logged in)
        // const reqHeaders = headers();
        const authHeader = request.headers.get("Authorization");
        console.log(authHeader);
        const idToken = authHeader ? authHeader.split("Bearer ")[1] : null;

        if (!idToken) {
             return new Response(JSON.stringify({ error: "Unauthorized: Missing token." }), {
                status: 401,
                headers: new Headers(corsHeaders),
            });
        }

        await admin.auth().verifyIdToken(idToken);
        console.log("Authenticated Suggestion User:", reporterEmail);
        
        // 2. Save data to Firestore (Replicating your original local save)
        await admin.firestore().collection('issues_and_suggestions').add({
            ...reportData,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Send Email using Resend
        const emailSubject = `[SUGGESTION] New Improvement Idea from ${reporterName}`;
        const emailHtml = `
            <h2>New Suggestion for Improvement</h2>
            <p><strong>Submitted By:</strong> ${reporterName} (${reporterEmail})</p>
            <h3>Suggestion/Report:</h3>
            <p>${suggestion.replace(/\n/g, '<br>')}</p>
        `;

        await resend.emails.send({
            from: 'IITH Complaints <onboarding@resend.dev>', 
            to: SUGGESTION_RECIPIENT,
            reply_to: reporterEmail, 
            subject: emailSubject,
            html: emailHtml,
        });

        console.log("✅ Suggestion email sent successfully to:", SUGGESTION_RECIPIENT);

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Suggestion submitted and email sent successfully.' 
        }), {
            status: 200,
            headers: new Headers(corsHeaders),
        });

    } catch (error) {
        console.error("🔴 Submission/Email Error:", error);
        
        return new Response(JSON.stringify({ error: "Failed to process suggestion or send email." }), {
            status: 500,
            headers: new Headers(corsHeaders),
        });
    }
}