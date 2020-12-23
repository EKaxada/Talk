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

  //posting local message
  const postMessage = message => {
    const chatMessage = {
      username,
      message,
      postedOn: new Date().toLocaleString("en-GB");
    };

    //send to all people in chatroom
    webrtc.sendToAll("chat", chatMessage);
    //update messages locally
    messages.push(chatMessage);
    $("#post-message").val("");
    updateChatMessages();
  }

  // Display chat interfaces
  const showChatRoom = room => {
    //hide form
    formEL.hide();
    const html = chatTemplate({room})
    chatEl.html(html);
    const postForm = $("form");

    //post message validation rules
    postForm.form({
      message: "empty",
    });
    $("#post-btn").on("click", () => {
      const message = $("3post-message").val();
      postMessage(message);
    })
    $("#post-message").on("keyup", event => {
      if (event.keyCode === 13) {
        const message = $("#post-message").val();
        postMessage(message)
      }
    })
  }

  //update chat messages
  const updateChatMessages = () => {
    const html = chatContentTemplate({messages});
    const chatContentEl = $("#chat-content");
    chatContentEl.html(html);

    //automatically scroll downwards
    const scrollHeight = chatContentEl.prop("scrollHeight");
    chatContentEl.animate({scrollTop: scrollHeight
    }, slow)
  };

  // receive message from user
  webrtc.connection.on("message", data => {
    id(data.type === "chat") {
      const message = data.payload;
      messages.push(message);
      updateChatMessages();
    }
  })

  //adding multiple peers
  webrtc.on("videoAdded", (video, peer) => {
    const id = webrtc.getDomIn(peer);
    const html = remoteVideoTemplate({id});
    if(remoteVideoCount === 0) {
      remoteVideosEl.html(html);
    } else {
      remoteVideosEl.append(html);
    }
    $(`#${id}`).html(video);
    $(`#{id} video`).addClass("ui image medium"); //makes element responsive
    remoteVideoCount += 1;
  })

});
