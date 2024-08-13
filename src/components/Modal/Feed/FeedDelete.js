import React, {useRef} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { PC,Mobile } from "../../Responsive";
import ModalContainer from "../Config/ModalContainer";
import { Contents, ModalWrap, Overlay } from "../../../style/styled_components/PostModal_Style";
import useOutSideClick from "../../../hooks/useOutSideClick";
import { CloseButton } from 'react-bootstrap';

function FeedDelete({ onClose, feedId }){
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const handleClose = () => {
        onClose?.();
    };

    const handleDeleteClick = async () =>{
        try{
            const res = await axios.delete(`http://localhost:8080/api/feeds/${feedId}`,{
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'ngrok-skip-browser-warning': '69420',
                },
            });
            console.log("삭제성공",res.data);
            handleClose();

        } catch(error){
            console.error("에러발생", error);
        }
    }

    useOutSideClick(modalRef, handleClose)

    return(
        <div>
            <PC>
                <div>
                    <ModalContainer>
                        <Overlay>
                            <ModalWrap ref={modalRef}>
                                <CloseButton class="btn-close btn-close-white" aria-label="Close" onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px' }}></CloseButton>
                                <Contents>
                                    <h3 className='d-flex justify-content-center'>Delete Post</h3>
                                    <div className='d-flex justify-content-center mb-3'>
                                        <hr style={{ width: "80%" }} />
                                    </div>

                                    <div className='d-flex justify-content-center mt-5 pt-5'>
                                        <div className='me-5'>
                                            <button  className='btn btn-primary' onClick={handleDeleteClick} >삭제</button>
                                        </div>
                                        <div className='me-5'>
                                            <button className='btn btn-primary' onClick={handleClose}>취소</button>
                                        </div>
                                    </div>
                                </Contents>
                            </ModalWrap>
                        </Overlay>
                    </ModalContainer>
                </div>
            </PC>


            <Mobile></Mobile>
        </div>
    );
}

export default FeedDelete;