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
        subcollectons: [{ collection: "photos" }],
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
