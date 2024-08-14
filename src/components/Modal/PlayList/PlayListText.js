import React, { useEffect, useRef, useState } from 'react';
import ModalContainer from '../Config/ModalContainer';
import { Button, Contents, TextInputModalWrap, Overlay } from '../../../style/styled_components/PostModal_Style';
import { SiHeadspace } from "react-icons/si";
import { AiFillPicture } from "react-icons/ai";
import useOutSideClick from '../../../hooks/useOutSideClick';
import { useNavigate } from 'react-router-dom';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../../../style/css/Hashtag.css';
import { FaArrowLeft } from "react-icons/fa";
import PlayListSearch from './PlayListSearch';
import { useRecoilState } from 'recoil';
import { postChkAtom } from '../../../state/PostAtom';

// 가수, 노래제목, 발매연도, 앨범이름, 사진, 플리 타이틀, 글, 해시태그, 작성자
function PlayListText({ onClose, playlist, searchQuery }) {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const inputFileRef = useRef(null);
    const [isPlayListSearchOpen, SetIsPlayListSearchOpen] = useState(false);
    const [hashtagList, setHashtagList] = useState([]);
    const [imageSrc, setImageSrc] = useState('');
    const [content, setContent] = useState('');
    const [playlistTitle, setPlaylistTitle] = useState('');
    const musicInfoList = [];
    const [postChk, setPostChk] = useRecoilState(postChkAtom);

    // playlist 배열을 순회하면서 musicInfoList를 추출하여 새로운 배열에 저장
    playlist.forEach(playlist => {
        musicInfoList.push(...playlist.musicInfoList);
    });

    const postPlayList = () => {
        if (!imageSrc) {
            alert("사진을 업로드하세요.")
        } else if (!playlistTitle) {
            alert("타이틀을 입력하세요.")
        } else {
            console.log("플레이리스트 게시 완료")

            const formdata = new FormData();

            if (inputFileRef.current.files[0]) {
                formdata.append("imageFile", inputFileRef.current.files[0], "sample.jpeg");
            }

            formdata.append('playlistRequestDto', new Blob([JSON.stringify({
                title: `${playlistTitle}`,
                content: `${content}`,
                musicInfoList: musicInfoList,
                hashTags: hashtagList.map(tag => ({ tagName: tag.value }))
            })], { type: 'application/json' }));

            var requestOptions = {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formdata,
                redirect: 'follow'
            };

            fetch("http://localhost:8080/api/playlist", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    setPostChk(true);
                    onClose?.();
                })
                .catch(error => console.log('error', error));
        }
    }

    const goPlayListSearch = () => {
        SetIsPlayListSearchOpen(true);
    }

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

    useEffect(() => {
        const input = document.getElementById('hashtagInput');
        const tagify = new Tagify(input);

        // 태그가 추가되면 이벤트 발생
        tagify.on('add', function (e) {
            const tags = tagify.value.map(tag => tag.value); // 입력된 태그 정보 객체의 value만을 리스트로 저장
            console.log("태그", tags);
            setHashtagList(tagify.value);
        });

        // 컴포넌트가 언마운트될 때에는 Tagify 인스턴스를 정리
        return () => {
            tagify.destroy();
        };
    }, []);

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handlePlaylistTitleChange = (event) => {
        setPlaylistTitle(event.target.value);
    }

    const goProfile = () => {
        navigate('/profile');
    }

    //FIXME: 사진 업로드하다가 취소하면 오류 발생
    const onUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            setImageSrc(event.target.result);
        };
        reader.readAsDataURL(file);
        inputFileRef.current.files = e.target.files;
    }

    useOutSideClick(modalRef, handleClose);

    return (
        <div>
            {isPlayListSearchOpen ? null : (
                <ModalContainer>
                    <Overlay>
                        <TextInputModalWrap ref={modalRef}>
                            <Contents>
                                <div className='row'>
                                    <FaArrowLeft className='col' size='28' onClick={() => goPlayListSearch()} style={{ color: "blue", cursor: "pointer" }} />
                                    <h3 className='col-10 text-center'>New PlayList (PlayListText)</h3>
                                    <div className='col'></div>
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <hr style={{ width: "80%" }} />
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <div className='d-flex justify-content-center' style={{ width: "55%" }}>
                                        {(imageSrc === '') ? (
                                            <AiFillPicture className='mt-5' size='300' color='lightblue' />
                                        ) : (
                                            <img className='mt-5' style={{ width: "80%", height: "80%" }} src={imageSrc} alt="Album cover"></img>
                                        )}
                                    </div>
                                    <div style={{ width: "45%" }}>
                                        <div className='d-flex justify-content-start ms-4 mb-3'>
                                        <SiHeadspace className='me-2' size='40' color='black' />
                                        </div>
                                        <div className='d-flex flex-column align-items-center mb-3'>
                                            <input id='titleInput' type="text" className="form-control mb-2" placeholder="타이틀을 입력하세요." onChange={handlePlaylistTitleChange} value={playlistTitle} style={{ width: "90%" }} />
                                            <textarea id='contentInput' type="text" className="form-control mb-2" placeholder="" onChange={handleContentChange} value={content} style={{ width: "90%", height: "250px", resize: "none" }} />
                                            <input id='hashtagInput' type="text" className="form-control" placeholder="해시태그를 추가하세요." />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex justify-content-center mt-1'>
                                    <Button type="button" className="btn btn-primary me-3" onClick={() => inputFileRef.current.click()}>Change Image</Button>
                                    <input ref={inputFileRef} accept="image/*" multiple type="file" style={{ display: 'none' }} onChange={(e) => onUpload(e)} />
                                    <Button className='btn btn-primary' onClick={() => postPlayList()}>Post</Button>
                                </div>
                            </Contents>
                        </TextInputModalWrap>
                    </Overlay>
                </ModalContainer>
            )}

            {isPlayListSearchOpen && (<PlayListSearch
                open={isPlayListSearchOpen}
                searchKeyword={searchQuery}
                onClose={() => {
                    SetIsPlayListSearchOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            />)}

        </div>
    );
}

export default PlayListText;