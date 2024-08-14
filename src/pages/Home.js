import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { PC, Mobile } from "../components/Responsive";
import '../style/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import MiniPlayer from '../components/Player/MiniPlayer';
import Feed from './Feed';
import { postChkAtom } from '../state/PostAtom';
import { useRecoilValue } from 'recoil';

function Home() {
    const [feedData, setFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const postChk = useRecoilValue(postChkAtom);

    if (postChk) { // Post, Feed 작성 시 새로고침하기 위한 변수
        window.location.reload();
    }

    useEffect(() => {
        setIsLoading(true); // API 호출 전에 true로 설정하여 로딩화면 띄우기

        axios.get(`http://localhost:8080/api/feeds/followings`, {
            headers: {
                'Content-Type': `application/json`,
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
            .then((response) => {
                console.log("서버에서 받아온 결과", response.data);
                const temp = response.data;
                setFeedData(temp);
                setIsLoading(false); // API 호출이 완료되면 false로 변경하여 로딩화면 숨김처리
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }, [])

    return (
        <div>
            <PC>
                <div className='row'>
                    <div className='col-md-2'>
                        <Navbar />
                    </div>
                    <div className='col-md-8'>
                        <div className='mt-5' style={{ maxHeight: "700px", overflow: "scroll" }}>
                            {isLoading ? <Loading /> : null}
                            {feedData.map((music) => (
                                <Feed feedData={music} />
                            ))}
                        </div>
                    </div>
                    <div className='col-md-2'>
                        <MiniPlayer />
                    </div>
                </div>
            </PC>

            <Mobile>
                <Navbar />
                <h2 className='text-start ms-3 mt-3 mb-3'>BeatBuddy</h2>
                {isLoading ? <Loading /> : null}
                {/* {feedData.slice().reverse().map((music) => (
                    <div className='d-flex justify-content-center mb-4 ms-3 me-3' key={music.id}>
                        <div className="border-bottom" style={{ width: "40rem", height: "auto" }}>
                            <div>
                                <div className='d-flex justify-content-center'>
                                    <div className='d-flex justify-content-start mb-3' style={{ width: "50%" }}>
                                        <Link to='/profile' style={{ textDecorationLine: "none" }}><SiHeadspace className='me-2' size='40' color='gray' />User Nickname</Link>
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
                                    <img style={{ width: "80%", height: "80%" }} src={music.imageFileUrl || music.musicInfoList[0].albumUrl} alt={music.musicInfoList[0].musicTitle}></img>
                                    <h5 className='mt-3'>{music.musicInfoList[0].musicTitle} · {music.musicInfoList[0].musicArtist}</h5>
                                    <p>{music.musicInfoList[0].albumName} · {music.musicInfoList[0].releaseDate}</p>
                                    <p style={{ color: '#27A8FC' }}>{music.tagName.map((tag, index) => `#${tag} ${index < music.tagName.length - 1 ? ' ' : ''}`)}</p>
                                    <p>{music.content}<span className='ms-2' style={{ color: "grey", cursor: "pointer" }} onClick={() => openFeedDetail(music)}>더보기</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isFeedDetailOpen && (
                    <FeedDetail
                        open={isFeedDetailOpen}
                        isNoteClicked={isNoteClicked}
                        isBookmarked={isBookmarked}
                        onClose={() => {
                            setIsFeedDetailOpen(false);
                        }}
                        music={selectedMusic}
                    />
                )} */}
            </Mobile>
        </div>
    );
}

export default Home;