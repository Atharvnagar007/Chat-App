import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoCallPage = () => {
  const roomID = "your_room_id"; // Replace with dynamic room ID if necessary

  const myMeeting = async (element) => {
    const appID = 820840646; // Your App ID
    const serverSecret = "84ee0c35d623417535a51268d84ae758"; // Your server secret

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      "userID",  // Replace with actual user ID
      "userName" // Replace with actual username
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div className="video-call-container" ref={myMeeting} />
  );
};

export default VideoCallPage;
