import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router';
import { NavContainer, Outside, Ul } from "../../style/styled_components/navbar_Style";
import { PC, Mobile } from "../Responsive";
import { IoHomeSharp } from 'react-icons/io5';
import { FaSearch } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { FaItunesNote, FaRegSquarePlus } from "react-icons/fa6";
import { SiHeadspace } from "react-icons/si";
import { RiPlayListFill } from "react-icons/ri";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import CreatePost from '../Modal/Post/CreatePost';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const [userNickname, setUserNickname] = useState("");
    const [userInfo, setUserInfo] = useState('');
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const openCreatePost = () => {
        setIsCreatePostOpen(true);
    };

    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const Data = async () =>{
            const loggedin = localStorage.getItem('isLogin')
            setIsLogin(loggedin);
    
            if (loggedin) {
                const storedNickname = localStorage.getItem('nickName');
                setUserNickname(storedNickname);
    
                try{
                    const res = await axios.get(`http://localhost:8080/api/v1/users/info`,{
                        headers:{
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
                        },
                    });
                    setUserInfo(res.data);
                } catch(error){
                    console.error(error)
                }
            }
        }
        Data();
    }, []);

    const logout = async () => {
        localStorage.removeItem('email');
        localStorage.removeItem('isLogin');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLogin(false);

        await axios.post(
            `http://localhost:8080/api/v1/users/logout`,
            {
                accessToken: `${window.localStorage.accessToken}`,
                refreshToken: `${window.localStorage.refreshToken}`
            }
        )
        .then((response) => {
            console.log("로그아웃 성공", response);
        })
        .catch((error) => {
            console.log("로그아웃 API 호출 중 오류", error);
        });

        // navigate("/login");
        window.location.reload();
    }


    return (
        <div>
            <PC>
                <NavContainer>
                    <Outside className={"in"}>
                        <div className="inside">
                            <Ul className={"in"}>
                                {/* <h2 className='mt-3'>BeatBuddy</h2> */}
                                <Link to='/'>
                                    <img src='https://github.com/eeeeeddy/eeeeeddy/assets/71869717/ba3957b2-2b3c-4f55-8426-008dfc56e00b' alt='BeatBuddy' width={'100%'} />
                                </Link>
                                <li className='text-start'>
                                    <Link to='/'><IoHomeSharp className='me-2' size='25' color='white' />Home</Link>
                                </li>
                                <li className='text-start'>
                                    <Link to='/playlist'><RiPlayListFill className='me-2' size='25' color='white' />PlayList</Link>
                                </li>
                                <li className='text-start'>
                                    <Link to='/Search'><FaSearch className='me-2' size='25' color='white' />Search</Link>
                                </li>
                                <li className='text-start'>
                                    <Link to='/DM'><LuMessageCircle className='me-2' size='25' color='white' />DM</Link>
                                </li>
                                {/* <li className='text-start'>
                                    <Link to='/Alarm'><FaItunesNote className='me-2' size='25' color='white' />Alarm</Link>
                                </li> */}
                                <li className='text-start' onClick={() => openCreatePost()}>
                                    <span style={{ color: "white", cursor: "pointer" }}><FaRegSquarePlus className='me-2' size='25' />Post</span>
                                </li>
                                {isLogin ? (
                                    <>
                                    <li className='text-start'>
                                        <Link to={`/profile/${userNickname}`}>
                                            <img src={userInfo.userImgSrc} alt={userInfo.nickName}  style={{ width:'30px', height:'30px', borderRadius:'50%', marginRight:'15px', backgroundColor:"white"}}/>
                                            <b style={{fontSize:'17px'}}>{userNickname}</b>
                                        </Link>
                                    </li>
                                    <li className='text-start'>
                                        <span style={{ color: "white", cursor: "pointer" }} onClick={() => logout()}><IoMdLogOut  className='me-2' size='25' color='white'/>Logout</span>
                                    </li>
                                    </>
                                ) : (
                                    <li className='text-start'>
                                        <Link to='/Login'><IoMdLogIn className='me-2' size='25' color='white' /> Login</Link>
                                    </li>
                                )}
                            </Ul>
                        </div>
                    </Outside>
                </NavContainer>

                {isCreatePostOpen && (<CreatePost
                    open={isCreatePostOpen}
                    onClose={() => {
                        setIsCreatePostOpen(false);
                    }}
                />)}
            </PC>

            {/* TODO: 플레이리스트 부분 추가하기 */}
            <Mobile>
                <div className="button-container border fixed-bottom">
                    <button className="button">
                        <IoHomeSharp className='me-2' size='25' color='black' />
                    </button>
                    <button className="button">
                        <FaSearch className='me-2' size='25' color='black' />
                    </button>
                    <button className="button">
                        <LuMessageCircle className='me-2' size='25' color='black' />
                    </button>
                    <button className='button'>
                        <FaItunesNote className='me-2' size='25' color='black' />
                    </button>
                    <button className="button" onClick={() => openCreatePost()}>
                        <FaRegSquarePlus className='me-2' size='40' color='black' />
                    </button>
                    <button className="button">
                        <SiHeadspace className='me-2' size='40' color='gray' />
                    </button>
                </div>

                {isCreatePostOpen && (<CreatePost
                    open={isCreatePostOpen}
                    onClose={() => {
                        setIsCreatePostOpen(false);
                    }}
                />)}
            </Mobile>

        </div>
    );
}

export default Navbar;