document.getElementById("createBtn")
.onclick = () => {

    const room = Math.random()
        .toString(36)
        .substring(2,8);

    localStorage.setItem(
        "room",
        room
    );

    window.location.href =
        "voice.html";
};

document.getElementById("joinBtn")
.onclick = () => {

    const room =
        document.getElementById(
            "roomInput"
        ).value;

    if(!room){

        alert("Enter Room ID");

        return;
    }

    localStorage.setItem(
        "room",
        room
    );

    window.location.href =
        "voice.html";
};