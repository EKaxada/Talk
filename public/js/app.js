window.addEventListener("load", () => {
    //chat platform
    const chatTemplate = Handlebars.compile($("#chat-template").html());
    const chatContentTemplate = Handlebars.compile($("#chat-content-template").html());
    const chatEl = $("chat");
    const formEL = $(".form");
    const messages = [];
    let username;

    //local video
    const localImageEl = $("#local-image");
    const localVideoEl = $("#local-video");

    //Remote videos
    const remoteVideoTemplate = Handlebars.compile($("#remote-video-template").html());
    const remoteVideosEl = $("#remote-videos");
    let remoteVideoCount = 0;

    //Add Validation rules to Create/Join Room Form
    formEL.form({
        fields: {
            roomName: "empty",
            userName: "empty",

        }
    });

})