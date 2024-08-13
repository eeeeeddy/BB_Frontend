import React, { useEffect, useRef, useState } from 'react';
import ModalContainer from '../Config/ModalContainer';
import { Button, Contents, ModalWrap, Overlay } from '../../../style/styled_components/PostModal_Style';
import useOutSideClick from '../../../hooks/useOutSideClick';
import PlayListText from './PlayListText';
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import CreatePost from '../Post/CreatePost';
import { IoText } from 'react-icons/io5';

function PlayListSearch({ onClose, searchKeyword }) {
    const modalRef = useRef(null);
    const currentUser = window.localStorage.getItem('nickName');
    const [isPlstListTextOpen, setIsPlayListTextOpen] = useState(false);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [originalResults, setOriginalResults] = useState([]);


    // TODO: db에 없는 해시태그 검색 시 알림창 띄우기
    console.log("검색어", searchKeyword);

    const goPlayListText = () => {
        if (searchResults.length === 0) {
            alert("플레이리스트를 구성하세요.")
        } else {
            setIsPlayListTextOpen(true);
        }
    }

    const goCreatePost = () => {
        setIsCreatePostOpen(true);
    }

    const handleClose = () => {
        onClose?.();
    }

    useEffect(() => {
        const $body = document.querySelector("body");
        const overflow = $body.style.overflow;
        $body.style.overflow = "hidden";
        return () => {
            $body.style.overflow = overflow
        };
    }, []);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        // 엔터 키를 눌렀을 때 검색 실행
        if (e.key === 'Enter') {
            searchHashtag();
        }
    };

    const searchHashtag = async () => {
        await axios.get(`http://localhost:8080/api/feeds/byTag/${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
            .then((response) => {
                const temp = response.data

                const filteredResult = temp.filter(item => item.nickName === currentUser);
                setSearchResults(filteredResult)
                setOriginalResults(temp)
            })
            .catch((error) => {
                console.log("해시태그 검색 API 호출 중 오류", error)
            })
    }

    const deleteMusic = (musicId) => {
        console.log(musicId);
        let updateResults = searchResults.filter(item => item.id !== musicId);
        setSearchResults(updateResults)
    }

    const returnPlayList = () => {
        setSearchResults(originalResults)
    }

    useOutSideClick(modalRef, handleClose)

    return (
        <div>
            {isPlstListTextOpen || isCreatePostOpen ? null : (
                <ModalContainer>
                    <Overlay>
                        <ModalWrap ref={modalRef}>
                            <Contents>
                                <div className='row'>
                                    <FaArrowLeft className='col' size='36' onClick={() => goCreatePost()} style={{ color: "blue", cursor: "pointer" }} />
                                    <h3 className='col-10 text-center'>New PlayList (PlayListSearch)</h3>
                                    <div className='col'></div>
                                </div>

                                <div className='d-flex justify-content-center mb-1'>
                                    <hr style={{ width: "80%" }} />
                                </div>

                                <div className='d-flex justify-content-center mb-3'>
                                    <input type="text" className="form-control" placeholder="해시태그 검색" style={{ width: "60%" }}
                                        value={searchQuery} onChange={handleInputChange} onKeyDown={handleKeyPress}
                                    />
                                </div>

                                <div className='mt-2 mb-1' style={{ width: "", height: "350px", overflow: "scroll" }}>
                                    <table className='table'>
                                        <tbody>
                                            {(searchResults && searchResults.length > 0) ? (
                                                searchResults.map((music, index) => (
                                                    <tr key={index}>

                                                        {/* 앨범 이미지 */}
                                                        <td><img className='float-start' src={music.musicInfoList[0].albumUrl} alt={`Thumbnail ${index}`} style={{ width: "80px", height: "60px" }} /></td>

                                                        {/* 노래 제목 */}
                                                        <td style={{ verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: music.musicInfoList[0].musicTitle }}></td>

                                                        {/* 가수 이름 */}
                                                        <td style={{ verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: music.musicInfoList[0].musicArtist }}></td>

                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <button className='btn btn-danger btn-sm' onClick={() => deleteMusic(music.id)}>DELETE</button>
                                                        </td>
                                                    </tr>
                                                )))
                                                : (
                                                    <tr className='text-center align-middle'>
                                                        <td style={{ borderBottom: "none", height: "300px"}}>
                                                            <h2>해시태그를 입력하세요.</h2>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <Button className='me-3' onClick={() => returnPlayList()}>Return</Button>
                                    <Button onClick={() => goPlayListText()}>Next</Button>
                                </div>
                            </Contents>
                        </ModalWrap>
                    </Overlay>
                </ModalContainer>
            )}

            {isPlstListTextOpen && (<PlayListText
                open={isPlstListTextOpen}
                playlist={searchResults}
                searchQuery={searchQuery}
                onClose={() => {
                    setIsPlayListTextOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            />)}

            {isCreatePostOpen && (<CreatePost
                open={isCreatePostOpen}
                onClose={() => {
                    setIsCreatePostOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            />)}

        </div>
    );
}

export default PlayListSearch;