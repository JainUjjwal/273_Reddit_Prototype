const connection = require("../config/mysql_config");
const Community = require("../models/Community");
const UserProfile = require("../models/UserProfile");

const sendInvite = async (req, res) => {
  const sendMongoInvite = async (i) => {
    await UserProfile.findOneAndUpdate(
      { _id: req.body.users[i]._id },
      {
        $addToSet: {
          communityStatus: {
            communityID: req.body.community.CommunityID,
            status: req.body.status,
            invitedBy: req.body.community.CommunityOwner,
          },
        },
      },
      { useFindAndModify: false },
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };
  console.log("In send invite API");
  //   console.log(req.body);
  await Community.findById(
    req.body.community.CommunityID,
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let existingUsers = [];
        for (let i = 0; i < req.body.users.length; i++) {
          //Check if the user is already part of the community they are being invited to
          if (result.subscribedBy.includes(req.body.users[i]._id)) {
            // Can't invite user[i] cuz they are already part of community
            // Store the users already part of the community
            existingUsers.push(req.body.users[i].username);
            continue;
          } else {
            // The user hasn't joined the community yet
            await UserProfile.findById(
              req.body.users[i]._id,
              async (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  // Check if the user is already invited
                  if (result.communityStatus.length != 0) {
                    for (let j = 0; j < result.communityStatus.length; j++) {
                      if (result.communityStatus[j].communityID == req.body.community.CommunityID &&
                        result.communityStatus[j].status == req.body.status
                      ) {
                        // Invite found, user added to array
                        existingUsers.push(req.body.users[i].username);
                        break;
                      } else {
                        // Send the user an invite
                        console.log("\nSENDING INVITE\n");
                        sendMongoInvite(i);
                      }
                    }
                  } else {
                    sendMongoInvite(i);
                  }
                }
              }
            );
          }
        }
        if (existingUsers.length > 0) {
          const allUsers = existingUsers.join(", ");
          return res.status(201).json({
            message: `The user/users:" ${allUsers} " is/are already invited or part of the community.`,
          });
        }
        return res.status(200).json({ message: "OK" });
      }
    }
  );
};

const getOwnerInvites = async (req, res) => {
  // an array of objects containing 1. name of user, 2. status of invite, 3. timestamp
  let arrToSend = []
  const usercomms = await UserProfile.find();
  const owner = await UserProfile.find({email: req.body.email});
  for (let i = 0; i<usercomms.length; i++){
   for(let j =0; j< usercomms[i].communityStatus.length; j++){
    console.log(usercomms[i].communityStatus[j])
    console.log(owner[0]._id)
    console.log(usercomms[i].username)
    if(true){
      let communityInformation = await Community.findById(usercomms[i].communityStatus[j].communityID)
      let item = {
        name:usercomms[i].username,
        inviteStatus: usercomms[i].communityStatus[j].status,
        timeStamp: usercomms[i].communityStatus[j].ts,
        communityName: communityInformation.communityName
      }
      arrToSend.push(item)
      console.log('////////////////////')
    }
   }
  }
  if(arrToSend.length>0){
    arrToSend.sort((a, b) => (a.timeStamp < b.timeStamp) ? 1 : -1)
    console.log(arrToSend)
    return res.status(200).json({inviteInfo:arrToSend})
  }else{
    return res.status(201).json({message:'No Invites Sent'})
  }
};

module.exports = {
  sendInvite,
  getOwnerInvites
};
