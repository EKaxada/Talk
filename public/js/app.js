window.addEventListener("load", () => {
  //chat platform
  const chatTemplate = Handlebars.compile($("#chat-template").html());
  const chatContentTemplate = Handlebars.compile(
    $("#chat-content-template").html()
  );
  const chatEl = $("chat");
  const formEL = $(".form");
  const messages = [];
  let username;

  //local video
  const localImageEl = $("#local-image");
  const localVideoEl = $("#local-video");

  //Remote videos
  const remoteVideoTemplate = Handlebars.compile(
    $("#remote-video-template").html()
  );
  const remoteVideosEl = $("#remote-videos");
  let remoteVideoCount = 0;

  //hide camera until initialized
  localVideoEl.hide();

  //Add Validation rules to Create/Join Room Form
  formEL.form({
    fields: {
      roomName: "empty",
      userName: "empty",
    },
  });

  //create WebRTC connection
  const webrtc = new SimpleWebRTC({
    //dom element to hold  the video
    localVideoEl: "local-video",

    //element to hold remote videos
    remoteVideosEl: "remote-videos",

    //immediately ask camera access
    autoRequestMeida: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false,
  });

  //after access to local camera
  webrtc.on("localStream", () => {
    localImageEl.hide();
    localVideoEl.show();
  });

  //creating and joining room using room template
  $(".submit").on("click", (event) => {
    if (!formEL.form("is valid")) {
      return false;
    }

    username = $("#username").val();
    const roomName = $("#roomName").val().toLowerCase();
    if (event.target.id === "create-btn") {
      createRoom(roomName);
    } else {
      joinRoom(roomName);
    }
    return false;
  });

  //register new chat room
  const createRooom = (roomName) => {
    console.info(`Creating new room: ${roomName}`);
    webrtc.createRoom(roomName, (err, name) => {
      showChatRoom(name);
      postMessage(`${username} created chatroom`)
    })
  }

  //Join existing chat room
  const joinRoom = roomName => {
    console.log(`Joining Room: ${roomName}`);
    webrtc.joinRooom(roomName);
    showChatRoom(roomName);
    postMessage(`${username} joined chatroom`);
  }
});
