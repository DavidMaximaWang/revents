export const userDetailedQuery = ({ auth, userUid }) => {
  if (userUid !== null) {
    return [
      {
        collection: "users",
        doc: userUid,
        storeAs: "profile"
      },
      {
        collection: "users",
        doc: userUid,
        subcollections: [{ collection: "photos" }],
        storeAs: "photos"
      }
    ];
  } else {
    return [
      {
        collection: "users",
        doc: auth.userUid,
        subcollections: [{ collection: "photos" }],
        storeAs: "photos"
      }
    ];
  }
};

//subcollections used to be subcollectons, caused the photos missing on refresh page