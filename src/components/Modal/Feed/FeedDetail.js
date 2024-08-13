import React, { useEffect, useRef, useState } from 'react';
import ModalContainer from '../Config/ModalContainer';
import { PCContents, MobileContents, PCModalWrap, MobileModalWrap, Overlay } from '../../../style/styled_components/FeedDetailModal_Style';
import useOutSideClick from '../../../hooks/useOutSideClick';
import { Mobile, PC } from '../../Responsive';
import { SiHeadspace } from "react-icons/si";
import { IoMusicalNoteSharp, IoPaperPlaneOutline } from "react-icons/io5";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { LuMoreHorizontal, LuMoreVertical  } from "react-icons/lu";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { CloseButton } from 'react-bootstrap';
import '../../../style/css/FeedDetail.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeedEdit from './FeedEdit';
import FeedDelete from './FeedDelete';


// Home에서 좋아요, 북마크 변수 값 받아야함. 디테일에서 변경한 값도 Home으로 보내서 공유해야함.
// TODO: 모바일 미작업, 디테일 클릭할 때 다시 서버에서 통신해야할 듯
function FeedDetail({ onClose, music }) {
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const [isNoteClicked, setIsNoteClicked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(music.comments);
    const [isToggled, setIsToggled] = useState(false);
    const [isFeedEdit, setIsFeedEdit] = useState(false);
    const [isFeedDelete, setIsFeedDelete] = useState(false);


    // console.log(music)

    const handleClose = () => {
        onClose?.();
    };

    useEffect(() => {
        const $body = document.querySelector("body");
        const overflow = $body.style.overflow;
        $body.style.overflow = "hidden";
        return () => {
            $body.style.overflow = overflow
        };
    }, []);

    const clickNote = () => {
        setIsNoteClicked(!isNoteClicked);
    }

    const goDM = () => {
        navigate('/dm');
    }

    const onBookmark = () => {
        setIsBookmarked(!isBookmarked);
    }

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }

    const goFeedEdit = () =>{
        setIsFeedEdit(true);
    }

    const goFeedDelete = () =>{
        setIsFeedDelete(true);
    }

    const inputComment = async (feedId) => {
        await axios.post(
            `http://localhost:8080/api/comments/save/${feedId}`,
            {
                comment: `${comment}`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        )
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setCommentList(prev => [...prev, response.data]);
                setComment("");
            })
            .catch((error) => {
                console.log("댓글 작성 API 호출 중 오류", error);
            });
    };

    // useEffect(()=>{
    //     axios.get(`http://localhost:8080/api/v1/users/search/${music.nickName}`,{
    //         headers:{
    //             'Content-Type': `application/json`,
    //             'ngrok-skip-browser-warning': '69420',
    //         },
    //     })
    //         .then((response) => {
    //             console.log("result", response.data);
    //         })
    //         .catch((error) =>{
    //             console.error("오류", error)
    //         })
    // },[music.nickName]);

    const handleClick = ()=> {
        setIsToggled(!isToggled);
    }

    useOutSideClick(modalRef, handleClose)

    return (
        <div>
            <PC>
            {isFeedEdit || isFeedDelete ? null : (
                <ModalContainer>
                    <Overlay>
                        <PCModalWrap ref={modalRef}>
                            <CloseButton class="btn-close btn-close-white" aria-label="Close" onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px' }}></CloseButton>
                            <PCContents>
                                <div className='d-flex justify-content-center'>
                                    <div className='justify-content-center' style={{ width: "50%", backgroundColor: "#242424" }}>
                                        <div className='d-flex justify-content-end me-4' >
                                            <span className=''>
                                                <IoMusicalNoteSharp id={`${isNoteClicked ? 'clicked' : 'unclicked'}`} className='me-4' size='26' onClick={() => clickNote()} style={{ cursor: "pointer" }} />
                                                <IoPaperPlaneOutline className='me-4' size='26' color='white' onClick={() => goDM()} style={{ cursor: "pointer" }} />
                                                {isBookmarked ? (
                                                    <FaBookmark className='' size='26' color='white' onClick={() => onBookmark()} style={{ cursor: "pointer" }} />
                                                ) : (
                                                    <FaRegBookmark className='' size='26' color='white' onClick={() => onBookmark()} style={{ cursor: "pointer" }} />
                                                )}
                                            </span>
                                        </div>
                                        <img className='mt-3' style={{ width: "95%", height: "90%" }} src={music.feedImgSrc || music.musicInfoList[0].albumUrl} alt={music.musicInfoList[0].musicTitle}></img>
                                    </div>
                                    <div className='ms-2' style={{ width: "50%", backgroundColor: "#242424", color: "white" }}>
                                        <div className='d-flex justify-content-start'>
                                            <Link to={`/profile/${music.nickName}`} style={{ textDecorationLine: "none", color: "white" }}>
                                            <img className='userimg' src={music.userImgSrc} alt="User Avatar" style={{ width: '40px', height:'40px', backgroundColor:"white" }} /> {music.nickName}</Link>
                                            <div className='edbtn' >
                                                <button onClick={handleClick}>
                                                    {isToggled ? 
                                                    <>
                                                        <button className='editbtn' onClick={()=> goFeedEdit()}><GrEdit id={`${isNoteClicked ? 'clicked' : 'unclicked'}`} style={{ cursor: "pointer" }} /></button>
                                                        <button className='delbtn' onClick={()=> goFeedDelete()}><RiDeleteBinLine id={`${isNoteClicked ? 'clicked' : 'unclicked'}`} style={{ cursor: "pointer" }} /></button>
                                                        <LuMoreVertical style={{color:'white', margin: '10px'}} />
                                                        </> : 
                                                        
                                                        <LuMoreHorizontal style={{color:'white', margin: '10px'}} />}
                                                </button>
                                            </div>

                                        </div>
                                        <hr />
                                        {/* 뮤직정보표시  */}
                                        <div className='musiccard' style={{}}>
                                            <div className='musicContent'>
                                                <p className='musictitle'>{music.musicInfoList[0].musicTitle}</p>
                                                <p className='Artist' >{music.musicInfoList[0].musicArtist}</p>
                                                <p className='albumInfo'>{music.musicInfoList[0].albumName} · {music.musicInfoList[0].releaseDate}</p>
                                            </div>
                                        </div>

                                        <div className='feedcontent'>
                                            <div className='justify-content-start text-start'>
                                                <p style={{fontSize:'16px', color:'white'}} className='feedtext'>{music.content}</p>
                                                {music.tagName.map((tag, index) => (
                                                    <p key={index} className='btn btn-warning btn-sm me-2 rounded-pill' style={{fontSize:'13px'}}>#{tag}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='justify-content-start text-start' style={{ height: "20vh", overflow: "scroll" }}>
                                            {commentList.map((data) => (
                                                <p key={data.id}> <img className='userimg' src={data.userImgSrc} alt="User Avatar" style={{ width: '30px', height:'30px',borderRadius:'50%', backgroundColor:"white" }} /> {data.nickName} : {data.comment}</p>
                                            ))}
                                        </div>
                                        <div className="d-flex justify-content-center" id='search'>
                                            <input type="text" className="search_input" placeholder="댓글을 입력하세요." onChange={handleCommentChange} value={comment} />
                                            <button className="search_button" onClick={() => inputComment(music.id)}>입력</button>
                                        </div>
                                    </div>
                                </div>
                            </PCContents>
                        </PCModalWrap>
                    </Overlay>
                </ModalContainer>
                )}
                

                {isFeedEdit &&(<FeedEdit
                    feedId={music.id}
                    musicInfoList={music}
                    open={isFeedEdit}
                    onClose={() => {
                        setIsFeedEdit(false);
                        if(onClose){
                            onClose();
                        }
                    }}
                />)}

                {isFeedDelete &&(<FeedDelete
                    feedId={music.id}
                    open={isFeedDelete}
                    onClose={() => {
                        setIsFeedDelete(false);
                        if(onClose){
                            onClose();
                        }
                    }}
                />)}
            </PC>

            <Mobile>
                <ModalContainer>
                    <Overlay>
                        <MobileModalWrap ref={modalRef}>
                            <MobileContents>
                                <div>
                                    <div className='d-flex justify-content-center'>
                                        <div className='d-flex justify-content-start mb-3' style={{ width: "50%" }}>
                                            <Link to='/profile' style={{ textDecorationLine: "none" }}><SiHeadspace className='me-2' size='40' color='gray' />User Nickname</Link>
                                        </div>
                                        <div className='d-flex justify-content-end mt-2 me-1' style={{ width: "50%" }}>
                                            <span className=''>
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
                                    <div className='d-flex justify-content-center mb-1'>
                                        <img style={{ width: "40%", height: "40%" }} src={music.imageFileUrl || music.musicInfoList[0].albumUrl} alt={music.musicInfoList[0].musicTitle}></img>
                                    </div>
                                    <div className='justify-content-center mt-3'>
                                        <div className='text-center'>
                                            <h5>{music.musicInfoList[0].musicTitle} · {music.musicInfoList[0].musicArtist}</h5>
                                            <p>{music.musicInfoList[0].albumName} · {music.musicInfoList[0].releaseDate}</p>
                                        </div>
                                        <div className='text-start'>
                                            <p>{music.content}</p>
                                            {music.tagName.map((tag, index) => (
                                                <p key={index} className='btn btn-outline-primary btn-sm me-2 rounded-pill disabled'>#{tag}</p>
                                            ))}
                                        </div>
                                        <hr />
                                        <div className='text-start'>
                                            {music.comments.map((data) => (
                                                <p key={data.id}>{data.nickName} : {data.comment}</p>
                                            ))}
                                        </div>
                                        <div className="search" id='search'>
                                            <input type="text" className="search_input" placeholder="댓글을 입력하세요." />
                                            <button className="search_button">입력</button>
                                        </div>
                                    </div>
                                </div>
                            </MobileContents>
                        </MobileModalWrap>
                    </Overlay>
                </ModalContainer>
            </Mobile>
        </div>
    );
}

export default FeedDetail;