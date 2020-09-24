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
});
