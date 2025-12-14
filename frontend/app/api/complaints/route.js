// backend/src/api/complaints/route.js
import { headers } from "next/headers";
import admin from "firebase-admin";
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
// TEMPORARY LOGGING: Check if the key is defined
if (!process.env.RESEND_API_KEY) {
    console.error("❌ CRITICAL: RESEND_API_KEY is not defined in the environment.");
} else {
    console.log("✅ RESEND_API_KEY successfully loaded.");
}
// Initialize Resend with API Key from environment variables
// 🛑 IMPORTANT: Ensure RESEND_API_KEY is set in your .env
const resend = new Resend(process.env.RESEND_API_KEY); 

// Set CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

// Map of issue types to recipient emails (Copied from your dashboard/page.js)
const RECIPIENTS_MAP = {
    "radiant_cooling": ["ayushmaan2005dav@gmail.com"],
    "house_keeping": ["ayushmaan2005dav@gmail.com"],
    "plumbing_issues": ["ayushmaan2005dav@gmail.com"],
    "mess": ["ayushmaan2005dav@gmail.com"],
    "water_supply": ["ayushmaan2005dav@gmail.com"],
    "hot_water": ["ayushmaan2005dav@gmail.com"],
    "washing_machine": ["ayushmaan2005dav@gmail.com"],
    "electrical": ["ayushmaan2005dav@gmail.com"],
    "drinking_water": ["ayushmaan2005dav@gmail.com"],
    "others": ["ayushmaan2005dav@gmail.com"] // Assuming default for safety
};

// Helper function to sanitize the issue key (Copied from your dashboard/page.js logic)
function getSanitizedIssueKey(issue) {
    if (!issue || typeof issue !== "string") return "others";
    
    // Normalize the string to match the keys in the RECIPIENTS_MAP
    return String(issue)
        .trim()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, ""); // Remove non-allowed chars
}

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

export async function POST(request) { // ✅ Use POST method here
    // Handle CORS OPTIONS preflight request (required for cross-origin POST)
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    let complaintData;
    
    try {
        // 1. Read the POST body containing the complaint form data
        complaintData = await request.json(); 
        const { name, email, hostelName, hostelRoom, description, issue } = complaintData;

        // Basic validation
        if (!issue || !description || !email) {
            return new Response(JSON.stringify({ error: "Missing required fields (issue, description, or email)." }), {
                status: 400,
                headers: new Headers(corsHeaders),
            });
        }
        
        // 2. Authentication Check 
        // const reqHeaders = headers();
        const authHeader = request.headers.get("Authorization");
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token format." }), {
                status: 401,
                headers: new Headers(corsHeaders),
            });
        }

        const idToken = authHeader.split("Bearer ")[1];
        try {
            // Verify Firebase ID Token
            await admin.auth().verifyIdToken(idToken);
            console.log("Authenticated User:", email);
        } catch (error) {
            console.error("Invalid Firebase Token:", error);
            return new Response(JSON.stringify({ error: "Unauthorized: Invalid token." }), {
                status: 401,
                headers: new Headers(corsHeaders),
            });
        }
        
        // 3. Determine Recipient(s)
        const sanitizedIssueKey = getSanitizedIssueKey(issue);
        const recipients = RECIPIENTS_MAP[sanitizedIssueKey] || RECIPIENTS_MAP["others"];
        
        const emailSubject = `[COMPLAINT] ${issue} - ${hostelName} ${hostelRoom}`;
        const emailHtml = `
            <h2>New Complaint Logged</h2>
            <p><strong>Issue Type:</strong> ${issue}</p>
            <p><strong>Submitted By:</strong> ${name} (${email})</p>
            <p><strong>Hostel/Room:</strong> ${hostelName} / ${hostelRoom}</p>
            <h3>Description:</h3>
            <p>${description.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>Please address this issue at your earliest convenience.</p>
        `;

        // 4. Send Email using Resend
        // Ensure this is an email you have verified with Resend (e.g., on-boarding@yourdomain.com)
        await resend.emails.send({
            from: 'IITH Complaints <no-reply@iith.ac.in>', 
            to: recipients,
            // The user's email is set as the Reply-To, so replies go back to the student
            reply_to: email, 
            subject: emailSubject,
            html: emailHtml,
        });

        console.log("✅ Email sent successfully to:", recipients.join(', '));

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Complaint submitted and email sent successfully.' 
        }), {
            status: 200,
            headers: new Headers(corsHeaders),
        });

    } catch (error) {
        console.error("🔴 Submission/Email Error:", error);
        
        return new Response(JSON.stringify({ error: "Failed to process complaint or send email." }), {
            status: 500,
            headers: new Headers(corsHeaders),
        });
    }
}