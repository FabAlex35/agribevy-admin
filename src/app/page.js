"use client"

import { loginAdminAPI } from "../Components/Api";
import Spinner from "../Components/Spinner";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

export default function Home() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [show, setShow] = useState(false);
  const router = useRouter()
  const [errMsg, setErrMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const loginUser = async (data) => {

    setLoading(true)
    const response = await loginAdminAPI(data);

    if (response?.status === 200) {
      router.push("/portal/admindashboard")
      setLoading(false)
    }
    else {
      setErrMsg(response?.message)
      setLoading(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  return (
    <main>
      <div className="bg-login login-height">
        <div className="d-flex flex-wrap justify-content-center reg-row login-row align-items-center">
          <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center">
            <div className="heading">
              <h1 className=" heading-login">AgriBevy</h1>
              <h3 className="mt-2 mt-lg-3 mb-3 mb-lg-0 sub-heading-login">Harvesting Opportunities, Connecting Communities...</h3>
            </div>
          </div>

          <div className=" col-12 col-md-8 col-lg-5" >
            <div className="login-card bg-white col-12 col-md-10 m-auto">
              <h2 className="text-center primary-color">Admin Login</h2>
              <div className="form-login mt-4">
                <form onSubmit={handleSubmit(loginUser)}>

                  <div className="form-group">
                    <label htmlFor="email">Mobile</label>
                    <input type="number" className="form-control" onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10)
                      }
                    }} onWheel={(e) => e.target.blur()} {...register("mobile", {
                      required: "Please enter the Mobile number"
                    })} />
                    <p className="err-dev">{errors.mobile?.message}</p>
                  </div>
                  <div className="form-group showpass">
                    <label htmlFor="email">Password</label>
                    <input type={show ? "text" : "password"} className="form-control" {...register("password", {
                      required: "Please enter the Password"
                    })} />
                    {show ? (
                      <VscEyeClosed
                        className="eye2"
                        onClick={() => setShow(false)}
                      />
                    ) : (<VscEye className="eye2" onClick={() => setShow(true)} />)}
                    <p className="err-dev">{errors.password?.message}</p>
                  </div>

                  <div className="err-div">
                    <div className="d-flex justify-content-center mb-2">
                      <button className="mt-4 px-3 py-1 submit-btn">
                        {loading ? <><Spinner /></>
                          : "Submit"}
                      </button>
                    </div >
                    {errMsg && <p className="err-message">{errMsg}</p>}
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


    </main>
  );
}
