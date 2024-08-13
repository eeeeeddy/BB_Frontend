import * as StompJs from "@stomp/stompjs";
import { useEffect, useState } from "react";

export const WebSocket = ({ children }) => {

    const client = useRef(null);
    const [ connected, setConnected ] = useState(false);

    useEffect(()=>{
        connect();

        return()=>{
            disconnect();
        };
    },[]);

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: 'ws://localhost:8080/ws-chat',
            connectHeaders: {
                Authorization: localStorage.getItem('accessToken'),
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                console.log(str);
            },
            onStompError: (frame) => {
                console.error('Stomp error:', frame);
            },
            onConnect: () => {
                // console.log('Connected to server');
                setConnected(true);
            },
        });
        client.current.activate();
    };

    const disconnect = ()=>{
        if(client.current.connected ) {
            client.current.deactivate();
            console.log('Disconnected');
        }
    };


};

