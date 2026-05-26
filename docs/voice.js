const socket = io();

let peer;

let localStream;

let muted = false;

const room =
    localStorage.getItem("room");

document.getElementById(
    "roomText"
).innerText =
    "Room: " + room;

socket.emit(
    "join-room",
    room
);

function createPeer(){

    peer = new RTCPeerConnection({

        iceServers:[
            {
                urls:
                "stun:stun.l.google.com:19302"
            }
        ]
    });

    peer.onicecandidate = event => {

        if(event.candidate){

            socket.emit(
                "candidate",
                event.candidate
            );
        }
    };

    peer.ontrack = event => {

        const audio =
            document.createElement(
                "audio"
            );

        audio.srcObject =
            event.streams[0];

        audio.autoplay = true;

        document.body.appendChild(
            audio
        );
    };
}

document.getElementById(
    "startBtn"
).onclick = async () => {

    localStream =
        await navigator
        .mediaDevices
        .getUserMedia({

            audio:true

        });

    createPeer();

    localStream.getTracks()
    .forEach(track => {

        peer.addTrack(
            track,
            localStream
        );

    });

    document.getElementById(
        "status"
    ).innerText =
        "Voice Connected";
};

document.getElementById(
    "muteBtn"
).onclick = () => {

    if(!localStream) return;

    muted = !muted;

    localStream
    .getAudioTracks()[0]
    .enabled = !muted;

    document.getElementById(
        "muteBtn"
    ).innerText =
        muted
        ? "Unmute"
        : "Mute";

    document.getElementById(
        "status"
    ).innerText =
        muted
        ? "Muted"
        : "Unmuted";
};

document.getElementById(
    "quitBtn"
).onclick = () => {

    if(localStream){

        localStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });
    }

    if(peer){

        peer.close();
    }

    window.location.href =
        "/";
};

socket.on(
    "user-joined",
async () => {

    const offer =
        await peer.createOffer();

    await peer
    .setLocalDescription(
        offer
    );

    socket.emit(
        "offer",
        offer
    );
});

socket.on(
    "offer",
async offer => {

    if(!peer){

        createPeer();
    }

    if(!localStream){

        localStream =
            await navigator
            .mediaDevices
            .getUserMedia({

                audio:true

            });

        localStream
        .getTracks()
        .forEach(track => {

            peer.addTrack(
                track,
                localStream
            );

        });
    }

    await peer
    .setRemoteDescription(
        new RTCSessionDescription(
            offer
        )
    );

    const answer =
        await peer.createAnswer();

    await peer
    .setLocalDescription(
        answer
    );

    socket.emit(
        "answer",
        answer
    );
});

socket.on(
    "answer",
async answer => {

    await peer
    .setRemoteDescription(
        new RTCSessionDescription(
            answer
        )
    );
});

socket.on(
    "candidate",
async candidate => {

    try{

        await peer
        .addIceCandidate(
            candidate
        );

    }catch(err){

        console.error(err);
    }
});