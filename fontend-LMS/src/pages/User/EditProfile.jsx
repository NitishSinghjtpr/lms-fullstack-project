import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateProfile } from '../../Redux/Slice/AuthSlice';
import { useNavigate } from 'react-router';
import HomeLayout from '../../layout/HomeLayout';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = useSelector((state) => state?.auth?.data?._id);

    const [data, setData] = useState({
        previewImage: "",
        name: "",
        avatar: "",
        userId: userId
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];

        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);

            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                });
            });
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!data.name || !data.avatar) {
            toast.error("All fields are mandatory");
            return;
        }

        if (data.name.length < 5) {
            toast.error("Name should be greater than 4 characters");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("avatar", data.avatar);

        await dispatch(updateProfile({ id: data.userId, formData }));
        await dispatch(getUserData());

        navigate("/user/profile");
    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center h-[100vh]'>
                <form
                    onSubmit={onFormSubmit}
                    className='flex flex-col justify-center gap-5 rounded-lg text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]'
                >
                    <p className="text-center text-xl font-bold">Edit Profile</p>

                    <label htmlFor="upload">
                        {data.previewImage ? (
                            <img
                                src={data.previewImage}
                                className="w-32 h-32 rounded-full mx-auto border"
                                alt="preview"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full mx-auto bg-gray-600 flex items-center justify-center">
                                Upload Image
                            </div>
                        )}
                    </label>

                    <input
                        type="file"
                        id="upload"
                        className="hidden"
                        accept=".jpg,.png,.jpeg,.svg"
                        onChange={handleImageUpload}
                    />

                    <div className="flex flex-col font-bold">
                        Full Name
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="bg-transparent border px-2 py-1"
                            value={data.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className='bg-yellow-600 py-2 rounded-md hover:bg-yellow-500'
                    >
                        Update Profile
                    </button>

                    <Link to="/user/profile">
                        <p className='link flex items-center justify-center gap-2 cursor-pointer w-full'>
                            <AiOutlineArrowLeft /> Go Back to Profile
                        </p>
                    </Link>
                </form>
            </div>
        </HomeLayout>
    );
}

export default EditProfile;
