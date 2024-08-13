import React, { useEffect, useState } from 'react';
import { SiHeadspace } from "react-icons/si";
import { IoMusicalNoteSharp, IoPaperPlaneOutline } from "react-icons/io5";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { PC, Mobile } from "../components/Responsive";
import '../style/css/Home.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FeedDetail from '../components/Modal/Feed/FeedDetail';
import axios from 'axios';

function Feed({ feedData }) {
    const navigate = useNavigate();
    const { nickName, feedId } = useParams([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFeedDetailOpen, setIsFeedDetailOpen] = useState(false);
    const [isNoteClicked, setIsNoteClicked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    // useEffect(() => {
    //     setIsLoading(true); // API 호출 전에 true로 설정하여 로딩화면 띄우기

    //     axios.get(`https://9d71-121-143-39-62.ngrok-free.app/api/feeds/user/${encodeURIComponent(userNickname)}/${feedId}`, {
    //         headers: {
    //             'Content-Type': `application/json`,
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
    //         },
    //     })
    //         .then((response) => {
    //             console.log("서버에서 받아온 결과", response.data);
    //             const temp = response.data;
    //             // setFeedData(temp);
    //             setIsLoading(false); // API 호출이 완료되면 false로 변경하여 로딩화면 숨김처리
    //         })
    //         .catch((error) => {
    //             console.error('API 요청 중 오류 발생:', error);
    //         });
    // }, [])

    useEffect (()=>{
        
    })

    const openFeedDetail = (music) => {
        setIsFeedDetailOpen(true);
    }

    const clickNote = () => {
        setIsNoteClicked(!isNoteClicked);
    }

    const goDM = () => {
        navigate('/dm');
    }

    const onBookmark = () => {
        setIsBookmarked(!isBookmarked);
    }

    return (
        <div>
            <PC>
                <div className='mt-5'>
                    <div className='d-flex justify-content-center mb-4' key={feedData.id}>
                        <div className="border-bottom" style={{ width: "40rem", height: "auto" }}>
                            <div>
                                <div className='d-flex justify-content-center'>
                                    <div className='d-flex justify-content-start mb-3' style={{ width: "50%" }}>
                                        <Link to={`/profile/${feedData.nickName}`} style={{ textDecorationLine: "none", color: "white" }}><img className='userimg' src={feedData.userImgSrc} alt="User Avatar" style={{ width: '40px', height:'40px', marginRight:'13px', borderRadius:'50%'}} />
                                            <b>{feedData.nickName}</b>
                                        </Link>
                                    </div>
                                    <div className='d-flex justify-content-end mb-3' style={{ width: "50%" }}>
                                        <span className='mt-2'>
                                            <IoMusicalNoteSharp id={`${isNoteClicked ? 'clicked' : ''}`} className='me-4' size='26' onClick={() => clickNote()} style={{ cursor: "pointer" }} />
                                            <IoPaperPlaneOutline className='me-4' size='26' onClick={() => goDM()} style={{ cursor: "pointer" }} />
                                            {isBookmarked ? (
                                                <FaBookmark className='' size='26' onClick={() => onBookmark()} style={{ cursor: "pointer" }} />
                                            ) : (
                                                <FaRegBookmark className='' size='26' onClick={() => onBookmark()} style={{ cursor: "pointer" }} />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="">
                                    <img style={{ width: "70%", height: "70%" }} src={feedData.feedImgSrc || feedData.musicInfoList[0].albumUrl} alt={feedData.musicInfoList.musicTitle}></img>
                                    <h5 className='mt-3'>{feedData.musicInfoList[0].musicTitle} · {feedData.musicInfoList[0].musicArtist}</h5>
                                    <p>{feedData.musicInfoList[0].albumName} · {feedData.musicInfoList[0].releaseDate}</p>
                                    <p style={{ color: '#27A8FC' }}>{feedData.tagName.map((tag, index) => `#${tag} ${index < feedData.tagName.length - 1 ? ' ' : ''}`)}</p>
                                    <p>{feedData.content}<span className='ms-2' style={{ color: "grey", cursor: "pointer" }} onClick={() => openFeedDetail(feedData)}>더보기</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isFeedDetailOpen && (
                    <FeedDetail
                        open={isFeedDetailOpen}
                        isNoteClicked={isNoteClicked}
                        isBookmarked={isBookmarked}
                        onClose={() => {
                            setIsFeedDetailOpen(false);
                        }}
                        music={feedData}
                    />
                )}
            </PC>

            <Mobile>

            </Mobile>
        </div>
    );
}

export default Feed;