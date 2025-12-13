"use client"
import { useState } from 'react'
import { useAuth } from "../context/AuthContext.js"
import { db } from '../../firebaseConfig.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import React from 'react'
import Navbar from '../components/navbar.js'
import Footer from '../components/footer.js'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

const issues = [
  "Radiant Cooling ",
  "House Keeping",
  "Plumbing Issues",
  "Mess",
  "Water supply",
  "Hot water ",
  "Washing machine",
  "Electrical",
  "Drinking Water"
]

const hostels = [
  "Charaka",
  "Susruta",
  "Kautilya",
  "Vyasa",
  "Brahmagupta",
  "Varahamihira",
  "Ramanuja",
  "Vivekananda",
  "SN Bose",
  "Ramanujan",
  "Raman",
  "Kalam",
  "Bhabha",
  "Sarabhai",
  "Visweswaraya",
  "Kapila",
  "Aryabhatta",
  "Bhaskara",
  "Maitreyi",
  "Gargi",
  "Kalpana Chawla",
  "Anandi",
  "Sarojini Naidu"
]

const recipentsMap = new Map()
recipentsMap.set("radiant_cooling", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("house_keeping", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("plumbing_issues", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("mess", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("water_supply", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("hot_water", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("washing_machine", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("electrical", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("drinking_water", ["ayushmaan2005dav@gmail.com"])
recipentsMap.set("others", ["ayushmaan2005dav@gmail.com"])

async function addDataToFireStore(name, email, hostelName, hostelRoom, description, issue) {
  try {
    if (!issue || typeof issue !== "string") {
      throw new Error("Invalid issue type provided")
    }
    const sanitizedIssue = String(issue)
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")

    if (!sanitizedIssue) {
      throw new Error("Issue type contains only invalid characters")
    }
    const docRef = await addDoc(collection(db, "one"), {
      name: name,
      email: email,
      hostelName: hostelName,
      hostelRoom: hostelRoom,
      description: description,
      issue: issue,
      resolved: false,
      mailSent: false,
      threadID: "",
      recipents: recipentsMap.get(sanitizedIssue) || [],
      timestamp: serverTimestamp(),
    })
    console.log("Document written with ID:", docRef.id)
    return true
  } catch (error) {
    console.log("Error encountered while adding document to Database ", error)
    return false
  }
}

const Dashboard = () => {
  const { user, tokenID } = useAuth();
  // const router = useRouter();
  const arr = { name: user?.displayName, roll: user?.email?.slice(0, -11) }
  const [form, setForm] = useState({
    name: user?.displayName,
    email: user?.email,
    hostelName: "",
    hostelRoom: "",
    description: "",
    issue: "",
    resolved: false,
    mailSent: false,
    threadID: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleAdd = async (e) => {
    e.preventDefault();

    // Ensure user and token are available before proceeding
    if (!user || !tokenID) {
      toast.error("Authentication error. Please re-login.");
      return;
    }

    const added = await addDataToFireStore(
      form.name,
      form.email,
      form.hostelName,
      form.hostelRoom,
      form.description,
      form.issue
    );

    if (added) {
      // 1. Show success toast for database log
      toast('Complaint has been logged!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // 2. NEW LOGIC: Send the complaint data to the backend API for email
      try {
        const emailResponse = await fetch("/api/complaints", {
          method: "POST", // ✅ CORRECT: Changed to POST
          headers: {
            "Content-Type": "application/json", // ✅ Specify data type
            "Authorization": `Bearer ${tokenID}`, // Keep the security token
          },
          // ✅ CRITICAL: Send the form data in the body
          body: JSON.stringify(form),
        });

        if (emailResponse.ok) {
          console.log("✅ Complaint successfully submitted and email triggered.");
        } else {
          // Handle API error (e.g., email service failed)
          const errorBody = await emailResponse.json();
          console.error("🔴 API Error (Email Failed):", errorBody.error || "Failed to trigger email.");
          toast(`Error: ${errorBody.error || 'Failed to send email.'}`, {
            position: "top-right", autoClose: 3000, theme: "light"
          });
        }
      } catch (error) {
        console.error("Error while calling complaints API:", error);
        toast('Error: Could not reach email service API.', {
          position: "top-right", autoClose: 3000, theme: "light"
        });
      }
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className=" flex-grow min-h-screen w-full overflow-y-auto bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] px-4 py-10 md:px-10 md:py-24">
        <Navbar className="mb-7 md:mb-0" />
        <hr className="border-t-2 border-gray-600 w-full md:mt-2 mb-5 mt-7" />

        {/* Name and Roll in separate lines */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl text-white font-semibold text-lg md:text-2xl">
            <div className="flex mb-3 gap-2">
              <span> Name:</span>
              <span className='uppercase'> {arr.name} </span>
            </div>
            <div className="flex mb-3 gap-2">
              <span> Roll Number:</span>
              <span className='uppercase'> {arr.roll} </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <form className="w-full max-w-3xl text-white" onSubmit={handleAdd}>
            {/* Row for Hostel Name */}
            <div className="flex items-center gap-4 mb-6">
              <label className="w-32 md:w-44" htmlFor="hostelName">
                Hostel Name:
              </label>
              <select
                className="flex-1 border-2 bg-[#050110] text-[rgba(255,255,255,0.9)] p-2"
                id="hostelName"
                name="hostelName"
                value={form.hostelName}
                required
                onChange={handleChange}
              >
                <option value="">Select the hostel name</option>
                {hostels.map((hostel, index) => (
                  <option key={index} value={hostel}>
                    {hostel}
                  </option>
                ))}
              </select>
            </div>

            {/* Row for Room Number */}
            <div className="flex items-center gap-4 mb-6 ">
              <label className="w-32 md:w-44" htmlFor="hostelRoom">
                Room Number:
              </label>
              <input
                className="flex-1 border-2 text-[rgba(255,255,255,0.9)] p-2"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                id="hostelRoom"
                name="hostelRoom"
                value={form.hostelRoom}
                placeholder="Enter your room number"
                required
                onChange={handleChange}
              />
            </div>

            {/* Row for Issue Type */}
            <div className="flex items-center gap-4 mb-6">
              <label className="w-32 md:w-44" htmlFor="issue">
                Issue Type:
              </label>
              <select
                className="flex-1 border-2 bg-[#050110] text-[rgba(255,255,255,0.9)] p-2"
                id="issue"
                name="issue"
                value={form.issue}
                required
                onChange={handleChange}
              >
                <option value="">Select an issue type</option>
                {issues.map((issue, index) => (
                  <option key={index} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>

            {/* Row for Description */}

            <div className=" flex items-center md:gap-4 gap-1 mb-6">
              <label className="w-36 md:w-44" htmlFor="description">
                Description:
              </label>
              <textarea
                className="flex-1 border-2 text-[rgba(255,255,255,0.9)] p-2 h-36"
                id="description"
                name="description"
                value={form.description}
                placeholder="Description of the issue"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <span className='text-white mt-2 block text-center '>A mail will be will be sent to respective authority by clicking on submit</span>
            <div className="flex justify-center mt-4">
              <button type='submit' className="hover:cursor-pointer relative inline-flex items-center justify-center p-0.5 md:mb-2 md:me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 z-10">
                <span className="relative px-2 py-1 md:px-5 md:py-2.5 whitespace-nowrap transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Submit
                </span>
              </button>
            </div>
          </form>
        </div>

        <hr className="border-t-2 border-gray-600 w-full md:mt-8 mt-8" />
        <Footer />
      </div>
    </>
  )
}

export default Dashboard
