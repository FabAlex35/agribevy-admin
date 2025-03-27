"use client"
import { addVegetableAPI, deleteVegetableAPI, editVegetableAPI, getVegetableAPI } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader';
import Spinner from '@/src/Components/Spinner';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaRegEdit } from "react-icons/fa";
import { FaCircleCheck } from 'react-icons/fa6';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoClose, IoCloseCircleOutline } from 'react-icons/io5';
import { MdDelete } from "react-icons/md";
import { RxCrossCircled } from 'react-icons/rx';
const Vegetables = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errMsg, setErrMsg] = useState(null)
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
  const [isOffCanvasOpenEdit, setIsOffCanvasOpenEdit] = useState(false)
  const [spin, setSpin] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();
  const [vegetables, setVegetables] = useState(null)
  const [editVeg, setEditVeg] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [removeId, setRemoveId] = useState(null)
  const offCanvasRef = useRef(null); 


  const closeFun = () => {
    setIsOffCanvasOpen(false)
    reset()
  }

  const closeFunEdit = () => {
    setIsOffCanvasOpenEdit(false)
    reset2()
  }

  const closeWarning = () => {
    setShowAlert(false)
    setRemoveId(null)
  }

  const VegetableCard = ({ name, tamilName ,imageUrl, onEdit, onDelete }) => {
    return (
      <div className="card h-100 shadow-sm">
        <div className="position-relative">
          <img
            src={imageUrl}
            alt={name}
            className="card-img-top fixed-image"
          />
          <div className="button-group position-absolute top-0 end-0 m-2">
            <button
              onClick={onEdit}
              className="btn btn-light btn-sm me-2"
              aria-label="Edit"
            >
              <FaRegEdit />
            </button>
            <button
              onClick={onDelete}
              className="btn btn-light btn-sm"
              aria-label="Delete"
            >
              <MdDelete />
            </button>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title text-center mb-0">{name}</h5>
          <h6 className="card-title text-center mb-0">{tamilName}</h6>
        </div>
      </div>
    );
  };

  const handleEdit = (veg) => {
    setIsOffCanvasOpenEdit(true)
    setEditVeg(veg)
    reset2({
      name: veg?.veg_name,
      tamil_name:veg?.tamil_name
    })
  };

  const handleDelete = (id) => {
    setShowAlert(true)
    setIsOffCanvasOpen(false)
    setIsOffCanvasOpenEdit(false)
    setRemoveId(id)
  };

  const handleClickOutside = (event) => {
    if (offCanvasRef.current && !offCanvasRef.current.contains(event.target)) {
        setIsOffCanvasOpen(false);
    }
};

  useEffect(() => {
          if (isOffCanvasOpen) {
              document.addEventListener("mousedown", handleClickOutside);
          } else {
              document.removeEventListener("mousedown", handleClickOutside);
          }
          return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [isOffCanvasOpen]);

  const onSubmitInventory = async (data) => {
    setSpin(true)
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("tamil_name", data.tamil_name)
    formData.append("file", data.file[0])
    
    const response = await addVegetableAPI(formData)
    if (response?.status === 200) {
      setSuccessMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setSuccessMsg(null)
        setIsOffCanvasOpen(false)
        reset()
        VegetableList()
      }, 2000)
    }
    else {
      setErrMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  const onSubmitInventoryEdit = async (data) => {
    setSpin(true)

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("tamil_name", data.tamil_name);
    formData.append("id", editVeg.veg_id);
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    } else if (editVeg.path) {
      formData.append("existingPath", editVeg.path);
    }

    const response = await editVegetableAPI(formData)
    if (response?.status === 200) {
      setSuccessMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setSuccessMsg(null)
        setIsOffCanvasOpenEdit(false)
        reset2()
        VegetableList()
      }, 2000)
    }
    else {
      setErrMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  const removeUserDetails = async () => {
    setLoading(true)
    setShowAlert(false)
    const response = await deleteVegetableAPI(removeId)
    if (response?.status === 200) {
      setSuccessMsg(response?.message)
      setTimeout(() => {
        setRemoveId(null)
        VegetableList()
        setIsOffCanvasOpenEdit(false)
        setShowAlert(false)
        setSuccessMsg(null)
      }, 2000)
    }
    else {
      setErrMsg(response.message)
      setLoading(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }


  const VegetableList = async () => {
    setLoading(true)
    const response = await getVegetableAPI()
    if (response?.status === 200) {
      setVegetables(response?.data);
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

  const filteredData = vegetables?.filter((item) =>
    item.veg_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    VegetableList()
  }, [])


  return (
    <div className='app-container'>
      {loading ? <Loader /> :
        <>
          <div className="head pt-2 text-center mb-4">
            <h2 className="primary-color">Vegetables Management</h2>
          </div>

          <div className='d-flex justify-content-end mt-4'>
            <button className='submit-btn py-2 ' onClick={() => setIsOffCanvasOpen(true)}>Add Vegetable</button>
          </div>

          <div className='d-flex justify-content-end mt-3' >

            <input
              type="text"
              className=' search-input'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredData?.length > 0 ?
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2 mb-4">
              {filteredData?.map((vegetable) => {
                const ImageURL = `${vegetable?.path}`
                return (
                  <div className="col" key={vegetable.id}>
                    <VegetableCard
                      name={vegetable.veg_name}
                      tamilName={vegetable.tamil_name}
                      imageUrl={ImageURL}
                      onEdit={() => handleEdit(vegetable)}
                      onDelete={() => handleDelete(vegetable.veg_id)}
                    />
                  </div>
                )
              })}
            </div>
            :
            <p className='text-danger fw-bold fs-3 text-center'>No vegetable found</p>
          }

          <div
            className={`offcanvas offcanvas-end ${isOffCanvasOpen ? "show" : ""}`}
            tabindex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <h5 id="offcanvasRightLabel">Add Vegetable</h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={closeFun}
              ></button>
            </div>
            {/* ============ offcanvas create ====================== */}
            <div className="offcanvas-body">
              <div className="row canva">
                <div className="col-12 card-section">
                  <div className="login-sign-form-section">
                    <form
                      className="login-sign-form mt-4"
                      onSubmit={handleSubmit(onSubmitInventory)}
                    >

                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Vegetable name<sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          {...register("name", {
                            required: "Please enter the vegetable name",
                          })}
                        />
                        <p className="err-dev">{errors?.name?.message}</p>
                      </div>

                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Vegetable Name in Tamil<sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="tamil_name"
                          className="form-control"
                          {...register("tamil_name", {
                            required: "Please enter the vegetable name in tamil",
                          })}
                        />
                        <p className="err-dev">{errors?.tamil_name?.message}</p>
                      </div>


                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Image <sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="file"
                          name="file"
                          className="form-control"
                          {...register("file", {
                            required: "Please upload the image",
                          })}
                        />
                        <p className="err-dev">{errors?.file?.message}</p>
                      </div>



                      <div className="d-flex justify-content-center mt-4">
                        <button
                          type="submit"
                          className="start_btn"
                        > {spin ? <Spinner /> : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={offCanvasRef}
            className={`offcanvas offcanvas-end ${isOffCanvasOpenEdit ? "show" : ""}`}
            tabindex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <h5 id="offcanvasRightLabel">Edit Vegetable</h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={closeFunEdit}
              ></button>
            </div>
            {/* ============ offcanvas create ====================== */}
            <div className="offcanvas-body">
              <div className="row canva">
                <div className="col-12 card-section">
                  <div className="login-sign-form-section">
                    <form
                      className="login-sign-form mt-4"
                      onSubmit={handleSubmit2(onSubmitInventoryEdit)}
                    >

                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Vegetable name<sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          {...register2("name", {
                            required: "Please enter the vegetable name",
                          })}
                        />
                        <p className="err-dev">{errors2?.name?.message}</p>
                      </div>

                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Vegetable name in tamil<sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="text"
                          name="tamil_name"
                          className="form-control"
                          {...register2("tamil_name", {
                            required: "Please enter the vegetable name in tamil",
                          })}
                        />
                        <p className="err-dev">{errors2?.tamil_name?.message}</p>
                      </div>





                      <div className="form-group">
                        <div className="label-time">
                          <label>
                            Image <sup className="super">*</sup>
                          </label>
                        </div>
                        <input
                          type="file"
                          name="file"
                          className="form-control"
                          {...register2("file")}
                        />
                        <p className="err-dev">{errors2?.file?.message}</p>
                      </div>



                      <div className="d-flex justify-content-center mt-4">
                        <button
                          type="submit"
                          className="start_btn"
                        > {spin ? <Spinner /> : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </>}

      <div className={`modal ${showAlert ? "show" : ""} col-5`}>
        <div className="modal-dialog">
          <div className="modal-dialog modal-confirm">
            <div className="modal-content">
              <div className="modal-header">
                <div className="icon-box" onClick={closeWarning}>
                  <IoCloseCircleOutline className='close pointer' size={28} />
                </div>
                <div className="col-12 text-center">
                  <FiAlertTriangle
                    size={40} className='text-danger' />
                </div>
                <div className="col-12">
                  <h4 className="modal-title w-100">Are you sure?</h4>
                </div>
              </div>
              <div className="modal-body">
                <p className='text-center'>Do you really want to continue? This process will deactivate the vegetable.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeWarning}>Close</button>

                <button type="button" className="btn btn-secondary" onClick={removeUserDetails}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className={successMsg === null ? "alert_net hide_net" : "alert_net show alert_suc_bg"}>
        <FaCircleCheck className='exclamation-circle' />
        <span className="msg">{successMsg}</span>
        <div className="close-btn close_suc">
          <IoClose className='close_mark' size={26} />
        </div>
      </div>

      <div className={errMsg === null ? "alert_net hide_net" : "alert_net show alert_war_bg"} >
        <RxCrossCircled className='exclamation-circle' />
        <span className="msg">{errMsg}</span>
        <div className="close-btn close_war">
          <IoClose className='close_mark' size={26} />
        </div>
      </div>
    </div>
  )
}


export default Vegetables