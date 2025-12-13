"use client"
import React from 'react'
import { useState } from 'react'
// Import useAuth to get user details and token
import { useAuth } from "../context/AuthContext.js" 
// Import Toast for better UX 
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Note: The direct client-side Firestore function has been removed.
// The database write is now securely handled by the backend API.

const Report = () => {
    // 1. Get user and tokenID from Auth context
    const { user, tokenID } = useAuth();
    
    const [issue, setissue] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Check
        if (!user || !tokenID) {
            toast.error("Please sign in to submit a report.");
            return;
        }

        // 2. Prepare data for the backend
        const reportData = {
            // Include user details obtained from the context
            reporterName: user.displayName,
            reporterEmail: user.email,
            suggestion: issue,
        };
        
        try {
            // 3. Call the new secure API route for suggestions
            const response = await fetch("/api/suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenID}`, // Secure the submission
                },
                body: JSON.stringify(reportData),
            });
            
            if (response.ok) {
                toast.success("Suggestion submitted and email notification sent!");
                setissue(""); // Clear the textarea after successful submission
            } else {
                const errorBody = await response.json();
                console.error("API Error:", errorBody.error);
                toast.error(`Submission failed: ${errorBody.error}`);
            }
        } catch (error) {
            console.error("API Call Error:", error);
            toast.error("Network error. Could not submit suggestion.");
        }
    }
    
    const handleChange = (e) => {
        setissue(e.target.value)
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="absolute inset-0 -z-10 h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex items-center justify-center"> 
                <form action="submit" onSubmit={handleSubmit} className="flex flex-col gap-2 w-[50vw] items-center">
                    <div className="flex flex-col gap-2 text-2xl w-full items-start text-white">
                        <label className="self-center" htmlFor="other-issue">Suggestions for Improvements:</label>
                        <textarea
                            className="w-full border-2 border-l-white h-32 p-2 text-black" // Added text-black for visibility
                            id="other-issue"
                            name="other-issue"
                            placeholder="Suggest.."
                            value={issue} // Bind value to state
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='flex justify-center'> 
                        <button
                            type="submit"
                            className="mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="hover:cursor-pointer relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Submit
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Report