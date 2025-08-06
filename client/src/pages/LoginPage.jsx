import React, { useState, useEffect, useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)
  const [showTerms, setShowTerms] = useState(false) // ✅ New state for floating panel

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === "Sign Up" && !isDataSubmitted && !agreedToPolicy) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign Up" ? 'signup' : 'login', { fullName, email, password, bio });
  };

  useEffect(() => {
    setFullName("")
    setEmail("")
    setPassword("")
    setBio("")
    setIsDataSubmitted(false)
    setAgreedToPolicy(false)
  }, [currState])

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col'
      style={{ backgroundImage: `url(${assets.bg-login})` }}>
      
      {/* LEFT */}
      <img src={assets.tea} className='w-[550px]' alt="" />

      {/* RIGHT */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg backdrop-blur-xl'>
        <h2 className='font-medium text-2xl text-center relative'>
          {currState} {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-3 border border-gray-500 rounded-md focus:outline-none focus:right-2 focus:ring-indigo-500' placeholder='Provide a short bio...' required></textarea>
        )}

        {currState === "Sign Up" && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e.target.checked)}
            />
            <p>
              Agree to the 
              <span 
                onClick={() => setShowTerms(true)} 
                className="text-violet-400 underline cursor-pointer ml-1">
                Terms of Use & Privacy Policy
              </span>
            </p>
          </div>
        )}

        <button className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" ? (
            <p className='text-sm text-gray-600 text-center'>
              Already have an account? 
              <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false); }} className='font-medium text-violet-500 cursor-pointer'> Login Here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600 text-center'>
              Create an account 
              <span onClick={() => setCurrState("Sign Up")} className='font-medium text-violet-500 cursor-pointer'> Sign Up here</span>
            </p>
          )}
        </div>
      </form>

      {/* ✅ TERMS & CONDITIONS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white text-black w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
            <div className="max-h-60 overflow-y-auto text-sm text-gray-700">
              <p>
                Welcome to TEA. By using this platform, you agree to our Terms and Conditions...
                <br /><br />
                1. You shall not misuse this service.<br />
                2. Privacy of users must be respected.<br />
                3. Any illegal activity will lead to termination.<br />
                4. We may update these terms periodically.<br /><br />
                [Add your complete license terms here...]
              </p>
            </div>
            <button 
              onClick={() => setShowTerms(false)} 
              className="mt-4 w-full py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
