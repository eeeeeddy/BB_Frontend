import React, { useEffect, useRef, useState } from 'react';
import { SiHeadspace } from "react-icons/si";
import { Overlay, TextInputModalWrap, Contents, Button } from '../../../style/styled_components/PostModal_Style';
import ModalContainer from '../Config/ModalContainer';
import useOutSideClick from '../../../hooks/useOutSideClick';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../../../style/css/Hashtag.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import PostPicSelect from './PostPicSelect';
import { postChkAtom } from '../../../state/PostAtom';
import { useRecoilState } from 'recoil';

// 가수, 노래제목, 발매연도, 앨범이름, 사진, 글, 해시태그, 작성자, 비디오아이디
function PostText({ onClose, videoId, albumImage, musicTitle, musicArtist, albumName, releaseDate }) {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const inputFileRef = useRef(null);
    const [isPostPicSelectOpen, setIsPostPicSelectOpen] = useState(false);
    const [hashtagList, setHashtagList] = useState([]);
    const [content, setContent] = useState('');
    const [imageSrc, setImageSrc] = useState(albumImage);
    const [postChk, setPostChk] = useRecoilState(postChkAtom);

    const postFeed = () => {
        console.log(
            "글 작성 완료 \n",
            "제목: ", musicTitle, "\n",
            "가수: ", musicArtist, "\n",
            "앨범명 : ", albumName, "\n",
            "발매연도 : ", releaseDate, "\n",
            "비디오아이디 : ", videoId, "\n",
            "이미지: ", { albumImage }, "\n",
            "내용: ", content, "\n",
            "해시태그 리스트: ", hashtagList.map(tag => ({ tagName: tag }))
        )

        const formdata = new FormData();

        if (inputFileRef.current.files[0]) {
            formdata.append("imageFile", inputFileRef.current.files[0], "sample.jpeg");
        }

        formdata.append('feedRequestDto', new Blob([JSON.stringify({
            content: `${content}`,
            musicInfo: {
                musicArtist: `${musicArtist}`,
                releaseDate: `${releaseDate}`,
                musicTitle: `${musicTitle}`,
                albumName: `${albumName}`,
                videoId: `${videoId}`,
                albumUrl: `${albumImage}`
            },
            albumSrc: `${albumImage}`,
            hashTags: hashtagList.map(tag => ({ tagName: tag }))
        })], { type: 'application/json' }));

        var requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/feeds", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                setPostChk(true);
                onClose?.();
            })
            .catch(error => console.log('error', error));
    }

    const goPostPicSelect = () => {
        setIsPostPicSelectOpen(true);
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
            setHashtagList(tags)
        });

        // 컴포넌트가 언마운트될 때에는 Tagify 인스턴스를 정리
        return () => {
            tagify.destroy();
        };
    }, []);

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

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
            {isPostPicSelectOpen ? null : (
                <ModalContainer>
                    <Overlay>
                        <TextInputModalWrap ref={modalRef}>
                            <Contents>
                                <div className='row'>
                                    <FaArrowLeft className='col' size='28' onClick={() => goPostPicSelect()} style={{ color: "blue", cursor: "pointer" }} />
                                    <h3 className='col-10 text-center'>New Post (PostText)</h3>
                                    <div className='col'></div>
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <hr style={{ width: "80%" }} />
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <div className='d-flex justify-content-center' style={{ width: "55%" }}>
                                        <img className='mt-5' style={{ width: "80%", height: "80%" }} src={imageSrc} alt="Album cover" />
                                    </div>
                                    <div style={{ width: "45%" }}>
                                        <div className='d-flex justify-content-start ms-4 mb-3'>
                                            <SiHeadspace className='me-2' size='40' color='black' />
                                        </div>
                                        <div className='d-flex flex-column align-items-center mb-3'>
                                            <textarea id='contentInput' type="text" className="form-control mb-2" placeholder="" onChange={handleContentChange} value={content} style={{ width: "90%", height: "280px", resize: "none" }} />
                                            <input id='hashtagInput' type="text" className="form-control" placeholder="해시태그를 추가하세요." />
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex justify-content-center mt-1'>
                                    <Button type="button" className="btn btn-primary me-3" onClick={() => inputFileRef.current.click()}>Change Image</Button>
                                    <input ref={inputFileRef} accept="image/*" multiple type="file" style={{ display: 'none' }} onChange={(e) => onUpload(e)} />
                                    <Button className='btn btn-primary' onClick={() => postFeed()}>Post</Button>
                                </div>
                            </Contents>
                        </TextInputModalWrap>
                    </Overlay>
                </ModalContainer>
            )}

            {/* TODO: 이전으로 돌아갈 때 검색한 정보 유지되도록 */}
            {isPostPicSelectOpen && (<PostPicSelect
                open={isPostPicSelectOpen}
                onClose={() => {
                    setIsPostPicSelectOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            />)}

        </div>
    );
}

export default PostText;
